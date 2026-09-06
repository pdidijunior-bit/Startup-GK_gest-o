import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  CheckCircle2,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Layers,
  CheckSquare
} from 'lucide-react';
import { generatePdfReport } from '../../utils/helpers';

export const AnalyticsView: React.FC = () => {
  const { projects, tasks, contacts, currentUser } = useApp();

  const handleExportPdf = () => {
    generatePdfReport(projects, tasks, contacts, currentUser?.name || 'Equipe GK');
  };

  const totalContractPipeline = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalCRMValue = contacts.reduce((acc, c) => acc + (c.estimatedValue || 0), 0);
  const totalCompletedProjects = projects.filter((p) => p.status === 'completed').length;
  const inProgressProjects = projects.filter((p) => p.status === 'in_progress').length;
  const averageTicket = projects.length > 0 ? Math.round(totalContractPipeline / projects.length) : 0;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Breakdown by solution type
  const webApps = projects.filter((p) => p.type === 'web_app');
  const landingPages = projects.filter((p) => p.type === 'landing_page');
  const sites = projects.filter((p) => p.type === 'site');

  const webAppVal = webApps.reduce((acc, p) => acc + (p.budget || 0), 0);
  const landingVal = landingPages.reduce((acc, p) => acc + (p.budget || 0), 0);
  const siteVal = sites.reduce((acc, p) => acc + (p.budget || 0), 0);

  const getPercent = (val: number) => {
    if (totalContractPipeline === 0) return 0;
    return Math.round((val / totalContractPipeline) * 100);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-black text-white tracking-tight">
              Estatísticas & Métricas Reais da Startup GK
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Painel analítico gerado dinamicamente a partir dos projetos, contratos e tarefas cadastradas na plataforma.
          </p>
        </div>

        <button
          onClick={handleExportPdf}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20"
        >
          <Download className="w-4 h-4" /> Exportar Relatório em PDF
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400">Faturamento em Contratos</span>
          <h3 className="text-2xl font-black text-white mt-1">
            R$ {totalContractPipeline.toLocaleString('pt-BR')}
          </h3>
          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> {projects.length} projetos cadastrados
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400">Pipeline Comercial (CRM)</span>
          <h3 className="text-2xl font-black text-cyan-400 mt-1">
            R$ {totalCRMValue.toLocaleString('pt-BR')}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5">
            {contacts.length} parceiros & clientes em negociação
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400">Ticket Médio por Projeto</span>
          <h3 className="text-2xl font-black text-purple-400 mt-1">
            R$ {averageTicket.toLocaleString('pt-BR')}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5">
            Média de receita por entrega contratada
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400">Eficiência de Tarefas</span>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">
            {taskCompletionRate}%
          </h3>
          <p className="text-xs text-slate-400 mt-1.5">
            {completedTasks} de {totalTasks} tarefas concluídas
          </p>
        </div>
      </div>

      {/* Main Analysis Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status dos Projetos */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-sm">Status dos Projetos Cadastrados</h3>
              <p className="text-[11px] text-slate-400">Distribuição por etapa de desenvolvimento</p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {projects.length} Total
            </span>
          </div>

          <div className="flex flex-col gap-3 py-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Em Desenvolvimento Ativo</span>
                <span className="font-bold text-cyan-400">{inProgressProjects}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all"
                  style={{ width: `${projects.length > 0 ? (inProgressProjects / projects.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Em Revisão / Homologação QA</span>
                <span className="font-bold text-amber-400">
                  {projects.filter((p) => p.status === 'review').length}
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${projects.length > 0 ? (projects.filter((p) => p.status === 'review').length / projects.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Entregues / Concluídos com Sucesso</span>
                <span className="font-bold text-emerald-400">{totalCompletedProjects}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${projects.length > 0 ? (totalCompletedProjects / projects.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Distribuição por Soluções de TI */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-sm">Distribuição por Categoria de Solução</h3>
              <p className="text-[11px] text-slate-400">Web Apps, Landing Pages Ads e Sites Institucionais</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Rentabilidade GK
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-cyan-400">Web Apps & SaaS</span>
              <div className="text-base font-extrabold text-white">
                {webApps.length} projetos
              </div>
              <span className="text-xs font-mono text-slate-400">
                R$ {webAppVal.toLocaleString('pt-BR')} ({getPercent(webAppVal)}%)
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-purple-400">Landing Pages Ads</span>
              <div className="text-base font-extrabold text-white">
                {landingPages.length} projetos
              </div>
              <span className="text-xs font-mono text-slate-400">
                R$ {landingVal.toLocaleString('pt-BR')} ({getPercent(landingVal)}%)
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-blue-400">Sites Corporativos</span>
              <div className="text-base font-extrabold text-white">
                {sites.length} projetos
              </div>
              <span className="text-xs font-mono text-slate-400">
                R$ {siteVal.toLocaleString('pt-BR')} ({getPercent(siteVal)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
