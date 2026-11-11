# FeeTrack: Decentralized Educational Fee Record Protocol

**Whitepaper v1.0**  
**Network**: Botchain Mainnet (Chain ID: 677)  
**Contract Address**: `0x734Ff1ff575f3229A896761694B235Ea53B780A3`  
**Explorer**: [BotchainScan Verification](https://scan.botchain.ai/address/0x734Ff1ff575f3229A896761694B235Ea53B780A3#code)  
**GitHub Repository**: [https://github.com/liljhnxn/Feetrack](https://github.com/liljhnxn/Feetrack)  

---

## 1. Executive Summary

**FeeTrack** is an immutable, on-chain educational fee payment record management protocol built specifically for schools, universities, and educational institutions. Powered by **Botchain**, FeeTrack replaces fragile physical paper receipts and opaque internal accounting spreadsheets with verifiable, tamper-proof blockchain status proofs.

While traditional Web3 financial applications focus on payment settlement and token escrow, FeeTrack operates as a dedicated **verification layer**:
1. **School administrators** register payment obligations, establish deadlines, and certify received payments using authenticated wallet signatures.
2. **Students, parents, and sponsors** look up and verify payment status in real-time using a unique numeric **Fee ID** without connecting a wallet, holding cryptocurrency, or incurring gas fees.
3. **Zero-PII Privacy Protection**: No sensitive personal data (full names, home addresses, phone numbers) is ever committed on-chain.

---

## 2. Problem Statement

Educational fee management across emerging and developed markets suffers from three fundamental issues:

### 2.1 Fraud & Altered Receipts
Physical receipts and static PDF vouchers are easily forged, altered, or duplicated. Educational institutions lose significant administrative time manually cross-referencing bank slips against internal ledgers.

### 2.2 Asymmetric Access & Information Silos
Parents and sponsors (scholarship funds, NGOs, extended family) often lack immediate visibility into whether school fees have been recognized by the school bursar, leading to disputes, delayed admissions, and examination exclusions.

### 2.3 Web3 User Onboarding Friction
Most decentralized educational platforms require all participants—including students and non-technical parents—to install wallets, purchase cryptocurrency, and pay gas fees just to view a single record.

### 2.4 Privacy Violations on Public Ledgers
Committing identifiable student data (names, identification numbers, addresses) to an immutable public blockchain creates permanent regulatory and privacy liabilities (e.g., GDPR, FERPA compliance violations).

---

## 3. The FeeTrack Solution

FeeTrack decouples **record issuance** from **status verification**:

```
[ School Administrator ]
         │
         ▼ (MetaMask Wallet / EIP-1193)
┌──────────────────────────────────────────────┐
│  FeeTrack Smart Contract (BOT Chain Mainnet) │
│  - registerFee()                             │
│  - markFeePaid()                             │
│  - markFeeUnpaid()                           │
│  - updateFee()                               │
└──────────────────────────────────────────────┘
         ▲
         │ (Read-Only JSON-RPC / No Wallet Needed)
[ Student / Parent / Sponsor ]
```

### Key Pillars
* **Trustless Verification**: Record states (`Paid` vs `Unpaid`) and timestamps are etched into the Botchain blockchain, providing immutable legal auditability.
* **Frictionless Public Lookup**: Using Viem public RPC providers, anyone with an authorized Fee ID can verify a record without a wallet or gas fees.
* **Anonymous Pseudonymity**: The protocol enforces the use of student references (e.g., `STU-2026-9041`), preserving privacy while guaranteeing record integrity.
* **Zero Escrow Risk**: FeeTrack does not custody fiat or cryptocurrency, eliminating financial exploit vectors and complex multi-jurisdiction money transmitter licenses.

---

## 4. Technical Architecture

### 4.1 Smart Contract Layer
* **Language**: Solidity `^0.8.24`
* **Target EVM**: Paris
* **Optimization**: Enabled (200 runs)
* **Custom Errors**: Replaces verbose string reverts with custom errors (`Unauthorized`, `FeeNotFound`, `ZeroFeeAmount`, `InvalidPaymentDeadline`, etc.), minimizing deployment and execution gas overhead.
* **Security Controls**:
  * Modifier-free internal state checks.
  * Strict creator-only authorization mapping: only the administrator address that originally registered a fee record can alter its status or parameters.

```solidity
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
```

### 4.2 Frontend Layer
* **Framework**: Next.js 14 (App Router) with TypeScript.
* **Styling**: Tailwind CSS adhering to a dark charcoal theme with muted purple and emerald accents.
* **Web3 Integration**: Wagmi v2 + Viem + TanStack Query.
* **Network Integration**: Pre-configured for BOT Chain Mainnet (Chain ID 677) with 1-click network switching and MetaMask RPC injection.

---

## 5. Security & Privacy Matrix

| Vector | Traditional Web2 / Paper | Generic Web3 Solutions | FeeTrack Architecture |
| :--- | :--- | :--- | :--- |
| **Receipt Authenticity** | High forgery risk | High | **Cryptographically Guaranteed** |
| **User Privacy** | Vulnerable to leaks | High risk (PII on-chain) | **Zero-PII / Anonymous References** |
| **Custodial Risk** | Bank / Third-party | Smart contract hacks | **Zero (Non-Custodial Proof Only)** |
| **Verification Barrier** | Manual office visits | Requires wallet & gas | **Instant Lookup with Zero Wallet** |

---

## 6. Tokenomics & Network Role

FeeTrack leverages **BOT Chain (BOT)** for consensus and transaction ordering:
* **Administrators**: Pay minimal gas fees in BOT to register, edit, and update records.
* **Viewers / Verifiers**: 100% free read operations facilitated by public RPC endpoints (`https://rpc.botchain.ai`).
* **Efficiency**: Average registration consumes $< 150,000$ gas units, making institutional batch operations practically negligible in cost compared to traditional banking and SaaS transaction fees.

---

## 7. Roadmap & Future Milestones

### Phase 1: Mainnet Launch & Protocol Verification (Completed)
- [x] Core `FeeTrack.sol` smart contract architecture.
- [x] 19 automated test cases covering all edge conditions.
- [x] Deployment to BOT Chain Mainnet (`0x734Ff1ff575f3229A896761694B235Ea53B780A3`).
- [x] Full source code verification on BotchainScan.
- [x] Responsive Next.js 14 frontend with public lookup engine.
- [x] Native BOT Chain ecosystem integration ([botchain.ai](https://botchain.ai) & [scan.botchain.ai](https://scan.botchain.ai)).

### Phase 2: Institutional Features (Q1 2027)
- [ ] Multi-admin roles per school with multi-sig approval.
- [ ] Batch registration via CSV import for entire academic terms.
- [ ] QR code generation for Fee IDs printed directly on physical student report cards.

### Phase 3: Mainnet & Ecosystem Integrations (Q2 2027)
- [ ] Deployment to Botchain Mainnet.
- [ ] Webhook and API integrations with popular school management software (PowerSchool, OpenSIS).
- [ ] On-chain scholarship disbursement verification triggers.

---

## 8. Conclusion

FeeTrack delivers a simple, pragmatic, and high-impact blockchain utility: transparent, verifiable school fee recordkeeping without the steep onboarding hurdles of typical Web3 dApps. By protecting student privacy and eliminating wallet requirements for verifiers, FeeTrack is ready for real-world institutional adoption on Botchain.

