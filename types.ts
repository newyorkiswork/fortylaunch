
export type DealStage = 'Qualification' | 'Discovery' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost' | 'Active Project';
export type Sentiment = 'Positive' | 'Neutral' | 'Negative';
export type AccessLevel = 'Admin' | 'Agent' | 'Viewer';
export type CommunicationSource = 'Phone' | 'Email' | 'Zoom' | 'GoogleMeet' | 'InPerson' | 'NetworkEvent' | 'Slack' | 'Unknown';

export interface Contact {
  name: string;
  role: string;
  title: string;
  email: string;
  type?: 'Decision Maker' | 'Champion' | 'Technical' | 'Stakeholder';
}

export interface ClientFile {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'image' | 'archive' | 'video' | 'audio';
  size: string;
  uploadDate: string;
  aiSummary?: string;
  url?: string;
}

export interface AutomationSettings {
  level: 'Manual' | 'Hybrid' | 'Auto';
  autoApprove: string[];
  requireApproval: string[];
}

export type InteractionType = 'phone_call' | 'video_meeting' | 'in_person_meeting' | 'email' | 'slack_message' | 'voice_note';

export interface ActionItem {
  item: string;
  owner: string;
  due_date: string;
  status: 'pending' | 'completed';
}

export interface Interaction {
  interaction_id: string;
  type: InteractionType;
  client: string;
  date: string;
  participants?: string[]; // For calls/meetings
  from?: string; // For emails/slack
  to?: string[]; // For emails
  subject?: string; // For emails
  channel?: string; // For slack
  duration_minutes?: number;
  location?: string; // For in-person
  platform?: string; // For video
  
  // Media & Content
  audio_url?: string;
  video_url?: string;
  photos?: string[];
  body?: string; // Email/Slack content
  transcript?: string;
  
  // Intelligence
  ai_summary?: string;
  action_items?: ActionItem[];
  sentiment?: Sentiment;
  key_topics?: string[];
  expenses?: {
      lunch?: number;
      travel?: number;
  };
}

export interface ProjectDetails {
    name: string;
    budgetTotal: number;
    budgetSpent: number;
    timelineStart: string;
    timelineEnd: string;
    statusDescription: string;
}

export interface Contract {
  id: string;
  title: string;
  status: 'Draft' | 'Pending Signature' | 'Signed';
  value: number;
  content: string; 
  signatures: {
    signerName: string;
    date: string;
    signatureImage?: string; 
  }[];
  dateCreated: string;
  aiSummary?: string;
}

export interface Opportunity {
  id: string;
  companyName: string;
  logoShort: string; // e.g., "AC"
  amount: number;
  stage: DealStage;
  contacts: Contact[];
  nextAction: string;
  nextActionDate: string;
  sentiment: Sentiment;
  isGhost: boolean;
  lastUpdated: string;
  probability: number;
  
  // New Project Fields
  projectDetails?: ProjectDetails;
  interactions: Interaction[]; // Replaces old 'messages'
  
  contractId?: string;
  leadSource?: string;
  leadStatus?: string;
  files: ClientFile[];
  automation: AutomationSettings;
  tasks: { id: string; text: string; due: string; completed: boolean }[];
  
  // Backward compatibility for existing components if needed, though we will refactor them
  messages?: any[]; 
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  attendees: string[];
  type: 'Meeting' | 'Call' | 'Task' | 'Deadline';
  recurrence?: 'None' | 'Daily' | 'Weekly' | 'Monthly';
  status: 'Pending' | 'Completed' | 'Incomplete' | 'Revise';
}

export interface Agent {
  id: string;
  name: string;
  role: 'Scheduler' | 'Legal' | 'Sales' | 'Analyst';
  status: 'Active' | 'Processing' | 'Idle';
  currentTask?: string;
  avatarColor: string;
}

export interface UserState {
  credits: number;
  role: AccessLevel;
  name: string;
  isOnline: boolean;
  language: string;
  themeColor: string;
  savedSignature?: {
      dataUrl: string;
      dateStored: string;
  };
}

export interface AIAction {
  type: 'NAVIGATE_CONTRACT' | 'NAVIGATE_MESSAGE' | 'NAVIGATE_CALENDAR' | 'SCHEDULE_MEETING' | 'SEND_DOCUMENT' | 'SEND_EMAIL' | 'DRAFT_REPLY' | 'SIGN_CONTRACT' | 'LOG_ACTIVITY' | 'CONTROL_LIGHT' | 'NONE';
  targetId?: string;
  payload?: any;
}
