export type UserRole = 'Fundador / CEO' | 'Tech Lead / Dev' | 'Full-Stack Developer' | 'UI/UX Designer' | 'Product Manager' | 'Gerente de Contas';

export type Department = 'Desenvolvimento Web' | 'Design & UX' | 'Operações & Negócios' | 'Marketing Digital';

export type UserStatus = 'online' | 'busy' | 'in_meeting' | 'away';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  avatar: string;
  status: UserStatus;
  twoFactorEnabled: boolean;
  securityToken?: string;
  phone?: string;
}

export type ProjectType = 'web_app' | 'site' | 'landing_page' | 'portal_saas';
export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed';

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  client: string;
  description: string;
  status: ProjectStatus;
  progress: number; // 0 to 100
  deadline: string;
  startDate: string;
  budget: number;
  team: string[]; // User IDs or names
  liveUrl?: string;
  repositoryUrl?: string;
  milestones: ProjectMilestone[];
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
}

export type TaskPriority = 'baixa' | 'media' | 'alta' | 'urgente';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

export interface TaskChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string; // User Name
  assignedAvatar?: string;
  dueDate: string;
  startDate?: string;
  projectId: string;
  projectName: string;
  createdAt: string;
  estimatedHours: number;
  tags: string[];
  checklist?: TaskChecklistItem[];
  progress?: number;
}

export type EventType = 'reuniao_cliente' | 'sprint_dev' | 'pitch' | 'alinhamento_interno' | 'entrega';

export interface MeetingEvent {
  id: string;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  locationOrUrl: string;
  participants: string[];
  notes: string;
  clientOrPartner?: string;
  reminderMinutesBefore: number;
  alarmTriggered?: boolean;
  isExternalSynced?: boolean;
  meetLink?: string;
}

export interface ContactNote {
  id: string;
  timestamp: string;
  author: string;
  text: string;
}

export interface InteractionLog {
  id: string;
  type: 'call' | 'whatsapp' | 'email' | 'meeting' | 'note';
  timestamp: string;
  summary: string;
  details?: string;
  author: string;
}

export type PartnerCategory = 'Cliente Potencial' | 'Parceiro Tecnológico' | 'Agência de Publicidade' | 'Investidor / Mentor' | 'Fornecedor Cloud';
export type LeadStatus = 'Novo Lead' | 'Contato Inicial' | 'Proposta Enviada' | 'Em Negociação' | 'Contrato Fechado' | 'Standby';

export interface ContactPartner {
  id: string;
  companyName: string;
  contactPerson: string;
  role: string;
  email: string;
  phone: string;
  whatsapp: string;
  category: PartnerCategory;
  status: LeadStatus;
  estimatedValue: number;
  notesBook: ContactNote[];
  interactionHistory: InteractionLog[];
  logoUrl?: string;
  website?: string;
  lastContactDate: string;
  address?: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  content: string;
  timestamp: string;
  attachment?: {
    name: string;
    size: string;
    type: 'image' | 'code' | 'pdf' | 'doc';
  };
  reactions?: {
    emoji: string;
    count: number;
    users: string[];
  }[];
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  isDirect?: boolean;
  unreadCount?: number;
  memberCount?: number;
}

export interface BrandLogo {
  id: string;
  name: string;
  category: 'Clientes Ativos' | 'Parceiros Estratégicos' | 'Certificações / Tech';
  format: 'SVG' | 'PNG' | 'WEBP';
  dimensions: string;
  size: string;
  updatedAt: string;
  colorHex: string;
  svgDataUri?: string;
  description: string;
}

export interface DigitalDocument {
  id: string;
  title: string;
  category: 'Contratos Digitais' | 'Briefings de Projetos' | 'Propostas Comerciais' | 'Especificações Técnicas';
  fileType: 'PDF' | 'DOCX' | 'JSON' | 'ZIP';
  fileSize: string;
  date: string;
  version: string;
  summary: string;
  status: 'Assinado' | 'Em Validação' | 'Rascunho' | 'Arquivado';
  tags: string[];
}

export interface CloudBackup {
  id: string;
  timestamp: string;
  totalRecords: number;
  sizeKb: number;
  status: 'synced' | 'local_only';
  hash: string;
  createdByName: string;
}

export interface AlarmItem {
  id: string;
  eventId: string;
  title: string;
  eventTime: string;
  timeRemainingMinutes: number;
  meetLink?: string;
  participants: string[];
  active: boolean;
  snoozedUntil?: number;
}
