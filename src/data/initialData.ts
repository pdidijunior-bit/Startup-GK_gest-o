import { User, Project, Task, MeetingEvent, ContactPartner, ChatMessage, ChatChannel, BrandLogo, DigitalDocument, CloudBackup } from '../types';

// Usuários do sistema (inicia limpo para cadastro ou login próprio)
export const INITIAL_USERS: User[] = [];

// Dados limpos para produção real - sem dados fictícios
export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_MEETINGS: MeetingEvent[] = [];

export const INITIAL_CONTACTS: ContactPartner[] = [];

// Canais padrão para comunicação interna da equipe GK
export const INITIAL_CHANNELS: ChatChannel[] = [
  {
    id: 'chan-1',
    name: 'geral-startup-gk',
    description: 'Canal principal da equipe Startup GK para alinhamentos e comunicados',
    isDirect: false,
    unreadCount: 0,
    memberCount: 1
  },
  {
    id: 'chan-2',
    name: 'desenvolvimento-ti',
    description: 'Canal de engenharia, arquitetura de software, pull requests e deploys',
    isDirect: false,
    unreadCount: 0,
    memberCount: 1
  },
  {
    id: 'chan-3',
    name: 'design-ux',
    description: 'Wireframes, protótipos, identidade visual e aprovações de design',
    isDirect: false,
    unreadCount: 0,
    memberCount: 1
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [];

// Marca e logotipo vetorial oficial da Startup GK
export const INITIAL_BRAND_LOGOS: BrandLogo[] = [
  {
    id: 'logo-official-gk',
    name: 'Startup GK - Marca Oficial Vetorial',
    category: 'Certificações / Tech',
    format: 'SVG',
    dimensions: '1024x1024 px',
    size: '8.4 KB',
    updatedAt: new Date().toISOString().slice(0, 10),
    colorHex: '#06b6d4',
    description: 'Logotipo oficial vetorial de alta definição da Startup GK para assinaturas, propostas e apresentações.',
    svgDataUri: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60">
      <rect x="6" y="8" width="44" height="44" rx="10" fill="#0f172a" stroke="#06b6d4" stroke-width="2.5"/>
      <text x="28" y="37" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#06b6d4" text-anchor="middle">GK</text>
      <text x="58" y="32" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="#ffffff" letter-spacing="1">STARTUP GK</text>
      <text x="58" y="45" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#06b6d4" letter-spacing="0.5">PORTAL TECNOLÓGICO</text>
    </svg>`
  }
];

export const INITIAL_DOCUMENTS: DigitalDocument[] = [];

export const INITIAL_BACKUPS: CloudBackup[] = [];

export const MONTHLY_PERFORMANCE: { month: string; faturamento: number; novosProjetos: number; taxaConversao: number; entregas: number }[] = [];
