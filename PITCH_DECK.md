# FeeTrack — Pitch Deck

**Tagline**: School fee records made simple on-chain.  
**Network**: Botchain Testnet (Chain ID: 968)  
**Contract**: `0x0C5987fF8980f8B3e8230eB52C641DaA024c8E79`  
**GitHub**: [https://github.com/liljhnxn/Feetrack](https://github.com/liljhnxn/Feetrack)  

---

### Slide 1: Cover & Vision
* **Title**: FeeTrack
* **Subtitle**: Decentralized Educational Fee Payment Records on Botchain
* **Vision**: Bringing trust, transparency, and fraud-proof payment verification to educational institutions worldwide without requiring families to hold crypto.

---

### Slide 2: The Problem
* **Forged Receipts & Payment Disputes**: Paper slips and static PDF receipts are vulnerable to tampering and loss.
* **Administrative Burden**: Bursars and administrative staff waste hundreds of hours manually reconciling payments and validating student eligibility.
* **Information Asymmetry**: Sponsors, parents, and remote guardians lack direct, real-time visibility into whether student fees have been recognized.
* **High Web3 Barrier**: Standard blockchain apps demand wallets, crypto tokens, and gas fees from non-technical everyday users.

---

### Slide 3: The Solution — FeeTrack
* **Immutable Proof**: Fee creation, amounts, deadlines, and payment confirmation are recorded permanently on Botchain Testnet.
* **Zero-Wallet Public Lookup**: Anyone holding a unique Fee ID can instantly verify payment status online without connecting a crypto wallet.
* **Privacy-First**: Enforces anonymous student references (`STU-2026-9041`); strictly zero personal identifiable information (PII) on-chain.
* **Non-Custodial & Low Risk**: Records payment status without holding or escrowing school funds, eliminating custody risk.

---

### Slide 4: How It Works
1. **Admin Registration**: Authorized school administrator connects their wallet and submits fee details (student ref, description, amount, due date).
2. **On-Chain Minting**: The smart contract assigns a unique numeric Fee ID and sets initial status to `Unpaid`.
3. **Public Verification**: Student or sponsor enters the Fee ID on the FeeTrack web portal to view real-time status.
4. **Instant Status Updates**: Upon bank/cash payment confirmation, the creator admin marks the fee as `Paid` on-chain with a permanent timestamp.

---

### Slide 5: Product & Live Traction
* **Fully Functional dApp**: Live on Botchain Testnet.
* **Verified Smart Contract**: Deployed at `0x0C5987fF8980f8B3e8230eB52C641DaA024c8E79` with verified source code on BohrScan.
* **Rigorous Testing**: 19 automated unit tests verifying access control, boundary conditions, and state transitions.
* **Responsive UI**: Next.js 14, Tailwind CSS, dark charcoal design with muted purple/green indicators.

---

### Slide 6: Market Opportunity
* **Target Audience**: Primary & secondary schools, universities, vocational centers, scholarship foundations, and educational NGOs.
* **Global EdTech Market**: Expected to reach $400B+ by 2028, with accelerating demand for digitized verification and compliance.
* **Emerging Markets Focus**: High demand across regions where paper receipt forgery and banking reconciliation delays are most acute.

---

### Slide 7: Competitive Matrix
| Feature | Traditional Paper / ERP | Generic Web3 Payments | FeeTrack |
| :--- | :---: | :---: | :---: |
| Tamper-Proof Audit Trail | ❌ | ✅ | ✅ |
| No Wallet Needed for Lookup | ✅ | ❌ | ✅ |
| Student Privacy Protected | ⚠️ | ❌ | ✅ |
| Zero Escrow / Financial Risk | ✅ | ❌ | ✅ |
| Real-Time Explorer Verification| ❌ | ✅ | ✅ |

---

### Slide 8: Business & Sustainability Model
* **Free Tier for Small Schools**: Core registration and public lookups subsidized by low Botchain network fees.
* **Enterprise School Licensing**: Premium institutional dashboard with multi-admin roles, batch CSV uploads, and automated SMS/email status notifications.
* **API / ERP Connectors**: B2B integrations with popular school management platforms (PowerSchool, OpenSIS).

---

### Slide 9: Roadmap
* **Q4 2026 (Completed)**: Core protocol launch on Botchain Testnet, full unit testing, source code verification, and responsive web app.
* **Q1 2027**: Institutional batch registration, printable QR-code receipts, and multi-signature admin controls.
* **Q2 2027**: Botchain Mainnet deployment, scholarship disbursement integration, and mobile PWA release.

---

### Slide 10: The Team & Ask
* **Team**: Web3 developers, smart contract engineers, and EdTech enthusiasts passionate about real-world blockchain utility.
* **Call to Action**:
  * Test the dApp: [Local/Vercel URL]
  * Contract on BohrScan: `0x0C5987fF8980f8B3e8230eB52C641DaA024c8E79`
  * GitHub: [https://github.com/liljhnxn/Feetrack](https://github.com/liljhnxn/Feetrack)
