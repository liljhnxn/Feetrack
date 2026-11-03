export const FEE_TRACK_ABI = [
  {
    "type": "error",
    "name": "EmptyFeeDescription",
    "inputs": []
  },
  {
    "type": "error",
    "name": "EmptyStudentReference",
    "inputs": []
  },
  {
    "type": "error",
    "name": "FeeAlreadyPaid",
    "inputs": [
      {
        "name": "feeId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "FeeAlreadyUnpaid",
    "inputs": [
      {
        "name": "feeId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "FeeNotFound",
    "inputs": [
      {
        "name": "feeId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidPaymentDeadline",
    "inputs": [
      {
        "name": "providedDueDate",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "currentTimestamp",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "Unauthorized",
    "inputs": [
      {
        "name": "caller",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "expectedAdmin",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ZeroFeeAmount",
    "inputs": []
  },
  {
    "type": "event",
    "name": "FeePaid",
    "inputs": [
      {
        "name": "feeId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "admin",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "paidTimestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "FeeRegistered",
    "inputs": [
      {
        "name": "feeId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "admin",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "studentRef",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "dueDate",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "FeeUnpaid",
    "inputs": [
      {
        "name": "feeId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "admin",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "FeeUpdated",
    "inputs": [
      {
        "name": "feeId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "admin",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "description",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "dueDate",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "function",
    "name": "getFee",
    "inputs": [
      {
        "name": "feeId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct FeeTrack.FeeRecord",
        "components": [
          {
            "name": "feeId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "admin",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "studentRef",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "dueDate",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "status",
            "type": "uint8",
            "internalType": "enum FeeTrack.PaymentStatus"
          },
          {
            "name": "paidTimestamp",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "createdAt",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getFeeStatistics",
    "inputs": [],
    "outputs": [
      {
        "name": "totalRecords",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "paidRecords",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "unpaidRecords",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMyFees",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct FeeTrack.FeeRecord[]",
        "components": [
          {
            "name": "feeId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "admin",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "studentRef",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "dueDate",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "status",
            "type": "uint8",
            "internalType": "enum FeeTrack.PaymentStatus"
          },
          {
            "name": "paidTimestamp",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "createdAt",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTotalFees",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "markFeePaid",
    "inputs": [
      {
        "name": "feeId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "markFeeUnpaid",
    "inputs": [
      {
        "name": "feeId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "registerFee",
    "inputs": [
      {
        "name": "studentRef",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "description",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "dueDate",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "feeId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateFee",
    "inputs": [
      {
        "name": "feeId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "description",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "dueDate",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
] as const;

