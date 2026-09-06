import React from 'react';
import {
  LayoutDashboard,
  Layers,
  CheckSquare,
  Calendar,
  MessageSquare,
  Users,
  BarChart3,
  Image,
  FileText,
  Cloud,
  ChevronRight,
  ShieldAlert,
  RotateCcw,
  Database
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export type ActiveTab =
  | 'dashboard'
  | 'projects'
  | 'tasks'
  | 'calendar'
  | 'chat'
  | 'contacts'
  | 'analytics'
  | 'logos'
  | 'documents'
  | 'backup';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile
}) => {
  const {
    tasks,
    projects,
    contacts,
    activeAlarms,
    setFirestoreRulesModalOpen,
    clearCacheAndReset,
    firebaseConnected,
    firebaseProjectId
  } = useApp();

  const urgentTasksCount = tasks.filter((t) => t.priority === 'urgente' && t.status !== 'done').length;
  const inProgressProjects = projects.filter((p) => p.status === 'in_progress').length;

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Visão Geral',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'projects' as ActiveTab,
      label: 'Projetos & Apps',
      icon: Layers,
      badge: inProgressProjects ? `${inProgressProjects} ativos` : null
    },
    {
      id: 'tasks' as ActiveTab,
      label: 'Kanban & Gantt GK',
      icon: CheckSquare,
      badge: urgentTasksCount ? `${urgentTasksCount} urg.` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    {
      id: 'calendar' as ActiveTab,
      label: 'Calendário & Alarmes',
      icon: Calendar,
      badge: activeAlarms.length > 0 ? 'Alarme ativo' : null,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    },
    {
      id: 'chat' as ActiveTab,
      label: 'Chat da Equipe',
      icon: MessageSquare,
      badge: 'Online'
    },
    {
      id: 'contacts' as ActiveTab,
      label: 'Contatos & CRM',
      icon: Users,
      badge: `${contacts.length} parceiros`
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'Estatísticas & Conversão',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'logos' as ActiveTab,
      label: 'Galeria de Logotipos',
      icon: Image,
      badge: 'Download'
    },
    {
      id: 'documents' as ActiveTab,
      label: 'Documentos Digitais',
      icon: FileText,
      badge: 'Offline'
    },
    {
      id: 'backup' as ActiveTab,
      label: 'Backup & Segurança 2FA',
      icon: Cloud,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/70 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed lg:static top-16 bottom-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 flex flex-col gap-1 overflow-y-auto">
          <div className="px-2 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Módulos Corporativos GK
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Info inside Sidebar */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex flex-col gap-2.5">
          {/* Firestore Rules Quick Action */}
          <button
            onClick={() => setFirestoreRulesModalOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-xs text-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-[11px]">Regras Firestore</span>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">Copiar</span>
          </button>

          {/* Clean Cache and Reset */}
          <button
            onClick={() => {
              if (window.confirm('Deseja limpar todo o cache local e restaurar a base limpa de trabalho?')) {
                clearCacheAndReset();
              }
            }}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 rounded-xl text-xs text-slate-400 hover:text-rose-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px]">Limpar Cache & Reset</span>
            </div>
            <span className="text-[9px] text-slate-500">Local</span>
          </button>

          {/* App Version & Status */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-bold text-slate-300 text-[11px]">Startup GK TI</span>
              <span className="text-[10px] font-mono text-cyan-400">v2.5 Prod</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-snug">
              Firestore: {firebaseProjectId}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
