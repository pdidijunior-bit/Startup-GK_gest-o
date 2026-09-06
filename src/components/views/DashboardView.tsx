import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Layers,
  Users,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  Clock,
  Video,
  ShieldCheck,
  Plus,
  ExternalLink,
  ChevronRight,
  FileText
} from 'lucide-react';
import { ActiveTab } from '../Sidebar';

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const {
    projects,
    tasks,
    contacts,
    meetings,
    setIsMeetingModalOpen,
    currentUser,
    activeAlarms
  } = useApp();

  const totalContractPipeline = projects.reduce((acc, p) => acc + p.budget, 0);
  const inProgressProjects = projects.filter((p) => p.status === 'in_progress');
  const urgentTasks = tasks.filter((t) => t.priority === 'urgente' && t.status !== 'done');
  const activeContactsCount = contacts.length;

  // Today's meetings
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayMeetings = meetings.filter((m) => m.date === todayStr);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Hub Privado da Startup GK
              </span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Olá, {currentUser?.name || 'Membro GK'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Painel centralizado de desenvolvimento de aplicativos web, sites e páginas publicitárias de alta conversão.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsMeetingModalOpen(true)}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Reunião</span>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Ver Tarefas</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pipeline / Faturamento */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Contratos Ativos</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-white">
              R$ {totalContractPipeline.toLocaleString('pt-BR')}
            </h3>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <ArrowUpRight className="w-3 h-3" /> +24% em relação ao mês anterior
            </p>
          </div>
        </div>

        {/* Projetos em Andamento */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Projetos & Apps</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-white">
              {projects.length} Projetos
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {inProgressProjects.length} em desenvolvimento ativo
            </p>
          </div>
        </div>

        {/* Tarefas Urgentes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Tarefas Críticas</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-rose-400">
              {urgentTasks.length} Urgentes
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {tasks.filter((t) => t.status === 'done').length} concluídas nesta sprint
            </p>
          </div>
        </div>

        {/* Parceiros / CRM */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">CRM & Parceiros</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-white">
              {activeContactsCount} Contatos
            </h3>
            <p className="text-[11px] text-purple-400 mt-1">
              Com histórico e discador direto
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Projects in progress + Today's schedule with alarms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Projects Health & Delivery */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h2 className="font-bold text-slate-100 text-sm">Projetos em Andamento (Startup GK)</h2>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-3.5">
            {projects.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col items-center justify-center gap-2">
                <Layers className="w-8 h-8 text-slate-700 mb-1" />
                <span className="text-xs font-semibold text-slate-300">Nenhum projeto cadastrado</span>
                <span className="text-[11px] text-slate-500 max-w-xs">Cadastre o primeiro aplicativo web, site ou página publicitária da GK.</span>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="mt-2 px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Novo Projeto
                </button>
              </div>
            ) : (
              projects.slice(0, 3).map((proj) => (
                <div
                  key={proj.id}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition-all flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{proj.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                          {proj.type === 'web_app'
                            ? 'Web App'
                            : proj.type === 'landing_page'
                            ? 'Landing Page Ads'
                            : 'Site Institucional'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Cliente: <strong className="text-slate-300">{proj.client}</strong> • Prazo: {proj.deadline}
                      </p>
                    </div>
                    <span className="text-sm font-black text-cyan-400">{proj.progress}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Equipe: {proj.team.slice(0, 3).join(', ')}</span>
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-cyan-400 hover:underline text-[11px]"
                      >
                        <ExternalLink className="w-3 h-3" /> Preview Online
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Today's Interactive Meetings with Live Alarm status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h2 className="font-bold text-slate-100 text-sm">Agenda de Hoje & Alarmes</h2>
            </div>
            <button
              onClick={() => setActiveTab('calendar')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Abrir Agenda
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {todayMeetings.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/50 rounded-xl border border-slate-800/80">
                Nenhuma reunião agendada para hoje. Aproveite para focar no código!
              </div>
            ) : (
              todayMeetings.map((meet) => (
                <div
                  key={meet.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      {meet.startTime} - {meet.endTime}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Alarme: {meet.reminderMinutesBefore}m antes
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-200 text-xs leading-snug">
                    {meet.title}
                  </h4>

                  {meet.clientOrPartner && (
                    <p className="text-[11px] text-slate-400">
                      Empresa: <strong className="text-slate-300">{meet.clientOrPartner}</strong>
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                    <span className="text-[10px] text-slate-400">
                      {meet.participants.length} participantes
                    </span>
                    {meet.meetLink && (
                      <a
                        href={meet.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                      >
                        <Video className="w-3.5 h-3.5" /> Entrar Meet
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}

            <button
              onClick={() => setIsMeetingModalOpen(true)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 mt-1"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" /> Agendar Nova Reunião
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
