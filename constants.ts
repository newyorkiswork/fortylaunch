
import { Opportunity, Contract, CalendarEvent, Agent } from './types';

// Sentinel Source of Truth: January 14, 2026 (Wednesday)
export const CURRENT_DATE = '2026-01-14';

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'c1',
    title: 'MSA - KPMG Global',
    status: 'Signed',
    value: 1200000,
    content: 'Master Services Agreement for Audit Analytics Platform...',
    signatures: [{ signerName: 'Sentinel Core', date: '2025-12-01' }],
    dateCreated: '2025-12-01',
    aiSummary: 'MSA defining the 12-month engagement. Payment receipt confirmed.'
  },
  {
    id: 'c2',
    title: 'SOW - Salesforce Einstein',
    status: 'Draft',
    value: 2500000,
    content: 'Statement of Work: Einstein GPT Custom Industry Models...',
    signatures: [],
    dateCreated: '2026-01-10',
    aiSummary: 'Draft SOW for R&D partnership. Pending final architecture review.'
  }
];

export const MOCK_AGENTS: Agent[] = [
    { id: 'a1', name: 'Email Agent', role: 'Analyst', status: 'Active', currentTask: 'Scanning Financial Receipts', avatarColor: 'bg-blue-600' },
    { id: 'a2', name: 'Web Agent', role: 'Scheduler', status: 'Processing', currentTask: 'Generating Invoices for Peloton', avatarColor: 'bg-indigo-600' },
    { id: 'a3', name: 'Field Ops', role: 'Sales', status: 'Idle', currentTask: 'Awaiting Check-in', avatarColor: 'bg-emerald-600' },
];

export const MOCK_CALENDAR: CalendarEvent[] = [
    { id: 'e1', title: 'Send Invoices - Peloton', date: '2026-01-14', time: '14:00', attendees: ['System'], type: 'Task', status: 'Pending' }, // Today
    { id: 'e2', title: 'Legal Follow-up - MITRE', date: '2026-01-15', time: '10:00', attendees: ['Legal Team'], type: 'Task', status: 'Pending' }, // Tomorrow
    { id: 'e3', title: 'Demo Presentation - Salesforce', date: '2026-01-20', time: '14:00', attendees: ['Sales Team'], type: 'Meeting', status: 'Pending' }, // Next Tuesday
];

export const MOCK_TRANSCRIPT = "Met with the CTO at Salesforce. They want a full demo of the new routing API. Moving them to Qualified stage.";

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'kpmg-001',
    companyName: 'KPMG',
    logoShort: 'KP',
    amount: 1200000,
    stage: 'Active Project', // Stage 5: Active/Paid
    contacts: [
        { name: 'David Chen', role: 'Partner', title: 'Partner', email: 'd.chen@kpmg.com', type: 'Decision Maker' }
    ],
    projectDetails: {
        name: "Audit Analytics Platform",
        budgetTotal: 1200000,
        budgetSpent: 1200000,
        timelineStart: "2025-01-01",
        timelineEnd: "2025-12-31",
        statusDescription: "Paid - Retention Phase"
    },
    nextAction: 'Quarterly Review',
    nextActionDate: '2026-02-01',
    sentiment: 'Positive',
    isGhost: false,
    lastUpdated: 'Just now',
    probability: 100,
    contractId: 'c1',
    leadSource: 'Email Agent',
    leadStatus: 'Active',
    files: [
        { id: 'f1', name: 'Receipt_Q4.pdf', type: 'pdf', size: '150 KB', uploadDate: '2026-01-14', aiSummary: 'Payment receipt confirmed via Email Agent scan.' }
    ],
    automation: {
        level: 'Auto',
        autoApprove: ['Invoices'],
        requireApproval: []
    },
    tasks: [],
    interactions: [
        {
            interaction_id: "email_scan_01",
            type: "email",
            client: "KPMG",
            subject: "Payment Confirmation",
            from: "Billing System",
            date: "2026-01-14",
            body: "Payment of $300,000 received.",
            ai_summary: "Payment Receipt found. Pipeline moved to Active/Paid.",
            sentiment: "Positive"
        }
    ],
    messages: []
  },
  {
    id: 'mitre-001',
    companyName: 'MITRE',
    logoShort: 'MI',
    amount: 850000,
    stage: 'Negotiation', // Stage 4
    contacts: [
        { name: 'Dr. Rodriguez', role: 'Chief Scientist', title: 'Chief Scientist', email: 'erodriguez@mitre.org', type: 'Decision Maker' }
    ],
    projectDetails: {
        name: "NLP Intelligence",
        budgetTotal: 850000,
        budgetSpent: 0,
        timelineStart: "TBD",
        timelineEnd: "TBD",
        statusDescription: "Contract Negotiation"
    },
    nextAction: 'Legal Follow-up',
    nextActionDate: '2026-01-15',
    sentiment: 'Neutral',
    isGhost: false,
    lastUpdated: '2 hours ago',
    probability: 75,
    files: [
        { id: 'f_call_1', name: 'Call_Log_Terms.txt', type: 'docx', size: '12 KB', uploadDate: '2026-01-14', aiSummary: 'Transcript regarding contract terms.' }
    ],
    automation: {
        level: 'Hybrid',
        autoApprove: [],
        requireApproval: ['Contract Terms']
    },
    tasks: [{ id: 't_mitre_1', text: 'Legal Follow-up', due: '2026-01-15', completed: false }],
    interactions: [
        {
            interaction_id: "call_mitre_1",
            type: "phone_call",
            client: "MITRE",
            participants: ["Dr. Rodriguez"],
            date: "2026-01-14",
            duration_minutes: 15,
            ai_summary: "Discussed liability clauses. Client requested revision. Phone Agent scheduled follow-up.",
            sentiment: "Neutral"
        }
    ],
    messages: []
  },
  {
    id: 'peloton-001',
    companyName: 'Peloton',
    logoShort: 'PE',
    amount: 650000,
    stage: 'Negotiation', 
    contacts: [
        { name: 'Jessica Taylor', role: 'VP Product', title: 'VP', email: 'jessica@peloton.com', type: 'Decision Maker' }
    ],
    projectDetails: {
        name: "Personalized Workout AI",
        budgetTotal: 650000,
        budgetSpent: 0,
        timelineStart: "2026-03-01",
        timelineEnd: "2026-09-30",
        statusDescription: "Invoicing / Closing"
    },
    nextAction: 'Send Invoices',
    nextActionDate: '2026-01-14',
    sentiment: 'Positive',
    isGhost: false,
    lastUpdated: '1 hour ago',
    probability: 90,
    files: [
        { id: 'f_inv_1', name: 'Invoice_1.pdf', type: 'pdf', size: '200 KB', uploadDate: '2026-01-14', aiSummary: 'Split invoice part 1 generated by Web Meeting Agent.' },
        { id: 'f_inv_2', name: 'Invoice_2.pdf', type: 'pdf', size: '200 KB', uploadDate: '2026-01-14', aiSummary: 'Split invoice part 2 generated by Web Meeting Agent.' },
        { id: 'f_trans', name: 'Transcript.txt', type: 'docx', size: '45 KB', uploadDate: '2026-01-14', aiSummary: 'Web meeting transcript.' }
    ],
    automation: {
        level: 'Auto',
        autoApprove: ['Invoices'],
        requireApproval: []
    },
    tasks: [{ id: 't_pel_1', text: 'Send Split Invoices', due: '2026-01-14', completed: false }],
    interactions: [
        {
            interaction_id: "web_pel_1",
            type: "video_meeting",
            client: "Peloton",
            platform: "Zoom",
            participants: ["Jessica Taylor"],
            date: "2026-01-14",
            duration_minutes: 30,
            ai_summary: "Client requested split payments. Web Meeting Agent triggered Invoice Generation workflow.",
            sentiment: "Positive"
        }
    ],
    messages: []
  },
  {
    id: 'salesforce-001',
    companyName: 'Salesforce',
    logoShort: 'SF',
    amount: 2500000,
    stage: 'Qualification', // Stage 2
    contacts: [
        { name: 'Brian Foster', role: 'EVP', title: 'EVP', email: 'bfoster@salesforce.com', type: 'Decision Maker' }
    ],
    projectDetails: {
        name: "Einstein GPT Enhancement",
        budgetTotal: 2500000,
        budgetSpent: 0,
        timelineStart: "TBD",
        timelineEnd: "TBD",
        statusDescription: "Qualified Lead"
    },
    nextAction: 'Demo Presentation',
    nextActionDate: '2026-01-20',
    sentiment: 'Positive',
    isGhost: false,
    lastUpdated: 'Yesterday',
    probability: 40,
    files: [],
    automation: {
        level: 'Manual',
        autoApprove: [],
        requireApproval: ['Proposal']
    },
    tasks: [{ id: 't_sf_1', text: 'Demo Presentation', due: '2026-01-20', completed: false }],
    interactions: [
        {
            interaction_id: "inperson_sf_1",
            type: "in_person_meeting",
            client: "Salesforce",
            location: "HQ",
            participants: ["Brian Foster"],
            date: "2026-01-13",
            duration_minutes: 60,
            ai_summary: "In-Person visit. Client requested demo. In-Person Agent moved to Qualified and scheduled Demo Prep.",
            sentiment: "Positive"
        }
    ],
    messages: []
  }
];
