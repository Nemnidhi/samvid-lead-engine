// Industry knowledge bank - one entry per industry. Used to generate
// industry-specific pain-points text, revenue-leak bullets, a before/after
// business-flow diagram, and an outlook line for the report, instead of the
// single generic DEFAULT_PAIN_POINTS / AUTOMATION_FLOW in reportConfig.js.
//
// Add a new industry by following the same shape as any entry below.
// Discipline for any numeric or forward-looking claim: always attach a
// source, and hedge speculative claims explicitly (see generateParagraph.js
// for the same "use only the facts provided" discipline applied to the
// per-lead assessment paragraph).
//
// revenueLeaks are real, industry-standard risk categories (e.g. "stockouts
// of high-demand sizes") sourced from industry research, not fabricated
// numbers about a specific lead. Never turn these into a rupee-figure claim
// about a specific business without real data behind it.
//
// Matching is honest about what we actually measure: the Digital Presence
// Audit only checks website/social/SEO, not internal operations, so pain
// points are tagged against those same gap categories ("website", "social")
// rather than pretending to detect operational issues we have no signal
// for. Many B2B/industrial entries below have NO pain points tagged at all
// - that's not a bug, it's an honest reflection that a missing website
// isn't a business's real problem in, say, chemicals or metals. For those
// industries the pain-points/revenue-leaks section still works (it falls
// back to the first two pain points), but the "digital presence caused
// this" narrative is a weaker fit than for consumer-facing sectors like
// real estate, hospitality, or education. Worth keeping in mind when this
// data is used for report copy.
//
// financialMatrix is reference data, not yet rendered in reports - there's
// no signal today to know which scale tier a given lead actually falls
// into (would need real revenue/employee-count data).
//
// electronics_electricals is INCOMPLETE: the source document is genuinely
// truncated (confirmed by direct XML inspection - it ends mid-sentence).
// Only 4 of 5 pain points exist, the 4th has no revenue leaks, and there is
// no financialMatrix or outlook at all. Left empty/short rather than
// fabricated. Ask for a complete version of that doc before relying on it.

const INDUSTRY_KNOWLEDGE = {
  textile_apparel: {
    label: "Textile & Apparel",
    currentFlowStages: [
      "Market research & buyer acquisition",
      "Design, sampling & quotation",
      "Material planning & sourcing",
      "Spinning, weaving & dyeing",
      "Cutting, sewing & finishing",
      "Quality checks & packing",
      "Dispatch, billing & retention",
    ],
    painPoints: [
      {
        issue: "Fragmented production and order visibility",
        tags: ["website", "social"],
        summary:
          "Many businesses in this space still run on spreadsheets, paper job cards, and WhatsApp messages, so management often only learns about a delay or a missed order once it's already at risk.",
        revenueLeaks: [
          "Excess work-in-progress and idle machine or operator time",
          "Unbalanced production lines and hidden rework",
          "Missed buyer delivery windows and unplanned overtime",
        ],
      },
      {
        issue: "Forecasting errors and inventory imbalance",
        tags: ["website"],
        summary:
          "Demand is seasonal and trend-sensitive, and without a system tracking real enquiry and order data, it's easy to over-produce the wrong styles while running short on what's actually selling.",
        revenueLeaks: [
          "Unsold finished goods requiring markdowns",
          "Stockouts of high-demand sizes or styles",
          "Working capital trapped in slow-moving inventory",
        ],
      },
      {
        issue: "Slow collections and buyer concentration",
        tags: ["social"],
        summary:
          "Long buyer credit terms combined with no automated follow-up on receivables creates a cash-flow gap that's easy to lose track of without a dedicated system.",
        revenueLeaks: [
          "Delayed receivables and higher working-capital expense",
          "Unapproved deductions and debit notes going unchallenged",
          "Cash-flow disruption when a major buyer's order slips",
        ],
      },
      {
        issue: "Raw-material price and quality volatility",
        tags: [],
        summary:
          "Input costs can move significantly between quoting and purchasing, which erodes margin unless pricing includes a live-cost mechanism.",
        revenueLeaks: [
          "Orders quoted using outdated material prices",
          "Emergency procurement at premium prices",
          "Production stoppage caused by late supplier delivery",
        ],
      },
      {
        issue: "Shade, measurement and quality inconsistency",
        tags: [],
        summary:
          "Orders can be rejected over shade variation, shrinkage, or measurement defects, which is costly without inline inspection and batch traceability.",
        revenueLeaks: [
          "Re-dyeing, reprocessing, and buyer debit notes",
          "Product returns and marketplace penalties",
          "Entire batches downgraded to lower-value markets",
        ],
      },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 25 lakh - Rs. 5 crore", margin: "-5% to 8%", profile: "Small apparel label, trading business, job-work unit, boutique manufacturer, or early D2C brand" },
      { scale: "Small Scale", revenue: "Rs. 5 crore - Rs. 50 crore", margin: "3% to 10%", profile: "Local garment manufacturer, fabric processor, regional brand, small exporter, or contract manufacturer" },
      { scale: "Medium Scale", revenue: "Rs. 50 crore - Rs. 500 crore", margin: "5% to 12%", profile: "Integrated manufacturer, established exporter, multi-state brand, or specialised technical-textile company" },
      { scale: "Large Scale / Enterprise", revenue: "Above Rs. 500 crore", margin: "4% to 14%", profile: "Vertically integrated textile group, national fashion retailer, major exporter, or technical-textile enterprise" },
    ],
    outlook: {
      sentence: "India's textile and apparel sector is targeting roughly US$350 billion in industry size by 2030, up from an estimated US$190 billion in FY2025-26 - an industry ambition, not a guaranteed forecast.",
      source: "IBEF",
    },
  },

  pharmaceuticals_healthcare: {
    label: "Pharmaceuticals & Healthcare Manufacturing",
    currentFlowStages: ["Market & portfolio analysis", "R&D & regulatory approval", "Supplier qualification & procurement", "Production planning & manufacturing", "Quality control & batch release", "Warehousing & distribution", "Post-market vigilance & retention"],
    painPoints: [
      { issue: "Regulatory non-compliance and data-integrity failures", tags: [], summary: "Pharmaceutical and medical-device manufacturers operate under strict quality and documentation requirements, and a missing record, uncontrolled change or unreliable laboratory result can affect product release and market access.", revenueLeaks: ["Batch rejection", "Production shutdown", "Product-registration delay", "Product recall"] },
      { issue: "Batch failures, contamination and laboratory deviations", tags: [], summary: "Small process or environmental variations can make an entire pharmaceutical batch unusable.", revenueLeaks: ["Destruction or reprocessing", "Lost API and material value", "Delayed customer supply", "Complaint and recall exposure"] },
      { issue: "Long development and approval cycles", tags: [], summary: "Developing medicines, vaccines and medical devices can require extensive testing, documentation and regulatory review before revenue begins.", revenueLeaks: ["R&D spending on products that never launch", "Patent-window erosion", "Underutilised manufacturing capacity", "Missed market entry"] },
      { issue: "Supply-chain dependence and critical-material shortages", tags: [], summary: "The sector may rely on imported APIs, key starting materials, specialised excipients, electronic parts and sterile packaging, creating exposure to shortages and disruption.", revenueLeaks: ["Production stoppages", "Premium emergency procurement", "Missed institutional orders", "Exchange-rate losses"] },
      { issue: "Expiry, returns and distribution-control failures", tags: [], summary: "Medicines and vaccines have fixed shelf lives and may require controlled temperature throughout distribution, creating risk of loss if this is not tightly managed.", revenueLeaks: ["Expired distributor inventory", "Cold-chain damage", "Stockouts of critical products", "Counterfeit or diverted products"] },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 50 lakh - Rs. 10 crore", margin: "-20% to 10%", profile: "Research startup, early medical-device company, small formulation unit, diagnostic-device developer or contract laboratory" },
      { scale: "Small Scale", revenue: "Rs. 10 crore - Rs. 100 crore", margin: "3% to 12%", profile: "Regional medicine manufacturer, API unit, device assembler, nutraceutical manufacturer or contract packer" },
      { scale: "Medium Scale", revenue: "Rs. 100 crore - Rs. 1,000 crore", margin: "6% to 18%", profile: "Established formulation exporter, API manufacturer, vaccine supplier, device company or contract manufacturer" },
      { scale: "Large Scale / Enterprise", revenue: "Above Rs. 1,000 crore, often Rs. 10,000 crore+", margin: "8% to 25%", profile: "Diversified pharmaceutical group, major generics company, vaccine manufacturer, biologics company or multinational device business" },
    ],
    outlook: { sentence: "The industry was valued at around US$60 billion in 2026, with public and industry projections indicating potential growth to approximately US$130 billion by 2030 - though this should be treated as a strategic projection rather than a guaranteed outcome.", source: "Press Information Bureau" },
  },

  professional_services: {
    label: "Professional Services",
    currentFlowStages: ["Market and service positioning", "Lead generation and qualification", "Scoping and engagement proposal", "Client onboarding and planning", "Service execution and delivery", "Filing, billing and collections", "Renewal and relationship management"],
    painPoints: [
      { issue: "Scope creep and unbilled advisory work", tags: [], summary: "Professional staff often answer extra questions, attend additional meetings, or prepare supplementary documents without changing the fee, quietly eroding engagement margins.", revenueLeaks: ["Unpaid professional hours", "Repeated revisions", "Excessive partner involvement", "Poor engagement margins"] },
      { issue: "Poor utilisation and inappropriate staff mix", tags: [], summary: "Professional-service profitability depends on assigning the right work to the right level of employee; when partners do junior tasks or staff wait idle for client documents, profitability and morale suffer.", revenueLeaks: ["Partners completing junior tasks", "Employees waiting for client documents", "Excessive overtime", "High burnout and attrition"] },
      { issue: "Missed deadlines and compliance failures", tags: [], summary: "CA, legal, payroll and compliance assignments involve strict statutory and contractual deadlines, and missing them can trigger penalties, negligence claims, and lost retainers.", revenueLeaks: ["Penalties and interest", "Professional negligence claims", "Reputational damage", "Loss of retainer"] },
      { issue: "Slow client documentation and approval", tags: [], summary: "Professional firms often cannot complete work because clients provide incomplete or late information, leaving staff idle and compressing delivery schedules.", revenueLeaks: ["Idle staff", "Delayed billing", "Missed filing dates", "Disputed responsibility"] },
      { issue: "Slow billing, collections and weak profitability visibility", tags: [], summary: "A firm may complete substantial work without raising invoices promptly or understanding whether the client is actually profitable, leaving cash tied up and margins unclear.", revenueLeaks: ["Unbilled work in progress", "Overdue receivables", "Fee write-offs", "Continued work for non-paying clients"] },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 10 lakh - Rs. 2 crore", margin: "-10% to 25%", profile: "Solo CA, lawyer, recruiter, HR consultant, bookkeeping practice or boutique advisory startup" },
      { scale: "Small Scale", revenue: "Rs. 2 crore - Rs. 25 crore", margin: "10% to 30%", profile: "Local CA firm, legal practice, recruitment agency, payroll bureau or specialist consulting firm" },
      { scale: "Medium Scale", revenue: "Rs. 25 crore - Rs. 250 crore", margin: "12% to 32%", profile: "Multi-city professional firm, executive-search company, staffing business, consulting practice or specialist law firm" },
      { scale: "Large Scale / Enterprise", revenue: "Above Rs. 250 crore, frequently Rs. 1,000 crore+", margin: "15% to 35%", profile: "Large accounting network, national law firm, global consultancy, major staffing group or business-services provider" },
    ],
    outlook: { sentence: "India's wider services sector remains the primary driver of economic growth, having contributed around 55% of gross value added and attracted an average of approximately 80.2% of India's FDI inflows during FY2023-FY2025.", source: "India Brand Equity Foundation" },
  },

  real_estate: {
    label: "Real Estate",
    currentFlowStages: ["Land Acquisition & Feasibility", "Design, Approvals & Financing", "Procurement & Construction", "Marketing & Lead Generation", "Sales, Booking & Collections", "Registration & Handover", "Facility Management & Referral"],
    painPoints: [
      { issue: "Lead Leakage and Weak Sales Follow-Up", tags: ["website", "social"], summary: "Developers spend heavily on portals, Google Ads and Meta Ads, but leads pass through disconnected systems (portal to Excel to salesperson to personal WhatsApp) with no follow-up record, so a meaningful share of paid leads never convert.", revenueLeaks: ["Rs. 1 crore/month marketing spend on 10,000 leads at Rs. 1,000 acquisition cost", "10% lead loss from poor allocation or follow-up", "~Rs. 10 lakh/month of lead-gen spend rendered ineffective before the sales process starts"] },
      { issue: "Construction Cost Overruns", tags: [], summary: "Hundreds of contractors, subcontractors, purchase orders and change requests create small discrepancies that accumulate quickly across a project's budget.", revenueLeaks: ["5% cost overrun on a Rs. 500 crore budget = Rs. 25 crore additional cost", "Material wastage and duplicate procurement", "Late procurement and contractor delays", "Poor inventory visibility and price variation"] },
      { issue: "Project Delays", tags: [], summary: "Real estate profitability is highly sensitive to time, and a six-month delay compounds costs across financing, labour, equipment and marketing while also creating compliance and reputational exposure.", revenueLeaks: ["Additional financing costs and labour overhead", "Equipment and marketing costs from extended timelines", "Customer compensation and RERA exposure", "Slower collections and reputational damage"] },
      { issue: "Slow Customer Collections", tags: [], summary: "A developer can record large booked sales values without receiving the cash promptly, and weak collection tracking increases working-capital requirements.", revenueLeaks: ["Rs. 700 crore booked sales vs Rs. 500 crore actually collected (example)", "Rs. 200 crore remaining receivable", "Weak collection tracking increases working-capital requirements"] },
      { issue: "Departmental Data Silos", tags: [], summary: "Sales, Finance, Construction, Procurement, Marketing and Customer Service each run on separate systems (CRM, ERP, Excel, email, WhatsApp), so there is no single source of truth and the same unit can show different statuses in different systems.", revenueLeaks: ["No single source of truth across CRM, ERP, Finance and Construction", "Same unit shows conflicting status (sold/pending/reserved/available) across systems", "Creates operational and customer risk"] },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 5-50 Cr", margin: "3-10%", profile: "1-2 small projects" },
      { scale: "Small Scale", revenue: "Rs. 50-250 Cr", margin: "5-12%", profile: "Local developer with 2-5 active projects" },
      { scale: "Medium Scale", revenue: "Rs. 250-1,500 Cr", margin: "8-18%", profile: "Multiple projects / cities" },
      { scale: "Large Scale / Enterprise", revenue: "Rs. 1,500 Cr-Rs. 10,000+ Cr", margin: "10-25%+", profile: "Large branded developer / diversified portfolio" },
    ],
    outlook: { sentence: "India's real estate fundamentals remain strong, with more than US$14 billion of real-estate equity inflows in 2025 (an all-time high) and investment momentum expected to remain strong during 2026; however, CBRE expects unit sales to stay relatively range-bound in 2026 even as sales values remain elevated, as premium and high-end housing continue gaining market share.", source: "CBRE India" },
  },

  trade_services: {
    label: "Trade & Commerce",
    currentFlowStages: ["Sourcing & supplier onboarding", "Assortment & inventory planning", "Order capture & fulfilment", "Payment & settlement", "Delivery & last-mile", "Returns & after-sales support", "Customer retention & loyalty"],
    painPoints: [
      { issue: "Excess inventory, stockouts and poor forecasting", tags: [], summary: "Trade businesses must buy stock before knowing final customer demand, so forecasting errors leave one product or location oversupplied while another goes unavailable.", revenueLeaks: ["Lost sales due to stockouts", "Capital tied up in inventory", "Markdowns", "Expired or obsolete products"] },
      { issue: "Margin leakage through discounts, commissions and hidden channel costs", tags: [], summary: "A product can look profitable on selling price minus purchase price alone, but true margin is often much lower once discounts, marketplace commission, delivery, payment fees, returns and marketing are counted.", revenueLeaks: ["Unapproved discounts", "Marketplace deductions", "Payment-gateway fees", "Price mismatch across channels"] },
      { issue: "Shrinkage, theft, counterfeit returns and inventory mismatch", tags: [], summary: "Large volumes of products moving through suppliers, warehouses, stores, delivery partners and customers create both physical and system losses wherever controls are weak.", revenueLeaks: ["Employee or customer theft", "Warehouse misplacement", "Counterfeit item returned against a genuine order", "Lost parcels"] },
      { issue: "High returns, failed deliveries and reverse-logistics cost", tags: [], summary: "Returns are particularly damaging in e-commerce because the business may pay for outbound delivery, return pickup, inspection, repacking and refund without ever retaining the sale.", revenueLeaks: ["Two-way freight", "Refund processing", "Marketplace penalties", "Unsaleable opened product"] },
      { issue: "Wholesale credit losses and slow payment collection", tags: [], summary: "Wholesalers and distributors often extend credit to retailers to increase market coverage, which exposes them to overdue receivables and bad debts.", revenueLeaks: ["Overdue receivables", "Bad debts", "Field-collection expense", "Continued sales beyond credit limit"] },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 25 lakh-Rs. 5 crore", margin: "-20% to 8%", profile: "Small online seller, D2C brand, neighbourhood retailer, specialist wholesaler or early marketplace business" },
      { scale: "Small Scale", revenue: "Rs. 5 crore-Rs. 50 crore", margin: "2% to 10%", profile: "Regional retailer, distributor, multi-store operator, category wholesaler, franchisee or established e-commerce seller" },
      { scale: "Medium Scale", revenue: "Rs. 50 crore-Rs. 500 crore", margin: "3% to 12%", profile: "Multi-city retail chain, large distributor, B2B marketplace, omnichannel brand or institutional supplier" },
      { scale: "Large Scale / Enterprise", revenue: "Above Rs. 500 crore, often Rs. 5,000 crore+", margin: "3% to 15%", profile: "National retailer, large marketplace, wholesale network, consumer-commerce platform or diversified trade group" },
    ],
    outlook: { sentence: "India's retail sector could grow from approximately US$1.09 trillion in 2025 to more than US$2.36 trillion by 2030, with organised retail expected to capture more than 35% of the market - though forecasts vary materially between research organisations because they use different definitions of retail and e-commerce, so these figures should be treated as directional scenarios rather than guaranteed outcomes.", source: "India Brand Equity Foundation (IBEF)" },
  },

  chemicals: {
    label: "Chemicals & Petrochemicals",
    currentFlowStages: ["Market and demand analysis", "Customer acquisition and technical assessment", "Product development and formulation", "Regulatory and safety approval", "Production and procurement planning", "Manufacturing, reaction and quality control", "Packaging, storage and dispatch", "Billing, service and retention"],
    painPoints: [
      { issue: "Feedstock and energy-price volatility", tags: [], summary: "Petrochemical and chemical manufacturers are highly exposed to crude oil, natural gas, naphtha, electricity and freight price swings, which can erode margins on fixed-price contracts.", revenueLeaks: ["Orders priced using outdated feedstock costs", "Margin erosion during fixed-price contracts", "High inventory purchased before a price decline", "Foreign-exchange losses"] },
      { issue: "Yield loss, off-specification production and reprocessing", tags: [], summary: "Chemical manufacturing depends on tightly controlled reactions, and small deviations can cause an entire batch to fail purity, colour, viscosity or performance requirements.", revenueLeaks: ["Lower reaction conversion", "Excess solvent and catalyst use", "Reprocessing expense and batch destruction", "Customer rejection"] },
      { issue: "Unplanned shutdowns and asset-integrity failures", tags: [], summary: "Reactors, compressors, distillation columns, heat exchangers and pipelines operate under demanding conditions, and failures halt production and threaten deliveries.", revenueLeaks: ["Lost production", "Emergency maintenance", "Missed customer delivery", "Environmental incident or major safety exposure"] },
      { issue: "Safety, environmental and compliance failures", tags: [], summary: "The industry handles flammable, toxic, corrosive and reactive materials, and weak controls can lead to injury, fire, explosion, leaks or regulatory action.", revenueLeaks: ["Plant closure", "Fines and remediation", "Customer disqualification", "Reputation damage"] },
      { issue: "Customer concentration and long product-approval cycles", tags: [], summary: "Specialty-chemical suppliers may spend months developing and validating a product before receiving regular commercial orders, creating exposure to unrecovered costs and single-customer dependence.", revenueLeaks: ["Unrecovered development cost", "Samples supplied without conversion", "Dependence on one major customer", "Sudden loss of approved-vendor status"] },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 50 lakh - Rs. 10 crore", margin: "-15% to 10%", profile: "Formulation startup, laboratory chemical supplier, small coatings company, recycling unit or specialty-chemical developer" },
      { scale: "Small Scale", revenue: "Rs. 10 crore - Rs. 100 crore", margin: "3% to 12%", profile: "Regional chemical manufacturer, paint producer, polymer compounder, solvent blender or fertilizer blender" },
      { scale: "Medium Scale", revenue: "Rs. 100 crore - Rs. 1,000 crore", margin: "5% to 16%", profile: "Established specialty-chemical company, resin manufacturer, agrochemical producer, plastics processor or industrial-chemical exporter" },
      { scale: "Large Scale / Enterprise", revenue: "Above Rs. 1,000 crore, often Rs. 10,000 crore+", margin: "4% to 18%", profile: "Integrated petrochemical company, fertilizer producer, diversified chemical group or multinational specialty manufacturer" },
    ],
    outlook: { sentence: "Government and industry estimates place India's chemicals and petrochemicals sector at approximately US$220 billion in 2026, with an aspiration to reach around US$300 billion by 2030, US$1 trillion by 2040 and US$2 trillion by 2047 - figures the source document itself frames as strategic growth ambitions rather than guaranteed forecasts.", source: "Government and industry estimates" },
  },

  metals_heavy_industry: {
    label: "Metals & Heavy Industry",
    currentFlowStages: ["Market analysis & demand forecasting", "Customer acquisition & tendering", "Technical assessment & engineering design", "Cost estimation & order confirmation", "Procurement & raw-material planning", "Production, machining & finishing", "Quality inspection, dispatch & after-sales service"],
    painPoints: [
      { issue: "Raw-material and commodity-price volatility", tags: [], summary: "Steel scrap, iron ore, coal, ferroalloys, aluminium, copper, nickel and energy prices can change significantly between quotation and production, eroding margins on orders priced earlier.", revenueLeaks: ["Orders accepted at outdated raw-material rates", "Margin erosion during long delivery cycles", "Excess inventory purchased at market peaks", "Emergency procurement at premium prices"] },
      { issue: "Low yield, scrap and rework", tags: [], summary: "Metal processing naturally involves yield loss, and poor process control can significantly increase melting loss, scale loss, trimming, machining allowance and rejected production.", revenueLeaks: ["Excess raw-material consumption", "Higher energy use per accepted tonne", "Recasting and reprocessing", "Excess machining time"] },
      { issue: "Equipment breakdown and bottleneck downtime", tags: [], summary: "Blast furnaces, electric furnaces, rolling mills, presses, CNC machines and cranes are expensive, production-critical assets, and their breakdowns or bottlenecks disrupt the whole operation.", revenueLeaks: ["Lost production capacity", "Idle labour", "Missed customer deadlines", "Emergency repair costs"] },
      { issue: "Quality failures and weak traceability", tags: [], summary: "Customers may reject products due to incorrect chemistry, dimensions, mechanical properties, weld quality, internal defects or incomplete documentation.", revenueLeaks: ["Entire heat or batch rejection", "Rework and remelting", "Liquidated damages", "Warranty claims"] },
      { issue: "High energy and environmental-compliance cost", tags: [], summary: "Metal production is highly energy-intensive, and furnaces, rolling mills, heat-treatment systems, compressors and pollution-control equipment materially affect profitability.", revenueLeaks: ["Excess electricity, coal, gas or electrode consumption", "Furnace heat loss", "Peak-demand penalties", "Environmental penalties"] },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 50 lakh-Rs. 10 crore", margin: "-10% to 8%", profile: "Small fabrication workshop, machining startup, niche casting unit or industrial-equipment startup" },
      { scale: "Small Scale", revenue: "Rs. 10 crore-Rs. 100 crore", margin: "2% to 9%", profile: "Foundry, forging unit, steel service centre, fabricator or component manufacturer" },
      { scale: "Medium Scale", revenue: "Rs. 100 crore-Rs. 1,000 crore", margin: "4% to 12%", profile: "Integrated foundry and machining business, rolling mill, large fabricator or heavy-equipment manufacturer" },
      { scale: "Large Scale / Enterprise", revenue: "Above Rs. 1,000 crore, often Rs. 10,000 crore+", margin: "3% to 15%", profile: "Integrated steel or aluminium producer, large engineering group or multinational heavy-equipment company" },
    ],
    outlook: { sentence: "India produced approximately 168.4 million tonnes of crude steel in FY2025-26, representing growth of more than 10.7% year on year, with finished-steel consumption reaching approximately 164 million tonnes, supported by infrastructure, construction, railways and manufacturing demand.", source: "Press Information Bureau" },
  },

  automobile_auto_components: {
    label: "Automobile & Auto Components",
    currentFlowStages: ["Demand forecasting & product strategy", "Vehicle & component design", "Supplier sourcing & component development", "Procurement & inbound logistics", "Manufacturing & assembly", "Dealer sales & delivery", "After-sales service & retention"],
    painPoints: [
      { issue: "Supply-chain disruption and component shortages", tags: [], summary: "Automobile production depends on thousands of interdependent components, so a missing semiconductor, sensor, wiring harness, casting or battery component can stop an entire assembly line.", revenueLeaks: ["Production-line stoppages", "Idle labour and machinery", "Emergency freight", "Missed delivery commitments"] },
      { issue: "Quality failures, warranty claims and recalls", tags: [], summary: "A small component defect can affect thousands of vehicles and create significant warranty, recall and reputational costs.", revenueLeaks: ["Rework and scrap", "Warranty claims", "Recall logistics", "Lost brand confidence"] },
      { issue: "Production downtime and low equipment utilisation", tags: [], summary: "Presses, robots, CNC machines, paint lines and assembly equipment are capital-intensive, so unplanned downtime directly reduces output and increases per-unit cost.", revenueLeaks: ["Missed production targets", "Overtime and weekend recovery shifts", "Tooling failure", "Lower return on plant investment"] },
      { issue: "Forecast error and dealer inventory imbalance", tags: [], summary: "Incorrect demand forecasts by model, fuel type, variant, colour and geography create ageing inventory in one market while dealers in another face shortages.", revenueLeaks: ["Dealer discounting", "High inventory-financing cost", "Model-year depreciation", "Lost sales from unavailable variants"] },
      { issue: "EV transition and technology-obsolescence risk", tags: [], summary: "EVs require new competencies in batteries, power electronics, motors, software, charging and thermal management, and traditional engine and transmission suppliers may lose demand if they fail to diversify.", revenueLeaks: ["Underutilised legacy machinery", "High research and development expense", "Battery warranty exposure", "Incorrect investment timing"] },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 50 lakh-Rs. 10 crore", margin: "-15% to 8%", profile: "EV-component startup, small fabrication unit, automotive software company, accessory maker or workshop network" },
      { scale: "Small Scale", revenue: "Rs. 10 crore-Rs. 100 crore", margin: "3% to 10%", profile: "Tier 3 supplier, machining unit, plastic or rubber component maker, regional parts distributor or dealership group" },
      { scale: "Medium Scale", revenue: "Rs. 100 crore-Rs. 1,000 crore", margin: "5% to 12%", profile: "Established Tier 1 or Tier 2 supplier, specialist EV supplier, large dealership group or aftermarket brand" },
      { scale: "Large Scale / Enterprise", revenue: "Above Rs. 1,000 crore, often Rs. 10,000 crore+", margin: "4% to 15%", profile: "Vehicle OEM, vertically integrated group, global component supplier or major parts manufacturer" },
    ],
    outlook: { sentence: "ACMA reports the auto-component segment reached approximately US$80.2 billion in FY2024-25, up 9.6% year-on-year, but growth will not be uniform across every segment - internal-combustion component suppliers, particularly those concentrated in engine and transmission parts, may face slower long-term demand unless they diversify into EV, electronics, lightweighting or aftermarket products.", source: "ACMA" },
  },

  food_processing: {
    label: "Food Processing (Packaged Foods, Dairy, Beverages, Meat/Seafood, Fruit & Vegetable, Bakery, RTE & Grain Milling)",
    currentFlowStages: ["Market Analysis & Product Development", "Regulatory Feasibility & Trial Production", "Sourcing & Raw-Material Procurement", "Processing & Batch Production", "Quality Control & Packaging", "Distribution & Order Fulfillment", "Billing, Returns & Recall Management"],
    painPoints: [
      { issue: "Raw-material perishability and inconsistent quality", tags: [], summary: "Agricultural inputs vary by season, supplier, moisture, maturity, fat content, size and contamination level, which disrupts processing consistency and yield.", revenueLeaks: ["Spoilage before production", "Low processing yield", "Rejected supplier batches", "Higher sorting and rework costs"] },
      { issue: "Expiry, spoilage and forecasting errors", tags: [], summary: "Food businesses must balance product availability against limited shelf life; excess production creates write-offs while underproduction causes stockouts and lost retailer space.", revenueLeaks: ["Expired stock at warehouses and distributors", "Retailer returns", "Heavy discounting near expiry", "Lost sales caused by stockouts"] },
      { issue: "Quality failures, contamination and recalls", tags: [], summary: "A single contamination incident can affect a large number of units and damage the brand, so compliance needs to be built into the operating system rather than managed only through periodic inspections.", revenueLeaks: ["Batch rejection", "Reprocessing or destruction", "Customer compensation", "Product recall and transportation expense"] },
      { issue: "Distributor opacity and trade-promotion leakage", tags: [], summary: "Manufacturers frequently know what they sold to distributors but lack visibility into what distributors sold to retailers, creating blind spots in stock movement and promotion spend.", revenueLeaks: ["Excess stock in the wrong territory", "False promotional claims", "Distributor stock nearing expiry", "Duplicate or unauthorised discounts"] },
      { issue: "High energy, cold-chain and equipment costs", tags: [], summary: "Refrigeration, boilers, ovens, dryers, compressors and freezing systems consume substantial energy, and a cold-chain failure can make an entire shipment unusable.", revenueLeaks: ["Excess electricity, steam and water consumption", "Refrigerant leakage", "Equipment breakdown", "Production downtime"] },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 25 lakh-Rs. 5 crore", margin: "-8% to 8%", profile: "Home-grown packaged food brand, cloud production unit, small bakery, spice processor or D2C food startup" },
      { scale: "Small Scale", revenue: "Rs. 5 crore-Rs. 50 crore", margin: "3% to 10%", profile: "Regional manufacturer, dairy unit, grain mill, snack producer, bakery or institutional supplier" },
      { scale: "Medium Scale", revenue: "Rs. 50 crore-Rs. 500 crore", margin: "5% to 12%", profile: "Multi-state brand, contract manufacturer, established processor or exporter" },
      { scale: "Large Scale / Enterprise", revenue: "Above Rs. 500 crore, often Rs. 1,000 crore+", margin: "6% to 16%", profile: "National FMCG food company, integrated dairy, beverage company, large exporter or diversified food group" },
    ],
    outlook: { sentence: "India's food-processing sector has demonstrated sustained expansion, with average annual growth reported at 6.55% over the preceding nine years (slightly above overall manufacturing growth), though the source document cautions that exports are not uniformly rising across every category and sector growth should not be assumed to automatically guarantee export growth in every product category.", source: "Press Information Bureau" },
  },

  construction: {
    label: "Construction",
    currentFlowStages: ["Market & opportunity analysis", "Land acquisition / tender bidding", "Design, engineering & approvals", "Financing & project mobilisation", "Procurement & construction execution", "Testing & commissioning", "Handover & facility management"],
    painPoints: [
      { issue: "Poor estimation and underpriced contracts", tags: [], summary: "Construction contracts are often awarded using incomplete drawings, optimistic productivity assumptions or outdated supplier prices, so a project can generate substantial revenue while still making a loss because the original estimate did not reflect actual execution conditions.", revenueLeaks: ["Underestimated quantities", "Unrealistic labour productivity", "Material-price escalation", "Excessive tender discounts"] },
      { issue: "Delays caused by design, approvals and coordination", tags: [], summary: "Construction depends on timely drawings, decisions, approvals and access, and one delayed design package can affect multiple downstream trades.", revenueLeaks: ["Idle labour", "Equipment standby", "Liquidated damages", "Delayed billing"] },
      { issue: "Material waste, theft and uncontrolled consumption", tags: [], summary: "Construction sites handle large quantities of steel, cement, concrete, cables, fixtures and finishing materials, creating exposure to waste, theft and uncontrolled consumption.", revenueLeaks: ["Steel cutting waste", "Excess concrete", "Theft", "Duplicate purchase"] },
      { issue: "Low labour and equipment productivity", tags: [], summary: "Manual reporting often records attendance but not productive output, and equipment may remain on site even when underused.", revenueLeaks: ["Excess labour cost", "Low daily output", "Idle cranes and machinery", "Repeated mobilisation"] },
      { issue: "Billing delays, disputed variations and weak cash flow", tags: [], summary: "Construction companies commonly pay workers, subcontractors and suppliers before receiving certified client payments, and unbilled work, rejected invoices and long-held retention weaken project cash flow.", revenueLeaks: ["Unbilled completed work", "Retention held for years", "Rejected invoices", "Negative project cash flow"] },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 50 lakh-Rs. 10 crore", margin: "-10% to 8%", profile: "Small civil contractor, renovation company, fit-out business, specialist trade contractor or construction-technology startup" },
      { scale: "Small Scale", revenue: "Rs. 10 crore-Rs. 100 crore", margin: "2% to 8%", profile: "Local builder, subcontractor, residential contractor, MEP contractor or regional infrastructure contractor" },
      { scale: "Medium Scale", revenue: "Rs. 100 crore-Rs. 1,000 crore", margin: "3% to 10%", profile: "Regional EPC company, commercial contractor, industrial builder, developer or specialist engineering company" },
      { scale: "Large Scale / Enterprise", revenue: "Above Rs. 1,000 crore, often Rs. 10,000 crore+", margin: "3% to 15%", profile: "National EPC contractor, infrastructure developer, listed real-estate company or diversified construction group" },
    ],
    outlook: { sentence: "India's construction outlook remains favourable, supported by housing, urban development, manufacturing investment and public infrastructure; official FY2025-26 estimates placed combined manufacturing and construction growth at 7% in real terms, while gross fixed capital formation was estimated to rise by 7.8%.", source: "Press Information Bureau" },
  },

  leather_footwear: {
    label: "Leather & Footwear",
    currentFlowStages: ["Hide sourcing & tanning", "Design & pattern development", "Material sourcing & cutting", "Stitching & lasting", "Sole attachment & finishing", "Quality inspection & compliance", "Distribution, export & retail"],
    painPoints: [
      { issue: "Leather quality variability and low cutting yield", tags: [], summary: "Every hide is different - natural scars, holes, brands, thickness variation and shade differences reduce the usable area, driving waste and inconsistent costing.", revenueLeaks: ["Excess leather consumption", "High cutting waste", "Material shortages after production starts", "Lower-grade product realisation"] },
      { issue: "Fit, size and product-consistency failures", tags: [], summary: "Footwear returns often result from inconsistent fit, incorrect grading, last variation or poor size communication.", revenueLeaks: ["High e-commerce return rates", "Replacement and reverse-logistics costs", "Markdown of returned products", "Lost repeat business"] },
      { issue: "Sole bonding, stitching and material-performance defects", tags: [], summary: "Failures such as sole separation, cracked material, broken stitching, colour transfer or hardware damage can lead to buyer rejection and warranty claims.", revenueLeaks: ["Rework and customer returns", "Batch rejection", "Cancelled orders", "Loss of approved-supplier status"] },
      { issue: "Seasonal inventory and fashion obsolescence", tags: [], summary: "Footwear and accessories are style-, colour- and season-sensitive, so unsold inventory quickly loses value.", revenueLeaks: ["End-of-season markdowns", "Dead stock and unpopular size accumulation", "Working capital trapped in inventory", "Retailer returns"] },
      { issue: "Environmental, social and chemical-compliance risk", tags: [], summary: "Tanning uses water and chemicals, and global buyers increasingly audit environmental controls, worker conditions and restricted substances.", revenueLeaks: ["Buyer rejection", "Plant suspension", "Loss of export contracts", "Expensive remediation"] },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 25 lakh-Rs. 5 crore", margin: "-10% to 8%", profile: "Boutique footwear label, small accessories maker, contract stitching unit, D2C brand or design startup" },
      { scale: "Small Scale", revenue: "Rs. 5 crore-Rs. 50 crore", margin: "3% to 10%", profile: "Regional footwear manufacturer, tannery, component unit, leather-goods exporter or contract manufacturer" },
      { scale: "Medium Scale", revenue: "Rs. 50 crore-Rs. 500 crore", margin: "5% to 14%", profile: "Established exporter, multi-state brand, integrated footwear factory or large tannery" },
      { scale: "Large Scale / Enterprise", revenue: "Above Rs. 500 crore, often Rs. 1,000 crore+", margin: "6% to 18%", profile: "National footwear brand, major export manufacturer, vertically integrated leather group or global contract producer" },
    ],
    outlook: { sentence: "Industry projections cited by the government suggest the leather and footwear sector could reach approximately US$50 billion in production by 2030 (US$36 billion in domestic consumption plus US$14 billion in exports), though these figures should be interpreted as an industry growth scenario rather than a certainty.", source: "Press Information Bureau" },
  },

  education_services: {
    label: "Education Services",
    currentFlowStages: ["Market and learner-demand analysis", "Programme design and regulatory approval", "Lead generation and admissions", "Enrolment and fee collection", "Learning delivery and assessment", "Student support and retention", "Placement and alumni engagement"],
    painPoints: [
      { issue: "Low student conversion and expensive acquisition", tags: ["website"], summary: "Education providers often generate thousands of enquiries but convert only a small portion into paying, enrolled students.", revenueLeaks: ["High advertising spend", "Duplicate leads", "Delayed counselling and poor follow-up", "Seat vacancies"] },
      { issue: "Student dropout, disengagement and fee loss", tags: [], summary: "A learner who leaves early creates lost tuition, weak outcomes and reputational risk for the institution.", revenueLeaks: ["Uncollected future fees", "Empty seats", "Higher acquisition cost per graduate", "Refund expense"] },
      { issue: "Faculty underutilisation and inconsistent teaching quality", tags: [], summary: "Faculty are a major cost and the most important driver of learning quality, so underused or inconsistent teaching directly erodes margins and outcomes.", revenueLeaks: ["Small or poorly planned classes", "Excess part-time faculty cost", "Timetable gaps", "High faculty turnover"] },
      { issue: "Weak learning outcomes and poor employability", tags: [], summary: "High enrolment does not create value when learners fail to develop the required knowledge or workplace capability.", revenueLeaks: ["Weak placement outcomes", "Low employer trust", "Poor re-enrolment", "Declining admissions"] },
      { issue: "Fee leakage, manual administration and compliance failures", tags: [], summary: "Disconnected spreadsheets and manual processes create errors across admissions, attendance, results and finance.", revenueLeaks: ["Missed instalments", "Unauthorised discounts", "Duplicate student records", "Compliance penalties"] },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 10 lakh - Rs. 5 crore", margin: "-30% to 12%", profile: "Small coaching centre, tutoring business, preschool, edtech startup, vocational centre or online instructor platform" },
      { scale: "Small Scale", revenue: "Rs. 5 crore - Rs. 50 crore", margin: "5% to 20%", profile: "Regional school, coaching chain, skill institute, small college, corporate-training company or established online academy" },
      { scale: "Medium Scale", revenue: "Rs. 50 crore - Rs. 500 crore", margin: "8% to 25%", profile: "Multi-campus institution, university group, national coaching company, edtech platform or vocational network" },
      { scale: "Large Scale / Enterprise", revenue: "Above Rs. 500 crore, often Rs. 2,000 crore+", margin: "10% to 30%", profile: "Large university network, national school chain, major edtech company, examination business or diversified education group" },
    ],
    outlook: { sentence: "The three-to-five-year outlook for India's education-services sector is positive, technology-enabled and increasingly focused on learning outcomes, employability and lifelong education, though the source document cautions that enrolment growth alone will not create a sustainable education business without credible curriculum, measurable learning and ethical admissions.", source: "Press Information Bureau" },
  },

  healthcare_services: {
    label: "Healthcare Services",
    currentFlowStages: ["Patient Acquisition & Referral", "Registration & Appointment Booking", "Consultation & Diagnosis", "Admission, Treatment & Care Delivery", "Billing & Insurance Claims", "Discharge & Follow-up"],
    painPoints: [
      { issue: "Poor patient flow and low capacity utilisation", tags: [], summary: "Beds, consultation rooms, operating theatres and diagnostic equipment are expensive assets, but poor scheduling leaves patients waiting while facilities sit underused at other times.", revenueLeaks: ["Empty beds", "Cancelled surgery", "Unused imaging capacity", "Delayed discharge"] },
      { issue: "Insurance denials and incomplete revenue capture", tags: [], summary: "Hospitals may provide treatment but receive reduced or delayed payment because of documentation, coding, authorisation or package errors.", revenueLeaks: ["Unbilled procedures", "Denied claims", "Delayed settlement", "Bad debt"] },
      { issue: "Medicine, consumable and implant leakage", tags: [], summary: "Healthcare facilities hold high-value, regulated and expiring inventory that is exposed to loss through expiry, theft, diversion and implant mismatches.", revenueLeaks: ["Expired medicines", "Implant mismatch", "Stock theft", "Cold-chain loss"] },
      { issue: "Clinical-quality failures and avoidable adverse events", tags: [], summary: "Medication errors, infections, delayed diagnosis, falls and procedural complications cause both patient harm and financial loss.", revenueLeaks: ["Extended length of stay", "Legal claims and patient compensation", "Regulatory action", "Loss of insurer or corporate contracts"] },
      { issue: "Workforce shortages, burnout and inefficient scheduling", tags: [], summary: "Doctors, nurses and technicians are the core operating capacity of healthcare services, so shortages and poor rostering directly limit what can be delivered.", revenueLeaks: ["Overtime and agency staffing", "Closed beds", "Cancelled procedures", "Employee turnover"] },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 25 lakh-Rs. 5 crore", margin: "-20% to 10%", profile: "Small clinic, telehealth startup, home-care provider, therapy centre, diagnostic collection centre or healthcare-software service" },
      { scale: "Small Scale", revenue: "Rs. 5 crore-Rs. 50 crore", margin: "3% to 12%", profile: "Nursing home, specialist clinic, local laboratory, imaging centre, pharmacy network or small day-care facility" },
      { scale: "Medium Scale", revenue: "Rs. 50 crore-Rs. 500 crore", margin: "5% to 16%", profile: "Regional hospital, diagnostic chain, multi-city clinic network, home-healthcare company or specialty-care group" },
      { scale: "Large Scale / Enterprise", revenue: "Above Rs. 500 crore, often Rs. 5,000 crore+", margin: "7% to 20%", profile: "National hospital chain, diagnostic network, pharmacy and digital-health group or integrated healthcare provider" },
    ],
    outlook: { sentence: "Major private hospital networks continue investing in capacity - in February 2026, Apollo Hospitals projected mid-to-high-teens revenue growth and planned to expand from roughly 10,000 to 13,000 beds by FY2029-30, with much of the additional capacity focused on complex specialty care.", source: "Reuters" },
  },

  logistics_transportation: {
    label: "Logistics and Transportation",
    currentFlowStages: ["Market & Model Selection", "Customer Acquisition & Onboarding", "Booking & Carrier Allocation", "Transport & Hub Operations", "Warehousing & Fulfilment", "Last-Mile Delivery & POD", "Billing & Collections"],
    painPoints: [
      { issue: "Empty running and poor vehicle utilisation", tags: [], summary: "Vehicles frequently return without cargo or operate below their weight and volume capacity, burning fuel and cost without generating revenue.", revenueLeaks: ["Fuel consumed without revenue", "Low revenue per kilometre", "Excess vehicle requirement", "Reduced lane profitability"] },
      { issue: "Fuel leakage, maintenance and breakdown costs", tags: [], summary: "Fuel, tyres and maintenance are major operating costs for fleet owners, with theft, unauthorised refuelling and poor driving behaviour eroding margins.", revenueLeaks: ["Fuel theft and unauthorised refuelling", "Idling and low mileage", "Tyre damage and emergency repair", "Vehicle downtime and substitute vehicle cost"] },
      { issue: "Detention, waiting and delivery delays", tags: [], summary: "Vehicles may wait for hours at plants, warehouses, ports and customer sites, causing lost trips, overtime and working-capital delay.", revenueLeaks: ["Lost trips and driver overtime", "Customer penalties", "Missed connecting movement", "Working-capital delay"] },
      { issue: "Damage, theft and weak shipment traceability", tags: [], summary: "Cargo can be damaged or lost during loading, hub handling, transit, storage or delivery, driving up claims and insurance costs.", revenueLeaks: ["Customer claims and insurance deductibles", "Replacement transport and product write-off", "Investigation cost", "Higher insurance premium"] },
      { issue: "Billing leakage and slow collections", tags: [], summary: "Transport businesses often depend on manual proof of delivery and rate calculations before invoicing, leaving shipments unbilled and payments delayed.", revenueLeaks: ["Unbilled shipments and missing proof of delivery", "Incorrect rate or uncharged detention/toll", "Duplicate carrier payment", "Delayed customer payment / weak cash flow"] },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 25 lakh-Rs. 5 crore", margin: "-15% to 8%", profile: "Local transporter, delivery startup, freight broker, small warehouse, courier franchise or logistics-tech company" },
      { scale: "Small Scale", revenue: "Rs. 5 crore-Rs. 50 crore", margin: "2% to 8%", profile: "Regional fleet operator, freight forwarder, warehouse operator, courier network or last-mile provider" },
      { scale: "Medium Scale", revenue: "Rs. 50 crore-Rs. 500 crore", margin: "3% to 12%", profile: "Multi-state transporter, 3PL provider, cold-chain operator, contract warehouse network or express-logistics company" },
      { scale: "Large Scale / Enterprise", revenue: "Above Rs. 500 crore, often Rs. 5,000 crore+", margin: "4% to 15%", profile: "National logistics provider, port or terminal operator, major courier company, shipping business, rail-logistics company or integrated 3PL" },
    ],
    outlook: { sentence: "India's logistics outlook remains positive, supported by manufacturing investment, e-commerce, infrastructure, exports, organised retail and multimodal freight development. By July 2026, 142 Gati Shakti Cargo Terminals were operational (with 310 more locations holding in-principle approval), representing approximately 224 million tonnes per annum of freight-handling capacity.", source: "Press Information Bureau" },
  },

  media_communication: {
    label: "Media & Communication",
    currentFlowStages: ["Audience & market research", "Strategy, brief & proposal", "Content development & production", "Editorial & legal review", "Post-production & localisation", "Distribution & monetisation", "Measurement & retention"],
    painPoints: [
      { issue: "Uncontrolled production cost and repeated revisions", tags: [], summary: "Creative work is iterative, and unclear approvals can cause endless changes that drive up production cost.", revenueLeaks: ["Additional shooting and repeated editing", "Overtime and talent-extension fees", "Late-delivery penalties", "Missed release windows"] },
      { issue: "Platform dependence and weak audience ownership", tags: ["website", "social"], summary: "Publishers, creators and entertainment companies may depend heavily on social networks, OTT platforms, marketplaces or search engines, leaving them exposed when those platforms change.", revenueLeaks: ["Algorithm changes and reduced organic reach", "High platform commission", "Loss of customer data", "Sudden account restriction"] },
      { issue: "Advertising and media-buying leakage", tags: ["social"], summary: "Advertising campaigns involve agencies, publishers, platforms, creators, production houses and technology vendors, creating multiple points where value can leak.", revenueLeaks: ["Invalid traffic and unviewable impressions", "Duplicate invoices and undeclared commission", "Media underdelivery", "Weak attribution"] },
      { issue: "Copyright infringement and piracy", tags: [], summary: "Media companies invest in content that can be copied and distributed at very low cost, exposing revenue to piracy and unauthorised use.", revenueLeaks: ["Lost subscriptions", "Reduced box-office revenue", "Unauthorised streaming and music misuse", "Stolen creator content"] },
      { issue: "Weak content monetisation and unclear profitability", tags: [], summary: "High reach does not always produce revenue - a content asset may appear successful while remaining commercially unviable.", revenueLeaks: ["Expensive content with low completion", "Low advertising yield", "Weak subscription conversion", "Underpriced licensing"] },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 10 lakh-Rs. 5 crore", margin: "-40% to 12%", profile: "Creator studio, podcast, small digital publisher, boutique agency, production startup, event company or gaming studio" },
      { scale: "Small Scale", revenue: "Rs. 5 crore-Rs. 50 crore", margin: "3% to 18%", profile: "Regional publisher, advertising agency, production house, PR firm, influencer agency, local broadcaster or animation studio" },
      { scale: "Medium Scale", revenue: "Rs. 50 crore-Rs. 500 crore", margin: "5% to 22%", profile: "Multi-city agency, digital network, regional broadcaster, studio, OTT service, event company or VFX business" },
      { scale: "Large Scale / Enterprise", revenue: "Above Rs. 500 crore, often Rs. 5,000 crore+", margin: "7% to 30%", profile: "National broadcaster, major platform, film studio, advertising network, music company, gaming platform or diversified media group" },
    ],
    outlook: { sentence: "India's media and entertainment sector is projected to expand from approximately Rs. 2.78 trillion in 2025 to around Rs. 3.3 trillion by 2028, implying roughly 7% annual growth, with digital media, advertising, live entertainment, film and animation/VFX expected to provide much of that growth.", source: "India Brand Equity Foundation" },
  },

  paper_packaging: {
    label: "Paper & Packaging",
    currentFlowStages: ["Demand Analysis & Customer Acquisition", "Packaging Design & Artwork Approval", "Sample Testing & Quotation", "Raw Material Procurement & Planning", "Paper Manufacturing & Converting", "Quality Control & Final Inspection", "Dispatch, Billing & Account Retention"],
    painPoints: [
      { issue: "Raw-material price volatility and fibre shortages", tags: [], summary: "Paper, recovered fibre, imported pulp, starch, chemicals and energy represent a large proportion of production cost, so price volatility and fibre shortages can quickly erode margins, especially on fixed-price orders.", revenueLeaks: ["Fixed-price orders accepted before paper-price increases", "Emergency purchasing", "High-cost imported pulp", "Excess safety stock"] },
      { issue: "Excess trim, setup waste and poor material yield", tags: [], summary: "Paper and board are frequently lost during slitting, cutting, printing setup, colour adjustment and die cutting, reducing material yield.", revenueLeaks: ["Excess paper consumption", "Unusable offcuts", "Printing setup loss", "Scrap sold below original material cost"] },
      { issue: "Printing, colour and artwork errors", tags: [], summary: "A structurally correct carton may still be rejected because of incorrect artwork, colour, barcode, legal text or print registration.", revenueLeaks: ["Complete batch rejection", "Reprinting", "Airfreight or emergency delivery", "Brand damage"] },
      { issue: "Demand volatility and finished-goods inventory", tags: [], summary: "Many customers request packaging based on forecasts, but actual consumption can change quickly, leaving suppliers holding customer-specific dead stock with cash tied up in finished packaging.", revenueLeaks: ["Customer-specific dead stock", "Obsolete cartons after product redesign", "Unrecovered customer-held inventory", "Cash tied up in finished packaging"] },
      { issue: "High energy, water and maintenance costs", tags: [], summary: "Paper mills are energy- and water-intensive, while corrugators, dryers, boilers, compressors and printing presses require reliable operation, making downtime and inefficiency costly.", revenueLeaks: ["Excess steam and fuel use", "Unplanned machine breakdown", "Boiler inefficiency", "Emergency maintenance"] },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 25 lakh-Rs. 5 crore", margin: "-8% to 8%", profile: "Packaging-design studio, paper-bag business, small box converter, label printer or molded-fibre startup" },
      { scale: "Small Scale", revenue: "Rs. 5 crore-Rs. 50 crore", margin: "2% to 9%", profile: "Corrugated-box unit, carton printer, paper distributor, tissue converter or regional packaging manufacturer" },
      { scale: "Medium Scale", revenue: "Rs. 50 crore-Rs. 500 crore", margin: "4% to 12%", profile: "Integrated corrugated company, folding-carton manufacturer, recycled-paper mill or specialty packager" },
      { scale: "Large Scale / Enterprise", revenue: "Above Rs. 500 crore, frequently Rs. 1,000 crore+", margin: "4% to 15%", profile: "Integrated pulp and paper group, national packaging company or large paperboard manufacturer" },
    ],
    outlook: { sentence: "India's total packaging industry was worth approximately US$84 billion in 2024 and is projected to reach around US$143 billion by 2029, though a separate 2026 estimate cited by IBEF projects the broader packaging industry at approximately US$92 billion by FY2030 growing at around 9% annually - different market studies use different definitions and therefore produce different forecasts.", source: "IBEF" },
  },

  // Source document is genuinely truncated - confirmed by direct XML inspection, it ends
  // mid-sentence with no Financial Matrix or Outlook section, and only 4 of 5 pain points
  // (the 4th has no revenue leaks). Left short rather than fabricated - ask for a complete
  // version of this doc before treating this entry as report-ready.
  electronics_electricals: {
    label: "Electronics & Electricals Manufacturing (India)",
    currentFlowStages: ["Market Research & Product Design", "Prototype, Compliance & Cost Engineering", "Supplier Sourcing & Procurement", "PCB Manufacturing & SMT/Box-Build Assembly", "Functional Testing, Burn-In & Quality Inspection", "Packaging, Warehousing & Distribution", "Installation, Warranty, Support & Retention"],
    painPoints: [
      { issue: "Semiconductor & Electronic Component Supply Chain Disruptions", tags: [], summary: "Electronics manufacturing depends on thousands of individual components sourced globally, and a single missing semiconductor can stop production of an entire product line; pandemics, geopolitical conflicts and logistics disruptions have shown how fragile these supply chains are.", revenueLeaks: ["Production line stoppages", "Emergency component purchases", "Air freight premiums", "Missed customer delivery dates"] },
      { issue: "High Warranty Claims & Product Failures", tags: [], summary: "Electronics products run continuously in varying environmental conditions, and failures from poor solder joints, PCB defects, component failures, software bugs, battery degradation and other causes make warranty expense one of the largest hidden costs.", revenueLeaks: ["Product replacement", "Service engineer visits", "Spare parts consumption", "Negative online reviews"] },
      { issue: "Inventory Obsolescence", tags: [], summary: "Electronics has one of the shortest product life cycles of any manufacturing industry, so components become obsolete quickly, leaving manufacturers with excess and dead stock; large companies may lose millions to inventory write-offs.", revenueLeaks: ["Inventory write-offs", "Capital blocked in warehouse", "Overstocking", "Lost cash flow"] },
      { issue: "Low Manufacturing Visibility", tags: [], summary: "Without real-time production monitoring, manufacturers struggle to answer which SMT line is underperforming, why production stopped, where defects are increasing, which machine needs maintenance, and what today's OEE is.", revenueLeaks: [] },
    ],
    financialMatrix: [],
    outlook: null,
  },

  financial_services: {
    label: "Financial Services",
    currentFlowStages: ["Market & Customer-Segment Analysis", "Product Design & Approval", "Customer Acquisition & Lead Generation", "KYC, AML & Credit Underwriting", "Approval, Disbursement & Policy Issuance", "Transaction Processing & Servicing", "Collections, Claims & Retention"],
    painPoints: [
      { issue: "Credit losses and weak underwriting", tags: [], summary: "Rapid lending growth can create future losses when customer capacity, cash flow, or fraud risk is not assessed correctly.", revenueLeaks: ["Loan defaults", "Provisioning and recovery expense", "Collateral-value shortfall", "Reduced lending capacity"] },
      { issue: "Fraud, cybercrime and account takeover", tags: [], summary: "Financial institutions are frequent targets of fraud and cybercrime because they hold money, identity records and transaction access.", revenueLeaks: ["Unauthorised transactions and compensation", "Investigation expense and operational disruption", "Customer churn", "Reputational damage"] },
      { issue: "Compliance cost and regulatory failure", tags: [], summary: "The industry must maintain KYC, AML, capital, solvency, conduct, privacy, reporting and cybersecurity controls, and failing to do so creates costly consequences.", revenueLeaks: ["Penalties and business restrictions", "Remediation programmes", "Manual review cost", "Delayed product launches"] },
      { issue: "High customer-acquisition cost and low retention", tags: ["website"], summary: "Financial products are easy to compare, which leads customers to switch lenders, insurers, brokers or apps, driving low activation and lapses after onboarding.", revenueLeaks: ["Advertising and agent cost", "Dormant accounts and policy lapses", "Repeated discounting", "High churn and low cross-sell"] },
      { issue: "Manual operations, reconciliation and service delays", tags: [], summary: "Legacy systems and disconnected teams create duplicate entry, slow approvals, failed transactions and poor customer service.", revenueLeaks: ["High operations headcount", "Delayed loan disbursement, slow claim settlement", "Unreconciled transactions", "Interest and fee errors"] },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 50 lakh-Rs. 10 crore", margin: "-40% to 10%", profile: "Fintech startup, lending platform, advisory firm, insurance-tech company, small broker or payment startup" },
      { scale: "Small Scale", revenue: "Rs. 10 crore-Rs. 100 crore", margin: "5% to 20%", profile: "Regional NBFC, insurance intermediary, wealth adviser, payment processor, micro-lender or brokerage" },
      { scale: "Medium Scale", revenue: "Rs. 100 crore-Rs. 1,000 crore", margin: "8% to 25%", profile: "Established NBFC, fintech lender, regional financial institution, asset manager, broker or insurer" },
      { scale: "Large Scale / Enterprise", revenue: "Above Rs. 1,000 crore, often Rs. 10,000 crore+", margin: "10% to 30%", profile: "Large bank, national insurer, major NBFC, mutual fund, exchange-linked firm or diversified financial group" },
    ],
    outlook: { sentence: "Public-sector banks reported combined net profit of approximately Rs. 1.98 lakh crore in FY2025-26, with gross NPA ratio declining to 1.93% and net NPA ratio to 0.39% as of March 31, 2026, indicating stronger balance sheets - although individual banks and loan segments can still carry materially different risks.", source: "Press Information Bureau" },
  },

  hospitality_tourism: {
    label: "Hospitality & Tourism",
    currentFlowStages: ["Market & destination analysis", "Business model selection", "Property setup & licensing", "Booking & distribution", "Guest stay & service delivery", "Billing & reconciliation", "Reputation & repeat booking"],
    painPoints: [
      { issue: "Seasonality and low asset utilisation", tags: [], summary: "Hotels, resorts, restaurants, vehicles and event spaces carry high fixed costs that continue even when customer demand falls in the off-season, straining cash flow and debt service.", revenueLeaks: ["Empty rooms and unused banquet halls", "Idle vehicles and low table occupancy", "Fixed payroll and high utilities", "Excessive discounting and weak off-season cash flow"] },
      { issue: "Online travel commissions and weak direct booking", tags: ["website"], summary: "Online travel platforms generate demand but charge substantial commissions and retain much of the customer relationship, limiting growth of lower-cost direct bookings.", revenueLeaks: ["High commission and promotion participation costs", "Payment deductions and rate parity pressure", "Limited customer data ownership", "Repeat customers rebooking through paid channels"] },
      { issue: "Food waste, portion inconsistency and inventory leakage", tags: [], summary: "Restaurants and hotels manage perishable inventory against variable demand, creating multiple points of unrecorded food and stock loss.", revenueLeaks: ["Spoilage and overproduction", "Oversized portions and unrecorded wastage", "Employee consumption and pilferage", "Poor recipe compliance and incorrect purchasing"] },
      { issue: "Inconsistent service and workforce turnover", tags: [], summary: "Guest experience depends heavily on employee behaviour and response speed, and high staff turnover drives repeated training costs and service failures.", revenueLeaks: ["Negative reviews and complimentary recovery costs", "Refunds plus repeat training and recruitment cost", "Lost loyalty and group account loss", "Lower room rates from operational errors"] },
      { issue: "Revenue leakage from pricing, billing and supplier reconciliation", tags: [], summary: "Hospitality transactions span rooms, meals, deposits, commissions, event changes and travel suppliers, creating numerous points where charges go unposted or uncollected.", revenueLeaks: ["Unposted room charges and unauthorised discounts", "Unbilled event items and incorrect room rates", "Duplicate supplier invoices and missed cancellation fees", "Uncollected deposits and lost corporate receivables"] },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 20 lakh-Rs. 5 crore", margin: "-20% to 10%", profile: "Small cafe, homestay, travel agency, hostel, cloud kitchen, guide business or tour startup" },
      { scale: "Small Scale", revenue: "Rs. 5 crore-Rs. 50 crore", margin: "3% to 12%", profile: "Boutique hotel, regional tour operator, restaurant group, small resort, event company or destination-management firm" },
      { scale: "Medium Scale", revenue: "Rs. 50 crore-Rs. 500 crore", margin: "5% to 18%", profile: "Multi-property hotel company, restaurant chain, national travel agency, MICE operator or online travel business" },
      { scale: "Large Scale / Enterprise", revenue: "Above Rs. 500 crore, often Rs. 5,000 crore+", margin: "7% to 22%", profile: "National hotel chain, major online travel platform, integrated tourism group, airport hospitality company or large food-service operator" },
    ],
    outlook: { sentence: "Industry estimates project Indian hotel-sector revenue growth of approximately 9-12% in FY2025-26, with premium hotel demand expected to grow faster than room supply supporting pricing and occupancy, although actual outcomes vary by city and property.", source: "India Brand Equity Foundation (IBEF)" },
  },

  it_technology_services: {
    label: "IT & Technology Services",
    currentFlowStages: ["Market & ICP definition", "Lead generation & qualification", "Discovery & solution design", "Proposal, contracting & onboarding", "Development, testing & deployment", "Support & service operations", "Renewal & account growth"],
    painPoints: [
      { issue: "Scope creep and unbilled work", tags: [], summary: "Customers frequently request changes after a project begins, and delivery teams may complete extra work without formal approval to protect the relationship, eroding margins.", revenueLeaks: ["Additional development without payment", "Repeated design revisions", "Project margin erosion", "Disputed invoices"] },
      { issue: "Low employee utilisation and poor resource planning", tags: [], summary: "People are the largest cost in most technology-service businesses, and revenue declines quickly when skilled employees remain unassigned or are allocated inefficiently.", revenueLeaks: ["Excess bench cost", "Senior employees performing junior work", "Contractor expense despite available employees", "Missed project opportunities"] },
      { issue: "Underpriced projects and inaccurate estimation", tags: [], summary: "Software projects contain uncertainty, and companies may quote aggressively to win work but fail to account for integration, testing, data quality or technical complexity.", revenueLeaks: ["Loss-making fixed-price projects", "Excessive delivery effort", "Unpaid rework", "Delayed billing"] },
      { issue: "Customer churn and low SaaS adoption", tags: [], summary: "SaaS companies may successfully sell subscriptions but fail to create sustained usage, leading to cancellations and poor lifetime value.", revenueLeaks: ["Subscription cancellation", "Low licence expansion", "High customer acquisition cost", "Poor lifetime value"] },
      { issue: "Cybersecurity, privacy and service-availability failures", tags: [], summary: "Technology companies manage customer systems, source code, credentials and sensitive data, so a single security incident can affect several customers simultaneously.", revenueLeaks: ["Service downtime", "Customer compensation", "Forensic and recovery cost", "Lost contracts"] },
    ],
    financialMatrix: [
      { scale: "Startup / Early Stage", revenue: "Rs. 25 lakh-Rs. 5 crore", margin: "-30% to 12%", profile: "SaaS startup, small software agency, AI consultancy, cybersecurity boutique or early managed-service provider" },
      { scale: "Small Scale", revenue: "Rs. 5 crore-Rs. 50 crore", margin: "5% to 18%", profile: "Custom-development company, regional IT provider, niche SaaS business, cloud partner or staffing firm" },
      { scale: "Medium Scale", revenue: "Rs. 50 crore-Rs. 500 crore", margin: "8% to 22%", profile: "Established SaaS company, export services firm, managed-service provider, cybersecurity business or data consultancy" },
      { scale: "Large Scale / Enterprise", revenue: "Above Rs. 500 crore, often Rs. 5,000 crore+", margin: "10% to 28%", profile: "Large IT services company, global SaaS platform, cloud integrator, product company or diversified technology group" },
    ],
    outlook: { sentence: "MeitY states that the IT-BPM industry, excluding e-commerce, is expected to reach approximately US$315 billion in FY2025-26, including exports of about US$246 billion, with employment estimated at roughly six million professionals and about 135,000 jobs added over the previous year.", source: "MeitY" },
  },
};

// Fallback revenue-leak bullets for leads whose industry isn't in the
// knowledge bank yet. These are general, structural consequences of having
// no digital presence/CRM - true regardless of sector, not a claim about
// this specific business's numbers.
const GENERIC_REVENUE_LEAKS = [
  "Enquiries that never get logged or followed up simply disappear, with no record anyone lost them",
  "A customer who can't find you online finds a competitor who does show up",
  "No way to tell which leads are worth chasing, so time gets spent on the wrong ones",
];

// Generic before/after flow used when an industry has no knowledge-bank
// entry (or, as with electronics_electricals, an incomplete one).
const GENERIC_FLOW_STAGES = ["Enquiry comes in", "Manual quoting or discussion", "Work delivered", "Informal follow-up", "Repeat business, if remembered"];

function getIndustryKnowledge(industryKey) {
  if (!industryKey) return null;
  return INDUSTRY_KNOWLEDGE[industryKey] || null;
}

// Picks the 1-2 pain points most relevant to what this lead is actually
// missing (matched against the same gap categories used in the Digital
// Presence Audit), and returns a short paragraph - not the full
// knowledge-bank entry. Falls back to the first two pain points if nothing
// tagged matches, so the section is never empty for a known industry.
function getMatchedPainPoints(industryKey, missingTags) {
  const industry = getIndustryKnowledge(industryKey);
  if (!industry) return [];

  const tagSet = new Set(missingTags || []);
  const matched = industry.painPoints.filter((p) => p.tags.some((t) => tagSet.has(t)));
  return (matched.length > 0 ? matched : industry.painPoints).slice(0, 2);
}

function getIndustryPainPointsText(industryKey, missingTags) {
  const chosen = getMatchedPainPoints(industryKey, missingTags);
  if (chosen.length === 0) return null;
  return chosen.map((p) => p.summary).join(" ");
}

// Returns up to 4 revenue-leak bullets: from the matched industry pain
// points if the industry is known, otherwise the generic fallback list.
// Always real, sourced-in-kind risk categories - never a fabricated number.
function getRevenueLeaks(industryKey, missingTags) {
  const chosen = getMatchedPainPoints(industryKey, missingTags);
  if (chosen.length === 0) return GENERIC_REVENUE_LEAKS;

  const leaks = chosen.flatMap((p) => p.revenueLeaks || []);
  return leaks.length > 0 ? leaks.slice(0, 4) : GENERIC_REVENUE_LEAKS;
}

function getIndustryOutlookLine(industryKey) {
  const industry = getIndustryKnowledge(industryKey);
  if (!industry || !industry.outlook) return null;
  return `${industry.outlook.sentence} (Source: ${industry.outlook.source})`;
}

// Real, industry-specific "today" flow for the before/after diagram. Falls
// back to a generic small-business flow when the industry is unknown or
// (as with electronics_electricals) the source doc didn't have this data.
function getCurrentFlowStages(industryKey) {
  const industry = getIndustryKnowledge(industryKey);
  if (industry && industry.currentFlowStages && industry.currentFlowStages.length > 0) {
    return industry.currentFlowStages;
  }
  return GENERIC_FLOW_STAGES;
}

module.exports = {
  INDUSTRY_KNOWLEDGE,
  GENERIC_REVENUE_LEAKS,
  GENERIC_FLOW_STAGES,
  getIndustryKnowledge,
  getIndustryPainPointsText,
  getRevenueLeaks,
  getIndustryOutlookLine,
  getCurrentFlowStages,
};
