import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Plus,
  ExternalLink,
  Github,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Circle,
  Filter,
  X,
  Clock,
  Sparkles
} from 'lucide-react';
import { Project, ProjectType, ProjectStatus } from '../../types';

export const ProjectsView: React.FC = () => {
  const { projects, addProject, updateProject } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // New project state
  const [name, setName] = useState('');
  const [type, setType] = useState<ProjectType>('web_app');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('2026-10-30');
  const [budget, setBudget] = useState(25000);
  const [liveUrl, setLiveUrl] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [priority, setPriority] = useState<'baixa' | 'media' | 'alta' | 'urgente'>('alta');

  const filteredProjects = projects.filter((p) => {
    if (filterType !== 'all' && p.type !== filterType) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !client.trim()) return;

    addProject({
      name,
      type,
      client,
      description,
      status: 'in_progress',
      progress: 10,
      deadline,
      startDate: new Date().toISOString().slice(0, 10),
      budget: Number(budget),
      team: ['Sérgio GK', 'Guilherme Dev'],
      liveUrl: liveUrl || undefined,
      repositoryUrl: repositoryUrl || undefined,
      priority,
      milestones: [
        { id: 'm-1', title: 'Levantamento de Requisitos e Arquitetura', completed: true, dueDate: deadline },
        { id: 'm-2', title: 'Desenvolvimento Frontend & Interface', completed: false, dueDate: deadline },
        { id: 'm-3', title: 'Testes de QA e Homologação Final', completed: false, dueDate: deadline }
      ]
    });

    setIsNewProjectModalOpen(false);
    setName('');
    setClient('');
    setDescription('');
  };

  const toggleMilestone = (project: Project, milestoneId: string) => {
    const updatedMilestones = project.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const newProgress = Math.round((completedCount / (updatedMilestones.length || 1)) * 100);

    updateProject(project.id, {
      milestones: updatedMilestones,
      progress: newProgress,
      status: newProgress === 100 ? 'completed' : 'in_progress'
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-black text-white tracking-tight">
              Gestão de Projetos & Softwares da GK
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Controle de progresso, marcos de entrega e código de Web Apps, Sites e Landing Pages.
          </p>
        </div>

        <button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" /> Novo Projeto GK
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-2.5 text-xs">
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-400">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-300">Tipo:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-transparent text-white focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900">Todos os Tipos</option>
            <option value="web_app" className="bg-slate-900">Web Apps & SaaS</option>
            <option value="landing_page" className="bg-slate-900">Páginas Publicitárias (Ads)</option>
            <option value="site" className="bg-slate-900">Sites Institucionais</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-400">
          <span className="font-semibold text-slate-300">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent text-white focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900">Todos os Status</option>
            <option value="in_progress" className="bg-slate-900">Em Desenvolvimento</option>
            <option value="review" className="bg-slate-900">Em Revisão / QA</option>
            <option value="planning" className="bg-slate-900">Planejamento</option>
            <option value="completed" className="bg-slate-900">Concluídos</option>
          </select>
        </div>

        <span className="text-slate-500 ml-auto">
          Exibindo {filteredProjects.length} de {projects.length} projetos
        </span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((proj) => {
          const typeBadge =
            proj.type === 'web_app'
              ? { label: 'Web App & SaaS', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' }
              : proj.type === 'landing_page'
              ? { label: 'Página Publicitária Ads', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
              : { label: 'Site Institucional', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };

          const statusBadge =
            proj.status === 'completed'
              ? { label: 'Concluído', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' }
              : proj.status === 'review'
              ? { label: 'Em Revisão / QA', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' }
              : proj.status === 'planning'
              ? { label: 'Planejamento', color: 'bg-slate-800 text-slate-300 border-slate-700' }
              : { label: 'Em Desenvolvimento', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };

          return (
            <div
              key={proj.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${typeBadge.color}`}>
                    {typeBadge.label}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadge.color}`}>
                    {statusBadge.label}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{proj.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{proj.description}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <strong className="text-slate-200">R$ {proj.budget.toLocaleString('pt-BR')}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    Prazo: <strong className="text-slate-200">{proj.deadline}</strong>
                  </span>
                  <span className="text-slate-400">
                    Cliente: <strong className="text-slate-200">{proj.client}</strong>
                  </span>
                </div>
              </div>

              {/* Progress & Milestones */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Progresso de Desenvolvimento</span>
                  <span className="font-mono font-bold text-cyan-400">{proj.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>

                {/* Milestone Checklist */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Marcos & Entregáveis (Clique para alternar):
                  </span>
                  {proj.milestones.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => toggleMilestone(proj, m.id)}
                      className="flex items-center gap-2 text-left text-xs text-slate-300 hover:text-white transition-colors"
                    >
                      {m.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      )}
                      <span className={m.completed ? 'line-through text-slate-400' : ''}>{m.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Team & Links */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{proj.team.join(', ')}</span>
                </div>

                <div className="flex items-center gap-2">
                  {proj.repositoryUrl && (
                    <a
                      href={proj.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                      title="Repositório Git Privado"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold rounded-lg border border-cyan-500/30 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> Preview
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Criar Novo Projeto */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Cadastrar Novo Projeto na Startup GK
              </h3>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nome do Projeto *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Web App Clínica MedTech ou Landing Page Ads"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tipo de Solução</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ProjectType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="web_app">Web App / Portal SaaS</option>
                    <option value="landing_page">Página Publicitária (Landing Ads)</option>
                    <option value="site">Site Institucional Moderno</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Cliente / Empresa *</label>
                  <input
                    type="text"
                    required
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Ex: Grupo MedHealth"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Descrição do Escopo</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Objetivos técnicos, público-alvo e requisitos..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Valor do Contrato (R$)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Prazo de Entrega</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">URL de Demonstração / Preview</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://preview.startupgk.com/..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Repositório Git Privado</label>
                  <input
                    type="url"
                    value={repositoryUrl}
                    onChange={(e) => setRepositoryUrl(e.target.value)}
                    placeholder="https://github.com/startupgk/..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-md shadow-cyan-500/20"
                >
                  Criar Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
