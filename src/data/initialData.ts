import { User, Project, Task, MeetingEvent, ContactPartner, ChatMessage, ChatChannel, BrandLogo, DigitalDocument, CloudBackup } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Sérgio GK',
    email: 'sergio@startupgk.com',
    role: 'Fundador / CEO',
    department: 'Operações & Negócios',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    twoFactorEnabled: true,
    securityToken: 'GK-AUTH-9921',
    phone: '+55 11 98765-4321'
  },
  {
    id: 'user-2',
    name: 'Guilherme Dev',
    email: 'guilherme@startupgk.com',
    role: 'Tech Lead / Dev',
    department: 'Desenvolvimento Web',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    twoFactorEnabled: true,
    securityToken: 'GK-AUTH-4122',
    phone: '+55 11 97654-3210'
  },
  {
    id: 'user-3',
    name: 'Karen Designer',
    email: 'karen@startupgk.com',
    role: 'UI/UX Designer',
    department: 'Design & UX',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'busy',
    twoFactorEnabled: true,
    securityToken: 'GK-AUTH-7731',
    phone: '+55 11 96543-2109'
  },
  {
    id: 'user-4',
    name: 'Lucas Martins',
    email: 'lucas@startupgk.com',
    role: 'Product Manager',
    department: 'Operações & Negócios',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'in_meeting',
    twoFactorEnabled: true,
    securityToken: 'GK-AUTH-3329',
    phone: '+55 11 95432-1098'
  },
  {
    id: 'user-5',
    name: 'Beatriz Costa',
    email: 'beatriz@startupgk.com',
    role: 'Full-Stack Developer',
    department: 'Desenvolvimento Web',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    twoFactorEnabled: true,
    securityToken: 'GK-AUTH-8820',
    phone: '+55 11 94321-0987'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Portal Imobiliária Prime SaaS',
    type: 'web_app',
    client: 'Grupo Imobiliário Prime',
    description: 'Desenvolvimento de plataforma web completa com busca interativa de imóveis, tour virtual e gestão de corretores.',
    status: 'in_progress',
    progress: 78,
    deadline: '2026-09-28',
    startDate: '2026-08-01',
    budget: 42000,
    team: ['Sérgio GK', 'Guilherme Dev', 'Karen Designer', 'Beatriz Costa'],
    liveUrl: 'https://prime-preview.startupgk.com',
    repositoryUrl: 'https://github.com/startupgk/prime-saas',
    priority: 'alta',
    milestones: [
      { id: 'm1', title: 'Arquitetura e Wireframes', completed: true, dueDate: '2026-08-10' },
      { id: 'm2', title: 'Módulo de Agendamento e Tour 3D', completed: true, dueDate: '2026-08-25' },
      { id: 'm3', title: 'Integração de Pagamentos e Checkout', completed: true, dueDate: '2026-09-15' },
      { id: 'm4', title: 'Homologação e Deploy Final', completed: false, dueDate: '2026-09-28' }
    ]
  },
  {
    id: 'proj-2',
    name: 'Landing Page de Alta Conversão - FinTech Neo',
    type: 'landing_page',
    client: 'Neo Pagamentos Digitais',
    description: 'Página publicitária responsiva com animações fluidas para campanha de captação de clientes corporativos com formulário inteligente.',
    status: 'review',
    progress: 92,
    deadline: '2026-09-12',
    startDate: '2026-08-20',
    budget: 14500,
    team: ['Karen Designer', 'Beatriz Costa', 'Lucas Martins'],
    liveUrl: 'https://neo-campanha.startupgk.com',
    repositoryUrl: 'https://github.com/startupgk/neo-ads-landing',
    priority: 'urgente',
    milestones: [
      { id: 'm5', title: 'Design System & Copywriting', completed: true, dueDate: '2026-08-24' },
      { id: 'm6', title: 'Desenvolvimento Frontend & Speed Score', completed: true, dueDate: '2026-09-02' },
      { id: 'm7', title: 'Testes A/B e Pixel Tracking', completed: false, dueDate: '2026-09-12' }
    ]
  },
  {
    id: 'proj-3',
    name: 'E-Commerce Vanguarda Fashion',
    type: 'site',
    client: 'Vanguarda Confecções',
    description: 'Loja virtual moderna e responsiva com catálogo otimizado, filtro por cores/tamanhos e integração com ERP.',
    status: 'in_progress',
    progress: 60,
    deadline: '2026-10-15',
    startDate: '2026-08-15',
    budget: 31000,
    team: ['Guilherme Dev', 'Beatriz Costa'],
    liveUrl: 'https://vanguarda.startupgk.com',
    repositoryUrl: 'https://github.com/startupgk/vanguarda-store',
    priority: 'media',
    milestones: [
      { id: 'm8', title: 'Catálogo de Produtos e Filtros', completed: true, dueDate: '2026-09-01' },
      { id: 'm9', title: 'Carrinho e Gateway de Frete', completed: false, dueDate: '2026-09-22' },
      { id: 'm10', title: 'Painel Administrativo do Lojista', completed: false, dueDate: '2026-10-08' }
    ]
  },
  {
    id: 'proj-4',
    name: 'Sistema de Telemedicina Dr. Consulta',
    type: 'web_app',
    client: 'MedHealth Tech',
    description: 'Web app de prontuário eletrônico com sala de vídeo integrada via WebRTC e emissão de receitas digitais.',
    status: 'planning',
    progress: 25,
    deadline: '2026-11-20',
    startDate: '2026-09-01',
    budget: 58000,
    team: ['Sérgio GK', 'Guilherme Dev', 'Karen Designer', 'Lucas Martins'],
    priority: 'alta',
    milestones: [
      { id: 'm11', title: 'Levantamento de Requisitos e LGPD', completed: true, dueDate: '2026-09-08' },
      { id: 'm12', title: 'Módulo de Videochamadas', completed: false, dueDate: '2026-10-05' },
      { id: 'm13', title: 'Receituário com Assinatura ICP-Brasil', completed: false, dueDate: '2026-11-01' }
    ]
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Ajustar webhook de pagamento na Imobiliária Prime',
    description: 'Configurar notificações automáticas de confirmação de sinal de compra via webhook seguro com fallback.',
    priority: 'urgente',
    status: 'in_progress',
    assignedTo: 'Guilherme Dev',
    startDate: '2026-09-04',
    dueDate: '2026-09-08',
    projectId: 'proj-1',
    projectName: 'Portal Imobiliária Prime SaaS',
    createdAt: '2026-09-04',
    estimatedHours: 6,
    tags: ['Backend', 'Webhooks', 'Pagamentos'],
    progress: 65,
    checklist: [
      { id: 'c1-1', title: 'Validar assinatura criptográfica HMAC SHA-256', completed: true },
      { id: 'c1-2', title: 'Implementar fila de retentativas assíncronas', completed: true },
      { id: 'c1-3', title: 'Configurar logs de auditoria no Firestore', completed: false }
    ]
  },
  {
    id: 'task-2',
    title: 'Finalizar micro-interações da Landing FinTech Neo',
    description: 'Aplicar animações de entrada nos números de estatística e botão CTA com feedback visual pulsante.',
    priority: 'alta',
    status: 'review',
    assignedTo: 'Karen Designer',
    startDate: '2026-09-03',
    dueDate: '2026-09-07',
    projectId: 'proj-2',
    projectName: 'Landing Page de Alta Conversão - FinTech Neo',
    createdAt: '2026-09-03',
    estimatedHours: 4,
    tags: ['UI/UX', 'Tailwind', 'Animação'],
    progress: 90,
    checklist: [
      { id: 'c2-1', title: 'Criar componente Hero responsivo', completed: true },
      { id: 'c2-2', title: 'Refinar animação de contador numérico com motion', completed: true },
      { id: 'c2-3', title: 'Homologação em dispositivos iOS e Android', completed: true }
    ]
  },
  {
    id: 'task-3',
    title: 'Otimizar Core Web Vitals do E-Commerce Vanguarda',
    description: 'Comprimir imagens para formato WebP e configurar lazy loading nativo para atingir nota 95+ no PageSpeed.',
    priority: 'media',
    status: 'todo',
    assignedTo: 'Beatriz Costa',
    startDate: '2026-09-05',
    dueDate: '2026-09-11',
    projectId: 'proj-3',
    projectName: 'E-Commerce Vanguarda Fashion',
    createdAt: '2026-09-05',
    estimatedHours: 5,
    tags: ['Performance', 'SEO', 'Imagens'],
    progress: 25,
    checklist: [
      { id: 'c3-1', title: 'Converter biblioteca de banners para WebP', completed: true },
      { id: 'c3-2', title: 'Minificar CSS e otimizar bundle Vite', completed: false },
      { id: 'c3-3', title: 'Validar métricas LCP e CLS no Lighthouse', completed: false }
    ]
  },
  {
    id: 'task-4',
    title: 'Estruturar protótipo de alta fidelidade do MedHealth',
    description: 'Criar componentes Figma para a tela do médico e painel de histórico de consultas dos pacientes.',
    priority: 'alta',
    status: 'in_progress',
    assignedTo: 'Karen Designer',
    startDate: '2026-09-02',
    dueDate: '2026-09-14',
    projectId: 'proj-4',
    projectName: 'Sistema de Telemedicina Dr. Consulta',
    createdAt: '2026-09-02',
    estimatedHours: 12,
    tags: ['Figma', 'UX Research', 'Design System'],
    progress: 50,
    checklist: [
      { id: 'c4-1', title: 'Entrevistas de alinhamento com especialistas', completed: true },
      { id: 'c4-2', title: 'Design system e biblioteca de componentes', completed: true },
      { id: 'c4-3', title: 'Fluxo interativo de videochamada WebRTC', completed: false }
    ]
  },
  {
    id: 'task-5',
    title: 'Auditoria de segurança e 2FA nos endpoints privados GK',
    description: 'Verificar se tokens de sessão e autenticação de dois fatores estão protegidos contra ataques CSRF e replay.',
    priority: 'urgente',
    status: 'done',
    assignedTo: 'Guilherme Dev',
    startDate: '2026-09-01',
    dueDate: '2026-09-05',
    projectId: 'proj-1',
    projectName: 'Portal Imobiliária Prime SaaS',
    createdAt: '2026-09-01',
    estimatedHours: 8,
    tags: ['Segurança', '2FA', 'Auditoria'],
    progress: 100,
    checklist: [
      { id: 'c5-1', title: 'Implementar validação de regras do Firestore', completed: true },
      { id: 'c5-2', title: 'Criptografia de dados sensíveis em repouso', completed: true },
      { id: 'c5-3', title: 'Testes de estresse e proteção contra força bruta', completed: true }
    ]
  },
  {
    id: 'task-6',
    title: 'Redigir proposta comercial para novo cliente Nexus Logística',
    description: 'Montar escopo técnico e cronograma de entrega do sistema web de roteirização com dashboard em tempo real.',
    priority: 'media',
    status: 'todo',
    assignedTo: 'Lucas Martins',
    startDate: '2026-09-05',
    dueDate: '2026-09-09',
    projectId: 'proj-1',
    projectName: 'Novos Negócios GK',
    createdAt: '2026-09-05',
    estimatedHours: 4,
    tags: ['Comercial', 'Proposta', 'Nexus'],
    progress: 0,
    checklist: [
      { id: 'c6-1', title: 'Planilha de custos e alocação da equipe', completed: false },
      { id: 'c6-2', title: 'Documentação da arquitetura em PDF', completed: false }
    ]
  }
];


// Today is 2026-09-06
export const INITIAL_MEETINGS: MeetingEvent[] = [
  {
    id: 'meet-1',
    title: 'Alinhamento Semanal Geral GK & Sprint Review',
    type: 'sprint_dev',
    date: '2026-09-06',
    startTime: '10:00',
    endTime: '11:00',
    locationOrUrl: 'Google Meet - Sala GK Tech',
    meetLink: 'https://meet.google.com/gk-sprint-tech',
    participants: ['Sérgio GK', 'Guilherme Dev', 'Karen Designer', 'Beatriz Costa', 'Lucas Martins'],
    notes: 'Revisão dos entregáveis da semana, status do deploy da Imobiliária Prime e alinhamento das novas landing pages publicitárias.',
    reminderMinutesBefore: 15,
    isExternalSynced: true
  },
  {
    id: 'meet-2',
    title: 'Apresentação Comercial & Demo - Nexus Logística',
    type: 'pitch',
    date: '2026-09-06',
    startTime: '14:30',
    endTime: '15:15',
    locationOrUrl: 'Google Meet com Diretor da Nexus',
    meetLink: 'https://meet.google.com/nexus-gk-pitch',
    participants: ['Sérgio GK', 'Lucas Martins'],
    notes: 'Demonstrar arquitetura escalável e cases de apps desenvolvidos pela GK. Foco em redução de tempo de carregamento e gestão de frota.',
    clientOrPartner: 'Nexus Logística Inteligente',
    reminderMinutesBefore: 10,
    isExternalSynced: true
  },
  {
    id: 'meet-3',
    title: 'Revisão de Design da Landing FinTech Neo',
    type: 'reuniao_cliente',
    date: '2026-09-07',
    startTime: '16:00',
    endTime: '16:45',
    locationOrUrl: 'Google Meet - Neo Marketing',
    meetLink: 'https://meet.google.com/neo-ads-approval',
    participants: ['Karen Designer', 'Lucas Martins'],
    notes: 'Aprovação da paleta e taxa de conversão esperada para a campanha de lançamento publicitário.',
    clientOrPartner: 'Neo Pagamentos Digitais',
    reminderMinutesBefore: 15,
    isExternalSynced: true
  },
  {
    id: 'meet-4',
    title: 'Alinhamento de Integração com Banco Horizonte',
    type: 'alinhamento_interno',
    date: '2026-09-08',
    startTime: '11:30',
    endTime: '12:15',
    locationOrUrl: 'Google Meet Privado',
    meetLink: 'https://meet.google.com/banco-horizonte-gk',
    participants: ['Sérgio GK', 'Guilherme Dev'],
    notes: 'Discussão sobre API bancária Pix e homologação de chaves criptográficas.',
    clientOrPartner: 'Banco Horizonte',
    reminderMinutesBefore: 30,
    isExternalSynced: true
  }
];

export const INITIAL_CONTACTS: ContactPartner[] = [
  {
    id: 'cont-1',
    companyName: 'Neo Pagamentos Digitais',
    contactPerson: 'Renata Albuquerque',
    role: 'Head de Marketing & Growth',
    email: 'renata.albuquerque@neopag.com.br',
    phone: '+55 11 99123-4567',
    whatsapp: '5511991234567',
    category: 'Cliente Potencial',
    status: 'Contrato Fechado',
    estimatedValue: 18500,
    website: 'https://neopag.com.br',
    lastContactDate: '2026-09-04',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    notesBook: [
      {
        id: 'n-1',
        timestamp: '2026-09-04 14:20',
        author: 'Sérgio GK',
        text: 'Cliente aprovou o briefing da landing page. Prioridade em máxima velocidade no celular e integração com CRM HubSpot.'
      },
      {
        id: 'n-2',
        timestamp: '2026-08-28 10:15',
        author: 'Lucas Martins',
        text: 'Reunião inicial produtiva. Pediram proposta com garantia de entrega em 14 dias úteis.'
      }
    ],
    interactionHistory: [
      {
        id: 'i-1',
        type: 'whatsapp',
        timestamp: '2026-09-04 14:35',
        summary: 'Conversa WhatsApp com Renata Albuquerque',
        details: 'Envio do link do rascunho da página para conferência preliminar de textos.',
        author: 'Sérgio GK'
      },
      {
        id: 'i-2',
        type: 'meeting',
        timestamp: '2026-08-28 10:00',
        summary: 'Reunião Virtual de Alinhamento de Escopo',
        details: 'Definição de cronograma e metas de conversão de cliques em leads.',
        author: 'Lucas Martins'
      }
    ]
  },
  {
    id: 'cont-2',
    companyName: 'Nexus Logística Inteligente',
    contactPerson: 'Carlos Eduardo Mendes',
    role: 'Diretor de Operações e TI',
    email: 'carlos.mendes@nexuslog.com.br',
    phone: '+55 11 98234-5678',
    whatsapp: '5511982345678',
    category: 'Cliente Potencial',
    status: 'Em Negociação',
    estimatedValue: 64000,
    website: 'https://nexuslog.com.br',
    lastContactDate: '2026-09-05',
    address: 'Rod. Anhanguera, km 28 - Jundiaí, SP',
    notesBook: [
      {
        id: 'n-3',
        timestamp: '2026-09-05 16:45',
        author: 'Lucas Martins',
        text: 'Carlos tem muito interesse no nosso painel de controle em tempo real. Solicitou demonstração de como funciona o app nos celulares dos motoristas.'
      }
    ],
    interactionHistory: [
      {
        id: 'i-3',
        type: 'call',
        timestamp: '2026-09-05 16:30',
        summary: 'Ligação telefônica para Carlos Mendes',
        details: 'Confirmada a reunião de pitch para hoje às 14:30.',
        author: 'Lucas Martins'
      },
      {
        id: 'i-4',
        type: 'email',
        timestamp: '2026-09-02 09:12',
        summary: 'E-mail com Portfólio de Aplicativos da Startup GK',
        details: 'Envio de PDF detalhado com cases de sucesso em rastreamento e sites corporativos.',
        author: 'Sérgio GK'
      }
    ]
  },
  {
    id: 'cont-3',
    companyName: 'Agência Impulso Digital',
    contactPerson: 'Camila Rocha',
    role: 'Sócia e Diretora de Criação',
    email: 'camila@impulsodigital.agency',
    phone: '+55 21 97345-6789',
    whatsapp: '5521973456789',
    category: 'Parceiro Tecnológico',
    status: 'Contrato Fechado',
    estimatedValue: 35000,
    website: 'https://impulsodigital.agency',
    lastContactDate: '2026-09-03',
    address: 'Ipanema - Rio de Janeiro, RJ',
    notesBook: [
      {
        id: 'n-4',
        timestamp: '2026-09-03 11:30',
        author: 'Karen Designer',
        text: 'Parceria formalizada: a Impulso cria campanhas de tráfego pago e terceiriza toda a programação de landing pages e web apps para a Startup GK.'
      }
    ],
    interactionHistory: [
      {
        id: 'i-5',
        type: 'meeting',
        timestamp: '2026-09-03 11:00',
        summary: 'Reunião de assinatura de convênio técnico',
        details: 'Definida tabela de preços especiais para projetos recorrentes.',
        author: 'Sérgio GK'
      }
    ]
  },
  {
    id: 'cont-4',
    companyName: 'Banco Horizonte S/A',
    contactPerson: 'Marcio Telles',
    role: 'Gerente de Parcerias e Inovação',
    email: 'marcio.telles@bancohorizonte.com.br',
    phone: '+55 11 96456-7890',
    whatsapp: '5511964567890',
    category: 'Cliente Potencial',
    status: 'Proposta Enviada',
    estimatedValue: 92000,
    website: 'https://bancohorizonte.com.br',
    lastContactDate: '2026-09-01',
    address: 'Faria Lima, 3400 - São Paulo, SP',
    notesBook: [
      {
        id: 'n-5',
        timestamp: '2026-09-01 17:00',
        author: 'Sérgio GK',
        text: 'Proposta enviada para desenvolvimento do novo portal institucional de crédito com simulador interativo em React e alta segurança.'
      }
    ],
    interactionHistory: [
      {
        id: 'i-6',
        type: 'email',
        timestamp: '2026-09-01 16:50',
        summary: 'Envio da Proposta Comercial GK-PROP-2026-44',
        details: 'Proposta de R$ 92.000 com prazo de 90 dias enviada com NDA assinado.',
        author: 'Sérgio GK'
      }
    ]
  },
  {
    id: 'cont-5',
    companyName: 'Vanguarda Confecções',
    contactPerson: 'Fernanda Linhares',
    role: 'Diretora Comercial',
    email: 'fernanda@vanguardamoda.com.br',
    phone: '+55 31 99876-5432',
    whatsapp: '5531998765432',
    category: 'Cliente Potencial',
    status: 'Contrato Fechado',
    estimatedValue: 31000,
    website: 'https://vanguardamoda.com.br',
    lastContactDate: '2026-08-30',
    address: 'Belo Horizonte, MG',
    notesBook: [
      {
        id: 'n-6',
        timestamp: '2026-08-30 15:00',
        author: 'Beatriz Costa',
        text: 'Cliente pediu suporte para integração com o gateway de frete Melhor Envio e cálculo em tempo real.'
      }
    ],
    interactionHistory: [
      {
        id: 'i-7',
        type: 'whatsapp',
        timestamp: '2026-08-30 15:10',
        summary: 'Alinhamento de especificações de frete',
        author: 'Beatriz Costa'
      }
    ]
  }
];

export const INITIAL_CHANNELS: ChatChannel[] = [
  { id: 'chan-1', name: 'geral', description: 'Canal oficial da Startup GK para comunicados e alinhamentos gerais', memberCount: 5, unreadCount: 0 },
  { id: 'chan-2', name: 'projetos-web-apps', description: 'Discussão técnica sobre web apps e arquitetura de software', memberCount: 4, unreadCount: 2 },
  { id: 'chan-3', name: 'design-e-landing-pages', description: 'Criação de páginas publicitárias, UI/UX e aprovações de clientes', memberCount: 3, unreadCount: 1 },
  { id: 'chan-4', name: 'comercial-e-parceiros', description: 'Propostas enviadas, negociações com clientes e novos leads', memberCount: 3, unreadCount: 0 }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    channelId: 'chan-1',
    senderId: 'user-1',
    senderName: 'Sérgio GK',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    senderRole: 'Fundador / CEO',
    content: 'Bom dia time GK! Lembrando que hoje temos a reunião geral de sprint às 10:00 no Meet e à tarde a apresentação do app da Nexus Logística. Vamos com tudo!',
    timestamp: 'Hoje às 08:30',
    reactions: [
      { emoji: '🚀', count: 4, users: ['Guilherme Dev', 'Karen Designer', 'Beatriz Costa', 'Lucas Martins'] },
      { emoji: '🔥', count: 3, users: ['Guilherme Dev', 'Lucas Martins', 'Beatriz Costa'] }
    ]
  },
  {
    id: 'msg-2',
    channelId: 'chan-1',
    senderId: 'user-2',
    senderName: 'Guilherme Dev',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    senderRole: 'Tech Lead / Dev',
    content: 'Perfeito Sérgio! O build do servidor da Imobiliária Prime está 100% estável e os testes de 2FA foram validados.',
    timestamp: 'Hoje às 08:42'
  },
  {
    id: 'msg-3',
    channelId: 'chan-2',
    senderId: 'user-5',
    senderName: 'Beatriz Costa',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    senderRole: 'Full-Stack Developer',
    content: 'Subi no repositório a atualização do módulo de catálogo com busca instantânea. Quem puder rodar um code review agradeço!',
    timestamp: 'Hoje às 09:10',
    attachment: {
      name: 'pr-142-catalog-speed.ts',
      size: '24 KB',
      type: 'code'
    }
  },
  {
    id: 'msg-4',
    channelId: 'chan-3',
    senderId: 'user-3',
    senderName: 'Karen Designer',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    senderRole: 'UI/UX Designer',
    content: 'Os assets visuais da Landing Page da FinTech Neo já estão renderizados em alta definição. Ficou muito moderna e pronta para anúncios de tráfego pago!',
    timestamp: 'Hoje às 09:15'
  }
];

export const INITIAL_BRAND_LOGOS: BrandLogo[] = [
  {
    id: 'logo-1',
    name: 'Startup GK - Identidade Master',
    category: 'Clientes Ativos',
    format: 'SVG',
    dimensions: '1920x1080 px',
    size: '14.2 KB',
    updatedAt: '2026-09-01',
    colorHex: '#06b6d4',
    description: 'Logo oficial da Startup GK para aplicações web, favicons e cabeçalhos de relatórios.',
    svgDataUri: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 70" width="240" height="70">
      <defs>
        <linearGradient id="gk-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#06b6d4" />
          <stop offset="100%" stop-color="#3b82f6" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="14" fill="url(#gk-grad)" />
      <text x="30" y="42" font-family="'Space Grotesk', sans-serif" font-size="30" font-weight="900" fill="#ffffff" text-anchor="middle">GK</text>
      <text x="76" y="38" font-family="'Space Grotesk', sans-serif" font-size="22" font-weight="800" fill="#f8fafc">STARTUP GK</text>
      <text x="76" y="52" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="600" fill="#94a3b8" letter-spacing="1.5">TI & SOLUÇÕES DIGITAIS</text>
    </svg>`
  },
  {
    id: 'logo-2',
    name: 'Neo Pagamentos Digitais',
    category: 'Clientes Ativos',
    format: 'SVG',
    dimensions: '800x400 px',
    size: '18.6 KB',
    updatedAt: '2026-08-25',
    colorHex: '#10b981',
    description: 'Vetor oficial do cliente FinTech Neo para landing pages e criativos de anúncios publicitários.',
    svgDataUri: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
      <circle cx="30" cy="30" r="22" fill="#10b981" />
      <path d="M22 30 L28 36 L38 24" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" />
      <text x="64" y="38" font-family="sans-serif" font-size="22" font-weight="800" fill="#f8fafc">NEO PAG</text>
    </svg>`
  },
  {
    id: 'logo-3',
    name: 'Nexus Logística Inteligente',
    category: 'Clientes Ativos',
    format: 'SVG',
    dimensions: '1200x600 px',
    size: '22.1 KB',
    updatedAt: '2026-09-02',
    colorHex: '#f59e0b',
    description: 'Logo oficial da transportadora para integração na plataforma de rastreamento de cargas.',
    svgDataUri: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60" width="220" height="60">
      <polygon points="10,48 28,12 46,48" fill="#f59e0b" />
      <text x="58" y="38" font-family="sans-serif" font-size="20" font-weight="800" fill="#f8fafc">NEXUS LOG</text>
    </svg>`
  },
  {
    id: 'logo-4',
    name: 'Agência Impulso Digital',
    category: 'Parceiros Estratégicos',
    format: 'SVG',
    dimensions: '900x450 px',
    size: '16.8 KB',
    updatedAt: '2026-08-18',
    colorHex: '#8b5cf6',
    description: 'Marca da agência parceira de publicidade que repassa projetos de web design e desenvolvimento para a GK.',
    svgDataUri: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60" width="220" height="60">
      <rect x="8" y="10" width="38" height="38" rx="8" fill="#8b5cf6" />
      <path d="M18 36 L27 20 L36 36" stroke="#ffffff" stroke-width="3" fill="none" />
      <text x="56" y="38" font-family="sans-serif" font-size="20" font-weight="800" fill="#f8fafc">IMPULSO</text>
    </svg>`
  },
  {
    id: 'logo-5',
    name: 'Banco Horizonte',
    category: 'Clientes Ativos',
    format: 'SVG',
    dimensions: '1000x500 px',
    size: '26.4 KB',
    updatedAt: '2026-08-30',
    colorHex: '#3b82f6',
    description: 'Logo corporativo do Banco Horizonte para compor a proposta do novo portal institucional.',
    svgDataUri: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60">
      <circle cx="28" cy="30" r="20" fill="#3b82f6" />
      <line x1="16" y1="30" x2="40" y2="30" stroke="#ffffff" stroke-width="4" />
      <line x1="28" y1="18" x2="28" y2="42" stroke="#ffffff" stroke-width="4" />
      <text x="58" y="38" font-family="sans-serif" font-size="20" font-weight="800" fill="#f8fafc">B. HORIZONTE</text>
    </svg>`
  },
  {
    id: 'logo-6',
    name: 'Certificação Cloud AWS Partner GK',
    category: 'Certificações / Tech',
    format: 'SVG',
    dimensions: '800x400 px',
    size: '19.0 KB',
    updatedAt: '2026-07-15',
    colorHex: '#ff9900',
    description: 'Selo de arquitetura em nuvem e infraestrutura escalável utilizado nas propostas comerciais da GK.',
    svgDataUri: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60">
      <rect x="10" y="12" width="40" height="36" rx="6" fill="#ff9900" />
      <text x="30" y="36" font-family="sans-serif" font-size="14" font-weight="bold" fill="#111827" text-anchor="middle">CLOUD</text>
      <text x="60" y="36" font-family="sans-serif" font-size="18" font-weight="800" fill="#f8fafc">TECH PARTNER</text>
    </svg>`
  }
];

export const INITIAL_DOCUMENTS: DigitalDocument[] = [
  {
    id: 'doc-1',
    title: 'Contrato de Desenvolvimento de Software & Web App - Startup GK.pdf',
    category: 'Contratos Digitais',
    fileType: 'PDF',
    fileSize: '420 KB',
    date: '2026-09-01',
    version: 'v3.2',
    status: 'Assinado',
    tags: ['Jurídico', 'Web App', 'Propriedade Intelectual', 'Garantia 12 Meses'],
    summary: 'Modelo padrão de contrato da Startup GK com cláusulas de entrega de código-fonte, sigilo (NDA), suporte e SLAs de disponibilidade.'
  },
  {
    id: 'doc-2',
    title: 'Acordo de Confidencialidade e NDA de Equipe Interna GK.pdf',
    category: 'Contratos Digitais',
    fileType: 'PDF',
    fileSize: '280 KB',
    date: '2026-08-15',
    version: 'v2.0',
    status: 'Assinado',
    tags: ['Segurança', 'Equipe Interna', 'Código Privado'],
    summary: 'Termo de sigilo obrigatório assinado por todos os desenvolvedores e designers da Startup GK protegendo segredos industriais de clientes.'
  },
  {
    id: 'doc-3',
    title: 'Briefing Técnico de Arquitetura - Portal Imobiliária Prime.pdf',
    category: 'Briefings de Projetos',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    date: '2026-08-20',
    version: 'v1.4',
    status: 'Em Validação',
    tags: ['Arquitetura', 'React 19', 'PostgreSQL', 'API GraphQL'],
    summary: 'Especificação completa do fluxo de reservas de imóveis, modelagem de banco de dados e rotas autenticadas da aplicação.'
  },
  {
    id: 'doc-4',
    title: 'Proposta Comercial & Cronograma GK-PROP-2026-44 (Banco Horizonte).pdf',
    category: 'Propostas Comerciais',
    fileType: 'PDF',
    fileSize: '890 KB',
    date: '2026-09-01',
    version: 'v1.0',
    status: 'Em Validação',
    tags: ['Comercial', 'Banco Horizonte', 'R$ 92k', 'Simulador Pix'],
    summary: 'Documento contendo estimativa de esforço, horas da equipe GK, modelo de governança e precificação em 3 parcelas.'
  },
  {
    id: 'doc-5',
    title: 'Guia de Diretrizes de Páginas Publicitárias de Alta Conversão.pdf',
    category: 'Especificações Técnicas',
    fileType: 'PDF',
    fileSize: '650 KB',
    date: '2026-08-10',
    version: 'v2.1',
    status: 'Assinado',
    tags: ['Boas Práticas', 'Ads', 'Google Ads', 'Meta Pixel', 'PageSpeed 95+'],
    summary: 'Manual interno com os requisitos que toda landing page criada pela GK deve cumprir antes do deploy final.'
  }
];

export const INITIAL_BACKUPS: CloudBackup[] = [
  {
    id: 'bkp-1',
    timestamp: '2026-09-05 23:59',
    totalRecords: 128,
    sizeKb: 342,
    status: 'synced',
    hash: 'SHA256-GK-99A1F2C84',
    createdByName: 'Backup Automático Nuvem GK'
  },
  {
    id: 'bkp-2',
    timestamp: '2026-09-04 23:59',
    totalRecords: 119,
    sizeKb: 318,
    status: 'synced',
    hash: 'SHA256-GK-77B3E9D10',
    createdByName: 'Backup Automático Nuvem GK'
  }
];

export const MONTHLY_PERFORMANCE = [
  { month: 'Abr/26', faturamento: 45000, novosProjetos: 3, taxaConversao: 32, entregas: 3 },
  { month: 'Mai/26', faturamento: 58000, novosProjetos: 4, taxaConversao: 38, entregas: 4 },
  { month: 'Jun/26', faturamento: 64000, novosProjetos: 5, taxaConversao: 44, entregas: 4 },
  { month: 'Jul/26', faturamento: 79000, novosProjetos: 6, taxaConversao: 48, entregas: 5 },
  { month: 'Ago/26', faturamento: 96500, novosProjetos: 7, taxaConversao: 52, entregas: 6 },
  { month: 'Set/26 (Proj.)', faturamento: 118000, novosProjetos: 8, taxaConversao: 58, entregas: 7 }
];
