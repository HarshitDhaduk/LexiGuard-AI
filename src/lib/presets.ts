/**
 * Realistic Legal Contract Fixtures for LexiGuard AI
 * Used for instant demonstrations, evaluator live-testing, and automated validation.
 */

export interface ContractPreset {
  id: string;
  name: string;
  category: "Freelance MSA" | "Residential Lease" | "SaaS Terms";
  badge: string;
  description: string;
  rawText: string;
  comparableText?: string; // Standard or modified version for redline comparison
}

export const CONTRACT_PRESETS: ContractPreset[] = [
  {
    id: "freelance-predatory-msa",
    name: "Predatory Freelance Master Services Agreement",
    category: "Freelance MSA",
    badge: "High Risk (Score: ~82)",
    description: "Contains uncapped one-sided indemnity, universal IP forfeiture, 90-day delayed payment, and a 2-year non-compete.",
    rawText: `MASTER SERVICES AGREEMENT

This Master Services Agreement ("Agreement") is entered into as of October 1, 2026, by and between TechNova Global Inc. ("Client"), located at 500 Enterprise Way, Suite 800, Austin, TX 78701, and Sarah Chen ("Contractor"), email: sarah.chen@freelancecorp.io, phone: (512) 555-0198.

1. SCOPE OF SERVICES
Contractor shall perform software architecture and user interface engineering as detailed in applicable Statements of Work (SOW).

2. COMPENSATION AND PAYMENT TERMS
Client shall compensate Contractor at the rate of $8,500.00 per month. Invoices shall be submitted on the last day of each calendar month. Client shall remit payment within ninety (90) days following receipt and unilateral approval of each invoice ("Net 90"). No interest or late fees shall accrue on overdue balances under any circumstances.

3. UNILATERAL INDEMNIFICATION
Contractor agrees to defend, indemnify, and hold harmless Client, its parent companies, affiliates, officers, directors, and agents against any and all claims, damages, liabilities, losses, costs, and legal expenses (including full attorney fees) arising directly or indirectly from Contractor's services, regardless of whether caused by Contractor's negligence or third-party actions. Contractor's liability under this Section shall be strictly uncapped.

4. LIMITATION OF CLIENT LIABILITY
In no event shall Client be liable to Contractor for any indirect, incidental, special, or consequential damages. Client's maximum cumulative liability for any breach under this Agreement shall not exceed the sum of $100.00 USD.

5. INTELLECTUAL PROPERTY AND WORK PRODUCT
Contractor agrees that all work product, source code, designs, algorithms, methodologies, and concepts developed, conceived, or reduced to practice by Contractor during the term of this Agreement—whether created on Client premises or on Contractor's personal equipment, and whether created during or outside normal business hours—shall be deemed "Works Made for Hire" and shall be the sole and exclusive property of Client. Contractor hereby waives all moral rights and unconditionally assigns all pre-existing tools and background IP incorporated into the deliverables.

6. RESTRICTIVE COVENANTS AND NON-COMPETE
During the term of this Agreement and for a period of twenty-four (24) months following termination for any reason, Contractor shall not directly or indirectly provide software consulting or design services to any entity operating in the enterprise software, generative AI, or cloud computing sectors worldwide.

7. TERMINATION
Client may terminate this Agreement or any SOW at any time, with or without cause, immediately upon written email notice. Contractor may only terminate this Agreement upon providing ninety (90) days prior written notice via certified mail. In the event of early termination by Client, Contractor shall not be entitled to any prorated compensation for work in progress.

8. GOVERNING LAW AND DISPUTES
This Agreement shall be governed by the laws of the State of Delaware. Any dispute shall be resolved exclusively in state or federal courts located in Wilmington, Delaware. Contractor irrevocably waives any right to a jury trial.`,
    comparableText: `MASTER SERVICES AGREEMENT (STANDARD / EQUITABLE VERSION)

This Master Services Agreement ("Agreement") is entered into as of October 1, 2026, by and between TechNova Global Inc. ("Client") and Sarah Chen ("Contractor").

1. SCOPE OF SERVICES
Contractor shall perform software engineering services as defined in mutually agreed Statements of Work.

2. COMPENSATION AND PAYMENT TERMS
Client shall pay Contractor $8,500.00 per month. Invoices shall be payable within thirty (30) days ("Net 30"). Overdue invoices shall accrue interest at 1.5% per month.

3. MUTUAL INDEMNIFICATION
Each party agrees to indemnify and hold harmless the other party from third-party claims arising from gross negligence or willful misconduct. Each party's aggregate indemnification liability shall be capped at the total fees paid to Contractor in the preceding twelve (12) months.

4. MUTUAL LIMITATION OF LIABILITY
Neither party shall be liable for indirect or consequential damages. Total liability for both parties shall be limited to the total fees paid under the applicable Statement of Work.

5. INTELLECTUAL PROPERTY
Deliverables created specifically for Client under an SOW shall belong to Client upon receipt of full payment. Contractor retains all right, title, and ownership in pre-existing tools, libraries, and background IP.

6. NON-SOLICITATION (NO NON-COMPETE)
Contractor agrees not to solicit Client's direct employees for twelve (12) months. No restriction is placed on Contractor's right to perform software development services for other non-conflicting clients.

7. TERMINATION
Either party may terminate this Agreement without cause upon thirty (30) days written notice. In the event of termination, Client shall pay for all work completed up to the effective termination date.

8. GOVERNING LAW
This Agreement shall be governed by the laws of the state where Contractor resides. Disputes shall be resolved through binding mediation.`
  },
  {
    id: "residential-lease-harsh",
    name: "Aggressive Residential Lease Agreement",
    category: "Residential Lease",
    badge: "High Risk (Score: ~78)",
    description: "Contains zero-notice entry, non-refundable deposit traps, tenant maintenance shifting, and punitive early termination.",
    rawText: `RESIDENTIAL LEASE AGREEMENT

This Lease Agreement ("Lease") is made on August 15, 2026, between Apex Property Holdings LLC ("Landlord"), 100 Main Street, Suite 400, Seattle, WA 98101, and David Miller ("Tenant"), phone: (206) 555-0144.

1. PREMISES AND TERM
Landlord leases to Tenant the apartment located at 1084 Pine Street, Apt 4B, Seattle, WA 98101 for a term of twelve (12) months commencing September 1, 2026.

2. RENT AND DEPOSIT
Tenant shall pay rent of $2,450.00 per month in advance on or before the 1st of each month. A late fee of $250.00 applies on the 2nd day of the month. Tenant shall deposit $4,900.00 as a Security Deposit. The Security Deposit shall be automatically forfeited in full if Tenant vacates the premises with any wall scuffs, nail holes, or minor carpet wear.

3. LANDLORD RIGHT OF ENTRY
Landlord and its agents reserve the unrestricted right to enter the Premises at any hour of the day or night without prior notice for inspections, repairs, or showing to prospective buyers. Tenant waives any statutory right to 24-hour advance written notice.

4. MAINTENANCE AND REPAIRS
Tenant assumes sole financial and operational responsibility for all maintenance, plumbing stoppages, heating malfunctions, and appliance repairs costing under $1,000.00 per occurrence, regardless of cause or pre-existing condition.

5. EARLY TERMINATION PENALTY
Tenant has no right to terminate this Lease prior to expiration. In the event Tenant vacates early for any reason (including employment relocation or illness), Tenant shall immediately pay an acceleration fee equal to four (4) months rent ($9,800.00) in addition to forfeiting the Security Deposit.

6. PETS AND GUESTS
No pets of any kind are permitted. Guests staying more than forty-eight (48) consecutive hours shall be deemed unauthorized occupants, incurring a fine of $100.00 per day.`
  },
  {
    id: "saas-terms-invasive",
    name: "Invasive AI Platform Terms of Service",
    category: "SaaS Terms",
    badge: "Medium Risk (Score: ~64)",
    description: "Grants perpetual AI training rights on uploaded user IP, unilateral price hikes, and class action waiver.",
    rawText: `TERMS OF SERVICE - CLOUDSCRIBE AI

Welcome to CloudScribe AI. By clicking "I Agree" or uploading any data to CloudScribe ("Service"), you agree to these Terms.

1. SUBSCRIPTION FEES
Subscription is billed at $49.99 per month. CloudScribe reserves the right to increase subscription fees at any time upon three (3) days email notice. Subscriptions automatically renew for successive 12-month periods unless canceled at least sixty (60) days prior to renewal.

2. LICENSE TO USER CONTENT AND AI TRAINING
You grant CloudScribe a perpetual, irrevocable, worldwide, royalty-free, transferable license to use, reproduce, modify, analyze, and distribute any documents, text, or data you upload to the Service for the purpose of training, fine-tuning, improving, and commercializing CloudScribe's artificial intelligence and machine learning models.

3. DISCLAIMER OF WARRANTIES
THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, INCLUDING ACCURACY, RELIABILITY, OR FITNESS FOR A PARTICULAR PURPOSE.

4. BINDING ARBITRATION AND CLASS ACTION WAIVER
YOU AGREE THAT ALL DISPUTES SHALL BE RESOLVED EXCLUSIVELY THROUGH INDIVIDUAL BINDING ARBITRATION. YOU IRREVOCABLY WAIVE ANY RIGHT TO PARTICIPATE AS A CLASS REPRESENTATIVE OR CLASS MEMBER IN ANY CLASS ACTION OR COLLECTIVE PROCEEDING. IF YOU INITIATE ARBITRATION AND DO NOT PREVAIL, YOU SHALL REIMBURSE CLOUDSCRIBE FOR ALL ATTORNEYS' FEES AND COSTS.`
  }
];
