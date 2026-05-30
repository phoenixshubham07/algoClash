# AlgoClash: Executive Summary & UPI Integration Requirements
*Prepared for the Office of the CEO, National Payments Corporation of India (NPCI)*
*Date: May 30, 2026*

---

## 1. Executive Summary

### The Product: Gamified E-Sports for Software Engineers
**AlgoClash** ([algoclash.com](https://algoclash.com)) is a real-time, high-stakes 1v1 competitive coding platform. Traditional platforms (like LeetCode or Codeforces) are passive, leaderboard-based exam environments. AlgoClash turns competitive programming into active combat. 

**Core USP (The Psychological Duel):**
* **1v1 Arena:** Players are matched in head-to-head live duels.
* **Ghost Cursors:** Players see their opponent's cursor line number and active typing signals in real time.
* **Live Progress Tracking:** Screen borders pulse red when an opponent passes $\ge 80\%$ of hidden test cases, driving high-pressure decision making.
* **Submission Caps:** A strict 2-submission limit forces players to double-check their solutions and debug before committing.

### Target Demographics & Growth Map
* **Target Audience:** India's 4.5+ million Computer Science & Engineering students, coding club members, and competitive programming enthusiasts.
* **Geographical Roadmap:** India (Launch market) $\rightarrow$ Southeast Asia (Vietnam) $\rightarrow$ East Asia (Korea, Japan). 

### Early Traction & Industry Validation
* **Ecosystem Validation:** Platform model and value proposition validated by prominent business leaders and angel investors, including **Anupam Mittal** (Founder & CEO, People Group / Shark Tank India), recognizing the deep market potential of gamified e-sports for engineering talent in India.

### Monetization Model
* **Scalable Tournament Passes:** Starting at ₹149 entry fee for our initial 64-player live bracket tournaments (e.g., ₹5,000 prize pool). Ticket pricing and cash prize pools will scale dynamically as traction grows and larger/sponsored tournaments are introduced.
* **Micro-Transactions:** Starting with a ₹29 "Match Analysis" unlock (for viewing failing test cases, timeline breakdowns, and winner code comparisons) as our baseline. Micro-transactions are highly subjective; we plan to expand this to a range of premium add-ons (custom profile aesthetics, avatar frames, custom themes, and historical game rewinds) at different price points as the platform grows.
* **Monthly Subscriptions:** ₹199/month for Pro practice mode (unlimited analysis, custom matchmaking).

---

## 2. Core Payment Integration Requirements

To provide a seamless, low-friction user experience for engineering students, AlgoClash requires a robust, modern payment system with the following specifications:

### A. Low-Friction UPI Flow (Default Method)
Indian students do not use credit/debit cards for digital transactions; **UPI represents >99% of our target transaction volume**.
* **Mobile (UPI Intent):** Seamless app-switch redirection to popular UPI apps (BHIM, PhonePe, GPay, Paytm) with automated return callbacks.
* **Desktop (Dynamic UPI QR):** Instantaneous generation of dynamic, transaction-bound QR codes with real-time status polling.

### B. Direct Real-Time Webhook Callbacks ($\le 1$ Second Latency)
* **Real-time Matchmaking Impact:** Our tournament system runs on tight schedules (e.g., 64 slots filling dynamically). The moment a user completes their UPI payment, our database must receive a secure webhook notification within one second to seed them into the bracket. Any delay in payment callbacks breaks the real-time bracket flow.

### C. Low-MDR / Zero-MDR Solution for Micro-transactions
* With entry fees starting at ₹149 and post-match micro-transactions starting at ₹29, standard payment gateway fees (2.0% - 2.5% + fixed API charges) significantly impact unit economics.
* As we scale our micro-transactions ecosystem (expanding into cosmetic upgrades, premium challenge packs, etc., ranging from ₹10 to ₹99), keeping transaction fees minimal is critical.
* Integration of **UPI Lite** (for PIN-less, low-value transactions) would drastically reduce processing friction and system overhead.

### D. UPI AutoPay for Recurring Subscriptions
* To support the ₹199/month Pro subscription model, we need integration with **UPI AutoPay/e-mandates** to facilitate seamless monthly auto-renewals for students without manual checkout intervention.

### E. Individual Developer Onboarding / Pre-Incorporation Sandbox
* **The Challenge:** AlgoClash is currently in its launch phase, bootstrapped by a student founder and operating as a sole proprietorship prior to formal corporate registration (LLP/Pvt Ltd).
* **Requirement:** Fast-track access to payment gateway sandboxes and production APIs under individual PAN verification to launch Tournament #1 without waiting for months of corporate registration paperwork.

---

## 3. Recommended Assistance from NPCI

To help scale India's first real-time coding e-sports platform, we would highly value support in the following areas:

1. **Introductions to Startup-Friendly UPI Aggregators / Banks:** Direct referrals to developer-first payment aggregators (e.g., Razorpay, Cashfree, Decentro, Paytm) or banking partners (Yes Bank, ICICI) that support fast-track onboarding for pre-incorporated startups and offer optimized UPI integration packages.
2. **Access to Direct UPI Sandbox/API Infrastructure:** Guidance or access to NPCI's developer sandbox resources to build and test direct UPI collection loops, bypassing high-cost middleware where feasible.
3. **UPI Lite Integration Support:** Strategic guidance on how small-ticket platforms can implement and promote UPI Lite for instant, zero-MDR micro-transactions under ₹200.

---
**Contact:**  
Shubham (Founder, AlgoClash)  
Email: [Your Email Address]  
Phone: [Your Phone Number]  
Web: [algoclash.com](https://algoclash.com)  
