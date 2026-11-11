# FeeTrack - Web3 School Fee Payment Record Management

**FeeTrack** is a lightweight, transparent, and decentralized on-chain school fee payment record management application for schools and educational institutions, deployed natively on **BOT Chain Mainnet**.

School administrators can register student fee records, set fee amounts and payment deadlines, and record whether fees have been paid. Students, parents, and sponsors can look up payment records using a unique **Fee ID** without connecting a wallet.

---

## 🌐 BOT Chain Mainnet Network Details

* **Network**: BOT Chain Mainnet
* **Chain ID**: `677`
* **RPC URL**: `https://rpc.botchain.ai`
* **Native Token**: `BOT`
* **Total Supply**: `150 Million`
* **BOT Chain Website**: [https://botchain.ai](https://botchain.ai)
* **BOT Chain Explorer**: [https://scan.botchain.ai](https://scan.botchain.ai)
* **Deployed Contract**: [`0x734Ff1ff575f3229A896761694B235Ea53B780A3`](https://scan.botchain.ai/address/0x734Ff1ff575f3229A896761694B235Ea53B780A3)
* **Source Code Verification**: [Verified on BotchainScan](https://scan.botchain.ai/address/0x734Ff1ff575f3229A896761694B235Ea53B780A3#code)

---

## 🌟 Key Features

* **Public Fee Lookup (No Wallet Required)**: Anyone with a unique Fee ID can instantly verify student reference, fee description, amount, due date, administrator address, and on-chain payment status.
* **School Administrator Records Portal**: Connect MetaMask to register new fees, mark records as Paid or Unpaid, and edit fee details.
* **Granular Access Control**: Only the original administrator who created a record can modify its status or details.
* **Privacy by Design**: No student names, home addresses, or sensitive personal data are stored on-chain. Only anonymous identifiers (e.g. `STU-2026-9041`) are used.
* **BOT Chain Integration**: Sub-second finality, near-zero transaction costs, and cryptographic proof of school fee payment records.
* **Live Dashboard Statistics**: Real-time on-chain counts of total records, paid records, pending unpaid records, and aggregate fee amounts.

---

## 🧱 Technology Stack

* **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons
* **Web3 Integration**: Wagmi v2, Viem, MetaMask Injected Connector, TanStack React Query
* **Smart Contract**: Solidity `^0.8.24`, Hardhat, TypeChain, Ethers.js v6

---

## 📂 Project Structure

```
FeeTrack/
├── app/
│   ├── globals.css         # Dark charcoal & muted purple/green theme
│   ├── icon.svg            # Custom branded favicon
│   ├── layout.tsx          # Root layout and metadata
│   ├── page.tsx            # Main one-page dApp interface
│   └── providers.tsx       # Wagmi & React Query provider wrapper
├── components/
│   ├── DashboardStats.tsx   # Live aggregate on-chain statistics
│   ├── EditFeeModal.tsx     # Admin modal to edit fee description, amount, and deadline
│   ├── FeeLookupSection.tsx # Public Fee ID search without wallet
│   ├── MyFeesSection.tsx    # Admin fee records table with Paid/Unpaid/Edit toggles
│   ├── Navbar.tsx           # Brand header, network status & wallet connect
│   └── RegisterFeeSection.tsx # Fee registration form with copy Fee ID & explorer link
├── contracts/
│   └── FeeTrack.sol        # Solidity smart contract with custom errors & events
├── lib/
│   ├── chains.ts           # BOT Chain Mainnet chain definition
│   ├── contractABI.ts      # Strongly-typed FeeTrack ABI
│   ├── deployedAddress.json # Deployed Mainnet contract info
│   ├── types.ts            # TypeScript interfaces & enums
│   ├── utils.ts            # Formatters for BOT currency, addresses, and timestamps
│   └── wagmi.ts            # Wagmi client configuration
├── scripts/
│   ├── deploy.ts           # Hardhat deployment script for BOT Chain Mainnet
│   └── verifyOnChain.ts    # Mainnet on-chain live check script
├── test/
│   └── FeeTrack.test.ts    # Comprehensive test suite (19 test cases)
├── .env.example            # Template for environment configuration
├── hardhat.config.ts       # Hardhat configuration for BOT Chain Mainnet
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites

* Node.js v18+ (tested on Node.js 20/22/25)
* MetaMask browser extension

### 2. Installation

Clone the workspace and install the dependencies:

```bash
npm install
```

### 3. Compile Smart Contracts

```bash
npm run compile
```

### 4. Run Smart Contract Tests

```bash
npm run test
```

All 19 tests will execute, verifying:
* Registration of fee records & sequential Fee ID generation
* Rejections for empty student references, empty descriptions, zero amounts, and past deadlines
* Marking fees as Paid & Unpaid with creator-only authorization
* Fee detail updates with validation
* Accurate global statistics calculation

---

## 🚢 Deploying to BOT Chain Mainnet

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your deployer wallet's private key to `.env`:
   ```ini
   BOTCHAIN_RPC_URL=https://rpc.botchain.ai
   PRIVATE_KEY=0xYourPrivateKeyHere...
   ```

3. Run the deployment script:
   ```bash
   npm run deploy:mainnet
   ```

4. The script logs the deployed contract address and saves deployment metadata to `lib/deployedAddress.json`.

5. Update `.env.local` for the Next.js frontend:
   ```ini
   NEXT_PUBLIC_FEETRACK_ADDRESS=0x734Ff1ff575f3229A896761694B235Ea53B780A3
   NEXT_PUBLIC_BOTCHAIN_RPC_URL=https://rpc.botchain.ai
   NEXT_PUBLIC_BOTCHAIN_CHAIN_ID=677
   NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL=https://scan.botchain.ai
   NEXT_PUBLIC_CURRENCY_SYMBOL=BOT
   ```

---

## 💻 Running the Frontend

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## 🔒 Security & Privacy Notice

* FeeTrack manages and records payment statuses on-chain. **It does not process or escrow financial fiat/cryptocurrency transactions.**
* Because blockchain records are immutable and publicly visible, administrators must never input personal identifiable information (PII) such as full student names, phone numbers, or residential addresses.

---

## 🌐 Ecosystem Links

* **BOT Chain Website**: [https://botchain.ai](https://botchain.ai)
* **BOT Chain Explorer**: [https://scan.botchain.ai](https://scan.botchain.ai)

---

## 📄 License

MIT
