// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title FeeTrack
 * @notice On-chain school fee payment record management application for schools and educational institutions.
 * @dev Records fee payment statuses on-chain. Does not process or escrow currency payments directly.
 */
contract FeeTrack {
    enum PaymentStatus {
        Unpaid,
        Paid
    }

    struct FeeRecord {
        uint256 feeId;
        address admin;
        string studentRef;
        string description;
        uint256 amount;
        uint256 dueDate;
        PaymentStatus status;
        uint256 paidTimestamp;
        uint256 createdAt;
    }

    // Custom errors
    error FeeNotFound(uint256 feeId);
    error Unauthorized(address caller, address expectedAdmin);
    error EmptyStudentReference();
    error EmptyFeeDescription();
    error ZeroFeeAmount();
    error InvalidPaymentDeadline(uint256 providedDueDate, uint256 currentTimestamp);
    error FeeAlreadyPaid(uint256 feeId);
    error FeeAlreadyUnpaid(uint256 feeId);

    // Events
    event FeeRegistered(
        uint256 indexed feeId,
        address indexed admin,
        string studentRef,
        uint256 amount,
        uint256 dueDate
    );

    event FeePaid(
        uint256 indexed feeId,
        address indexed admin,
        uint256 paidTimestamp
    );

    event FeeUnpaid(
        uint256 indexed feeId,
        address indexed admin
    );

    event FeeUpdated(
        uint256 indexed feeId,
        address indexed admin,
        string description,
        uint256 amount,
        uint256 dueDate
    );

    // State variables
    uint256 private _feeCounter;
    uint256 private _paidCount;
    uint256 private _totalAmount;

    mapping(uint256 => FeeRecord) private _fees;
    mapping(address => uint256[]) private _adminFeeIds;

    /**
     * @notice Registers a new fee record.
     * @param studentRef Anonymous student reference identifier.
     * @param description Brief fee description (e.g. "Term 1 Tuition 2026").
     * @param amount Fee amount in base currency unit / wei.
     * @param dueDate Unix timestamp for payment deadline (must be in the future).
     * @return feeId The unique ID assigned to the new fee record.
     */
    function registerFee(
        string calldata studentRef,
        string calldata description,
        uint256 amount,
        uint256 dueDate
    ) external returns (uint256 feeId) {
        if (bytes(studentRef).length == 0) {
            revert EmptyStudentReference();
        }
        if (bytes(description).length == 0) {
            revert EmptyFeeDescription();
        }
        if (amount == 0) {
            revert ZeroFeeAmount();
        }
        if (dueDate <= block.timestamp) {
            revert InvalidPaymentDeadline(dueDate, block.timestamp);
        }

        unchecked {
            _feeCounter++;
        }
        feeId = _feeCounter;

        _fees[feeId] = FeeRecord({
            feeId: feeId,
            admin: msg.sender,
            studentRef: studentRef,
            description: description,
            amount: amount,
            dueDate: dueDate,
            status: PaymentStatus.Unpaid,
            paidTimestamp: 0,
            createdAt: block.timestamp
        });

        _adminFeeIds[msg.sender].push(feeId);
        _totalAmount += amount;

        emit FeeRegistered(feeId, msg.sender, studentRef, amount, dueDate);
        return feeId;
    }

    /**
     * @notice Marks a fee record as Paid. Only callable by the record's creator admin.
     * @param feeId Unique Fee ID.
     */
    function markFeePaid(uint256 feeId) external {
        if (feeId == 0 || feeId > _feeCounter) {
            revert FeeNotFound(feeId);
        }

        FeeRecord storage record = _fees[feeId];
        if (record.admin != msg.sender) {
            revert Unauthorized(msg.sender, record.admin);
        }
        if (record.status == PaymentStatus.Paid) {
            revert FeeAlreadyPaid(feeId);
        }

        record.status = PaymentStatus.Paid;
        record.paidTimestamp = block.timestamp;
        unchecked {
            _paidCount++;
        }

        emit FeePaid(feeId, msg.sender, record.paidTimestamp);
    }

    /**
     * @notice Marks a fee record as Unpaid. Only callable by the record's creator admin.
     * @param feeId Unique Fee ID.
     */
    function markFeeUnpaid(uint256 feeId) external {
        if (feeId == 0 || feeId > _feeCounter) {
            revert FeeNotFound(feeId);
        }

        FeeRecord storage record = _fees[feeId];
        if (record.admin != msg.sender) {
            revert Unauthorized(msg.sender, record.admin);
        }
        if (record.status == PaymentStatus.Unpaid) {
            revert FeeAlreadyUnpaid(feeId);
        }

        record.status = PaymentStatus.Unpaid;
        record.paidTimestamp = 0;
        unchecked {
            _paidCount--;
        }

        emit FeeUnpaid(feeId, msg.sender);
    }

    /**
     * @notice Updates the description, amount, and due date of an existing fee record.
     * @param feeId Unique Fee ID.
     * @param description New fee description.
     * @param amount New fee amount.
     * @param dueDate New payment due date.
     */
    function updateFee(
        uint256 feeId,
        string calldata description,
        uint256 amount,
        uint256 dueDate
    ) external {
        if (feeId == 0 || feeId > _feeCounter) {
            revert FeeNotFound(feeId);
        }

        FeeRecord storage record = _fees[feeId];
        if (record.admin != msg.sender) {
            revert Unauthorized(msg.sender, record.admin);
        }
        if (bytes(description).length == 0) {
            revert EmptyFeeDescription();
        }
        if (amount == 0) {
            revert ZeroFeeAmount();
        }
        if (dueDate <= block.timestamp) {
            revert InvalidPaymentDeadline(dueDate, block.timestamp);
        }

        // Adjust total recorded amount
        _totalAmount = _totalAmount - record.amount + amount;

        record.description = description;
        record.amount = amount;
        record.dueDate = dueDate;

        emit FeeUpdated(feeId, msg.sender, description, amount, dueDate);
    }

    /**
     * @notice Retrieves fee details by Fee ID.
     * @param feeId Unique Fee ID.
     * @return FeeRecord struct with full record details.
     */
    function getFee(uint256 feeId) external view returns (FeeRecord memory) {
        if (feeId == 0 || feeId > _feeCounter) {
            revert FeeNotFound(feeId);
        }
        return _fees[feeId];
    }

    /**
     * @notice Returns all fee records registered by the caller.
     * @return Array of FeeRecord structs.
     */
    function getMyFees() external view returns (FeeRecord[] memory) {
        uint256[] storage feeIds = _adminFeeIds[msg.sender];
        uint256 length = feeIds.length;
        FeeRecord[] memory records = new FeeRecord[](length);

        for (uint256 i = 0; i < length; ) {
            records[i] = _fees[feeIds[i]];
            unchecked {
                i++;
            }
        }

        return records;
    }

    /**
     * @notice Returns the total count of registered fee records.
     */
    function getTotalFees() external view returns (uint256) {
        return _feeCounter;
    }

    /**
     * @notice Returns global fee statistics.
     * @return totalRecords Total number of fee records created.
     * @return paidRecords Total number of fee records currently marked Paid.
     * @return unpaidRecords Total number of fee records currently marked Unpaid.
     * @return totalAmount Aggregate recorded fee amount across all records.
     */
    function getFeeStatistics()
        external
        view
        returns (
            uint256 totalRecords,
            uint256 paidRecords,
            uint256 unpaidRecords,
            uint256 totalAmount
        )
    {
        totalRecords = _feeCounter;
        paidRecords = _paidCount;
        unpaidRecords = _feeCounter - _paidCount;
        totalAmount = _totalAmount;
    }
}

