import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { FeeTrack } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("FeeTrack Smart Contract", function () {
  let feeTrack: FeeTrack;
  let admin1: HardhatEthersSigner;
  let admin2: HardhatEthersSigner;
  let user: HardhatEthersSigner;

  const STUDENT_REF = "STU-2026-9041";
  const DESCRIPTION = "Term 1 Tuition 2026";
  const AMOUNT = ethers.parseEther("0.5"); // 0.5 ETH/BOHR
  let validDueDate: number;

  beforeEach(async function () {
    [admin1, admin2, user] = await ethers.getSigners();

    const FeeTrackFactory = await ethers.getContractFactory("FeeTrack");
    feeTrack = (await FeeTrackFactory.deploy()) as FeeTrack;
    await feeTrack.waitForDeployment();

    const latestBlockTime = await time.latest();
    validDueDate = latestBlockTime + 7 * 24 * 60 * 60; // 7 days from now
  });

  describe("Fee Registration", function () {
    it("should successfully register a fee record and emit FeeRegistered event", async function () {
      const tx = await feeTrack
        .connect(admin1)
        .registerFee(STUDENT_REF, DESCRIPTION, AMOUNT, validDueDate);

      await expect(tx)
        .to.emit(feeTrack, "FeeRegistered")
        .withArgs(1, admin1.address, STUDENT_REF, AMOUNT, validDueDate);

      const totalFees = await feeTrack.getTotalFees();
      expect(totalFees).to.equal(1);

      const fee = await feeTrack.getFee(1);
      expect(fee.feeId).to.equal(1);
      expect(fee.admin).to.equal(admin1.address);
      expect(fee.studentRef).to.equal(STUDENT_REF);
      expect(fee.description).to.equal(DESCRIPTION);
      expect(fee.amount).to.equal(AMOUNT);
      expect(fee.dueDate).to.equal(validDueDate);
      expect(fee.status).to.equal(0); // Unpaid
      expect(fee.paidTimestamp).to.equal(0);
      expect(fee.createdAt).to.be.gt(0);
    });

    it("should generate sequentially unique Fee IDs", async function () {
      await feeTrack.connect(admin1).registerFee("REF-001", "Fee 1", AMOUNT, validDueDate);
      await feeTrack.connect(admin1).registerFee("REF-002", "Fee 2", AMOUNT, validDueDate);
      await feeTrack.connect(admin2).registerFee("REF-003", "Fee 3", AMOUNT, validDueDate);

      expect(await feeTrack.getTotalFees()).to.equal(3);

      const fee1 = await feeTrack.getFee(1);
      const fee2 = await feeTrack.getFee(2);
      const fee3 = await feeTrack.getFee(3);

      expect(fee1.feeId).to.equal(1);
      expect(fee2.feeId).to.equal(2);
      expect(fee3.feeId).to.equal(3);
    });

    it("should reject empty student reference", async function () {
      await expect(
        feeTrack.connect(admin1).registerFee("", DESCRIPTION, AMOUNT, validDueDate)
      ).to.be.revertedWithCustomError(feeTrack, "EmptyStudentReference");
    });

    it("should reject empty fee description", async function () {
      await expect(
        feeTrack.connect(admin1).registerFee(STUDENT_REF, "", AMOUNT, validDueDate)
      ).to.be.revertedWithCustomError(feeTrack, "EmptyFeeDescription");
    });

    it("should reject zero fee amount", async function () {
      await expect(
        feeTrack.connect(admin1).registerFee(STUDENT_REF, DESCRIPTION, 0, validDueDate)
      ).to.be.revertedWithCustomError(feeTrack, "ZeroFeeAmount");
    });

    it("should reject invalid payment deadlines (past or current timestamp)", async function () {
      const currentTime = await time.latest();
      await expect(
        feeTrack.connect(admin1).registerFee(STUDENT_REF, DESCRIPTION, AMOUNT, currentTime)
      ).to.be.revertedWithCustomError(feeTrack, "InvalidPaymentDeadline");

      await expect(
        feeTrack.connect(admin1).registerFee(STUDENT_REF, DESCRIPTION, AMOUNT, currentTime - 100)
      ).to.be.revertedWithCustomError(feeTrack, "InvalidPaymentDeadline");
    });
  });

  describe("Marking Fees as Paid / Unpaid", function () {
    beforeEach(async function () {
      await feeTrack.connect(admin1).registerFee(STUDENT_REF, DESCRIPTION, AMOUNT, validDueDate);
    });

    it("should allow the creator admin to mark fee as Paid", async function () {
      const tx = await feeTrack.connect(admin1).markFeePaid(1);
      const feeAfter = await feeTrack.getFee(1);

      expect(feeAfter.status).to.equal(1); // Paid
      expect(feeAfter.paidTimestamp).to.be.gt(0);

      await expect(tx)
        .to.emit(feeTrack, "FeePaid")
        .withArgs(1, admin1.address, feeAfter.paidTimestamp);
    });

    it("should prevent non-admin from marking fee as Paid", async function () {
      await expect(feeTrack.connect(admin2).markFeePaid(1))
        .to.be.revertedWithCustomError(feeTrack, "Unauthorized")
        .withArgs(admin2.address, admin1.address);
    });

    it("should revert if fee is already marked Paid", async function () {
      await feeTrack.connect(admin1).markFeePaid(1);
      await expect(feeTrack.connect(admin1).markFeePaid(1))
        .to.be.revertedWithCustomError(feeTrack, "FeeAlreadyPaid")
        .withArgs(1);
    });

    it("should allow the creator admin to mark fee back to Unpaid", async function () {
      await feeTrack.connect(admin1).markFeePaid(1);
      expect((await feeTrack.getFee(1)).status).to.equal(1);

      const tx = await feeTrack.connect(admin1).markFeeUnpaid(1);
      await expect(tx).to.emit(feeTrack, "FeeUnpaid").withArgs(1, admin1.address);

      const feeAfter = await feeTrack.getFee(1);
      expect(feeAfter.status).to.equal(0); // Unpaid
      expect(feeAfter.paidTimestamp).to.equal(0);
    });

    it("should revert if fee is already Unpaid", async function () {
      await expect(feeTrack.connect(admin1).markFeeUnpaid(1))
        .to.be.revertedWithCustomError(feeTrack, "FeeAlreadyUnpaid")
        .withArgs(1);
    });

    it("should prevent non-admin from marking fee as Unpaid", async function () {
      await feeTrack.connect(admin1).markFeePaid(1);
      await expect(feeTrack.connect(admin2).markFeeUnpaid(1))
        .to.be.revertedWithCustomError(feeTrack, "Unauthorized")
        .withArgs(admin2.address, admin1.address);
    });

    it("should revert if feeId does not exist", async function () {
      await expect(feeTrack.connect(admin1).markFeePaid(999))
        .to.be.revertedWithCustomError(feeTrack, "FeeNotFound")
        .withArgs(999);
    });
  });

  describe("Updating Fee Details", function () {
    beforeEach(async function () {
      await feeTrack.connect(admin1).registerFee(STUDENT_REF, DESCRIPTION, AMOUNT, validDueDate);
    });

    it("should allow the creator admin to update fee details", async function () {
      const newDesc = "Updated Term 1 Lab Fee";
      const newAmount = ethers.parseEther("0.75");
      const newDueDate = validDueDate + 86400;

      const tx = await feeTrack.connect(admin1).updateFee(1, newDesc, newAmount, newDueDate);

      await expect(tx)
        .to.emit(feeTrack, "FeeUpdated")
        .withArgs(1, admin1.address, newDesc, newAmount, newDueDate);

      const updatedFee = await feeTrack.getFee(1);
      expect(updatedFee.description).to.equal(newDesc);
      expect(updatedFee.amount).to.equal(newAmount);
      expect(updatedFee.dueDate).to.equal(newDueDate);
    });

    it("should prevent unauthorized users from updating fee details", async function () {
      await expect(
        feeTrack.connect(admin2).updateFee(1, "Hacked", ethers.parseEther("1"), validDueDate)
      )
        .to.be.revertedWithCustomError(feeTrack, "Unauthorized")
        .withArgs(admin2.address, admin1.address);
    });

    it("should reject updates with empty description, zero amount, or invalid due date", async function () {
      await expect(
        feeTrack.connect(admin1).updateFee(1, "", AMOUNT, validDueDate)
      ).to.be.revertedWithCustomError(feeTrack, "EmptyFeeDescription");

      await expect(
        feeTrack.connect(admin1).updateFee(1, "Valid", 0, validDueDate)
      ).to.be.revertedWithCustomError(feeTrack, "ZeroFeeAmount");

      const currentTime = await time.latest();
      await expect(
        feeTrack.connect(admin1).updateFee(1, "Valid", AMOUNT, currentTime - 10)
      ).to.be.revertedWithCustomError(feeTrack, "InvalidPaymentDeadline");
    });
  });

  describe("Retrieval and My Fees", function () {
    it("should return all fee records registered by the connected admin", async function () {
      await feeTrack.connect(admin1).registerFee("S1", "Fee A", AMOUNT, validDueDate);
      await feeTrack.connect(admin2).registerFee("S2", "Fee B", AMOUNT, validDueDate);
      await feeTrack.connect(admin1).registerFee("S3", "Fee C", AMOUNT * 2n, validDueDate);

      const admin1Fees = await feeTrack.connect(admin1).getMyFees();
      expect(admin1Fees.length).to.equal(2);
      expect(admin1Fees[0].studentRef).to.equal("S1");
      expect(admin1Fees[1].studentRef).to.equal("S3");

      const admin2Fees = await feeTrack.connect(admin2).getMyFees();
      expect(admin2Fees.length).to.equal(1);
      expect(admin2Fees[0].studentRef).to.equal("S2");

      const userFees = await feeTrack.connect(user).getMyFees();
      expect(userFees.length).to.equal(0);
    });

    it("should revert getFee for non-existent fee IDs", async function () {
      await expect(feeTrack.getFee(0)).to.be.revertedWithCustomError(feeTrack, "FeeNotFound");
      await expect(feeTrack.getFee(5)).to.be.revertedWithCustomError(feeTrack, "FeeNotFound");
    });
  });

  describe("Statistics Calculation", function () {
    it("should accurately report total, paid, unpaid, and total amount statistics", async function () {
      const amount1 = ethers.parseEther("1.0");
      const amount2 = ethers.parseEther("2.5");
      const amount3 = ethers.parseEther("1.5");

      await feeTrack.connect(admin1).registerFee("S1", "Desc 1", amount1, validDueDate);
      await feeTrack.connect(admin1).registerFee("S2", "Desc 2", amount2, validDueDate);
      await feeTrack.connect(admin2).registerFee("S3", "Desc 3", amount3, validDueDate);

      // Initially 3 total, 0 paid, 3 unpaid, 5.0 ETH total
      let stats = await feeTrack.getFeeStatistics();
      expect(stats.totalRecords).to.equal(3);
      expect(stats.paidRecords).to.equal(0);
      expect(stats.unpaidRecords).to.equal(3);
      expect(stats.totalAmount).to.equal(ethers.parseEther("5.0"));

      // Mark Fee 1 as Paid
      await feeTrack.connect(admin1).markFeePaid(1);
      stats = await feeTrack.getFeeStatistics();
      expect(stats.totalRecords).to.equal(3);
      expect(stats.paidRecords).to.equal(1);
      expect(stats.unpaidRecords).to.equal(2);
      expect(stats.totalAmount).to.equal(ethers.parseEther("5.0"));

      // Update Fee 2 amount from 2.5 to 3.0
      await feeTrack
        .connect(admin1)
        .updateFee(2, "Desc 2 Updated", ethers.parseEther("3.0"), validDueDate);
      stats = await feeTrack.getFeeStatistics();
      expect(stats.totalAmount).to.equal(ethers.parseEther("5.5"));

      // Mark Fee 1 back to Unpaid
      await feeTrack.connect(admin1).markFeeUnpaid(1);
      stats = await feeTrack.getFeeStatistics();
      expect(stats.paidRecords).to.equal(0);
      expect(stats.unpaidRecords).to.equal(3);
    });
  });
});
