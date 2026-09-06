import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Plus,
  Filter,
  Clock,
  User,
  AlertTriangle,
  Layers,
  Kanban,
  List,
  CheckCircle,
  Tag,
  X,
  Sparkles,
  Calendar,
  GanttChartSquare,
  Check,
  Trash2,
  ChevronDown,
  ChevronUp,
  Flame,
  FileText
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus, TaskChecklistItem } from '../../types';
import { GanttChartView } from './GanttChartView';

export const TasksView: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTaskStatus,
    toggleTaskChecklistItem,
    addTaskChecklistItem,
    removeTaskChecklistItem,
    projects,
    users,
    firebaseConnected
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'gantt' | 'list'>('kanban');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  // Drag-and-drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  // Modals state
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);
  const [newChecklistText, setNewChecklistText] = useState<string>('');

  // New task form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('alta');
  const [assignedTo, setAssignedTo] = useState(users[0]?.name || 'Guilherme Dev');
  const [startDate, setStartDate] = useState('2026-09-06');
  const [dueDate, setDueDate] = useState('2026-09-15');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [estimatedHours, setEstimatedHours] = useState(6);
  const [tagsInput, setTagsInput] = useState('Frontend, React 19');
  const [formChecklist, setFormChecklist] = useState<{ id: string; title: string; completed: boolean }[]>([
    { id: '1', title: 'Definir escopo técnico e dependências', completed: false },
    { id: '2', title: 'Homologação e testes com a equipe', completed: false }
  ]);
  const [newFormChecklistItem, setNewFormChecklistItem] = useState('');

  const filteredTasks = tasks.filter((t) => {
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (assigneeFilter !== 'all' && t.assignedTo !== assigneeFilter) return false;
    if (projectFilter !== 'all' && t.projectId !== projectFilter) return false;
    return true;
  });

  const handleAddFormChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormChecklistItem.trim()) return;
    setFormChecklist((prev) => [
      ...prev,
      { id: `chk-${Date.now()}`, title: newFormChecklistItem.trim(), completed: false }
    ]);
    setNewFormChecklistItem('');
  };

  const handleRemoveFormChecklistItem = (id: string) => {
    setFormChecklist((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const proj = projects.find((p) => p.id === projectId);
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const completedChecklist = formChecklist.filter((c) => c.completed).length;
    const progress = formChecklist.length > 0 ? Math.round((completedChecklist / formChecklist.length) * 100) : 0;

    addTask({
      title,
      description,
      priority,
      status: 'todo',
      assignedTo,
      startDate,
      dueDate,
      projectId: projectId || 'proj-1',
      projectName: proj?.name || 'Geral Startup GK',
      estimatedHours: Number(estimatedHours) || 4,
      tags: tags.length > 0 ? tags : ['Desenvolvimento', 'GK'],
      checklist: formChecklist,
      progress
    });

    setIsNewTaskModalOpen(false);
    setTitle('');
    setDescription('');
    setFormChecklist([
      { id: '1', title: 'Definir escopo técnico e dependências', completed: false },
      { id: '2', title: 'Homologação e testes com a equipe', completed: false }
    ]);
  };

  const columns: { id: TaskStatus; label: string; count: number; color: string; border: string }[] = [
    {
      id: 'backlog',
      label: 'Backlog GK',
      count: filteredTasks.filter((t) => t.status === 'backlog').length,
      color: 'text-slate-400',
      border: 'border-slate-800'
    },
    {
      id: 'todo',
      label: 'A Fazer',
      count: filteredTasks.filter((t) => t.status === 'todo').length,
      color: 'text-blue-400',
      border: 'border-blue-500/40'
    },
    {
      id: 'in_progress',
      label: 'Em Progresso',
      count: filteredTasks.filter((t) => t.status === 'in_progress').length,
      color: 'text-cyan-400',
      border: 'border-cyan-500/40'
    },
    {
      id: 'review',
      label: 'Revisão / QA',
      count: filteredTasks.filter((t) => t.status === 'review').length,
      color: 'text-amber-400',
      border: 'border-amber-500/40'
    },
    {
      id: 'done',
      label: 'Concluídas',
      count: filteredTasks.filter((t) => t.status === 'done').length,
      color: 'text-emerald-400',
      border: 'border-emerald-500/40'
    }
  ];

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'urgente':
        return {
          label: 'Urgente',
          class: 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
        };
      case 'alta':
        return {
          label: 'Alta',
          class: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
        };
      case 'media':
        return {
          label: 'Média',
          class: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
        };
      case 'baixa':
        return {
          label: 'Baixa',
          class: 'bg-slate-800 text-slate-400 border-slate-700'
        };
    }
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget === e.target) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      moveTaskStatus(taskId, columnId);
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-black text-white tracking-tight">
              Gestão Visual de Projetos & Sprints GK
            </h1>
            {firebaseConnected && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Firestore Realtime
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quadro Kanban com Drag-and-Drop, Cronograma Gantt de prazos e checklists detalhados sincronizados.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Toggle: Kanban, Gantt, List */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 font-bold ${
                viewMode === 'kanban' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Quadro Kanban com Drag & Drop"
            >
              <Kanban className="w-4 h-4" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('gantt')}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 font-bold ${
                viewMode === 'gantt' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Cronograma Gantt de Prazos"
            >
              <GanttChartSquare className="w-4 h-4" />
              <span>Gantt</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 font-bold ${
                viewMode === 'list' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Tabela Completa de Tarefas"
            >
              <List className="w-4 h-4" />
              <span>Lista</span>
            </button>
          </div>

          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" /> Nova Tarefa
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 text-xs">
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-400">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-300">Prioridade:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-transparent text-white focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900">Todas as Prioridades</option>
            <option value="urgente" className="bg-slate-900">🚨 Urgente</option>
            <option value="alta" className="bg-slate-900">⚡ Alta</option>
            <option value="media" className="bg-slate-900">🔷 Média</option>
            <option value="baixa" className="bg-slate-900">⚪ Baixa</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-400">
          <User className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-300">Membro:</span>
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="bg-transparent text-white focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900">Toda a Equipe</option>
            {users.map((u) => (
              <option key={u.id} value={u.name} className="bg-slate-900">
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-400">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-300">Projeto:</span>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="bg-transparent text-white focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900">Todos os Projetos ({projects.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-slate-500 ml-auto flex items-center gap-2">
          <span>{filteredTasks.length} tarefas</span>
          {viewMode === 'kanban' && (
            <span className="hidden sm:inline text-[11px] text-cyan-400 font-medium">
              💡 Dica: Arraste e solte os cards entre as colunas!
            </span>
          )}
        </div>
      </div>

      {/* GANTT VIEW */}
      {viewMode === 'gantt' && (
        <GanttChartView onOpenTaskModal={(task) => setSelectedTaskForDetail(task)} />
      )}

      {/* KANBAN BOARD VIEW WITH DRAG & DROP */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            const isTargetOver = dragOverColumn === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`rounded-2xl p-3.5 flex flex-col gap-3 min-w-[250px] transition-all ${
                  isTargetOver
                    ? 'bg-cyan-950/30 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900/90 border border-slate-800'
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.border.replace('border-', 'bg-')}`} />
                    <h3 className="font-bold text-slate-200 text-xs">{col.label}</h3>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {colTasks.length}
                  </span>
                </div>

                {/* Drop indicator prompt when hovering */}
                {isTargetOver && (
                  <div className="py-2 text-center text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-400/40 rounded-xl animate-pulse">
                    Soltar para mover para {col.label}
                  </div>
                )}

                {/* Column Cards */}
                <div className="flex flex-col gap-2.5 min-h-[160px]">
                  {colTasks.length === 0 ? (
                    <div className="p-6 border border-dashed border-slate-800 rounded-xl text-center text-slate-600 text-xs flex flex-col items-center justify-center gap-1">
                      <span>Nenhuma tarefa aqui</span>
                      <span className="text-[10px] text-slate-600">Arraste um card para cá</span>
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const priorityBadge = getPriorityBadge(task.priority);
                      const isDraggingThis = draggedTaskId === task.id;
                      const checklistTotal = task.checklist?.length || 0;
                      const checklistDone = task.checklist?.filter((c) => c.completed).length || 0;
                      const pct = checklistTotal > 0 ? Math.round((checklistDone / checklistTotal) * 100) : (task.progress || 0);

                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onClick={() => setSelectedTaskForDetail(task)}
                          className={`bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-3 flex flex-col gap-2.5 transition-all shadow-sm group cursor-grab active:cursor-grabbing ${
                            isDraggingThis ? 'opacity-40 scale-95 border-cyan-400' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-md border ${priorityBadge.class}`}
                            >
                              {priorityBadge.label}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {task.estimatedHours}h est.
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-100 text-xs leading-snug group-hover:text-cyan-400 transition-colors">
                            {task.title}
                          </h4>

                          <p className="text-[11px] text-slate-400 line-clamp-2">
                            {task.description}
                          </p>

                          {/* Interactive Checklist Progress Bar */}
                          {checklistTotal > 0 && (
                            <div className="flex flex-col gap-1 pt-1">
                              <div className="flex items-center justify-between text-[10px] text-slate-400">
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3 text-cyan-400" />
                                  Checklist ({checklistDone}/{checklistTotal})
                                </span>
                                <span className="font-mono text-cyan-400 font-semibold">{pct}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-cyan-500 rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Tags */}
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {task.tags.map((tg, i) => (
                                <span
                                  key={i}
                                  className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                                >
                                  #{tg}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                            <span className="text-cyan-400 font-medium truncate max-w-[110px]">
                              {task.assignedTo}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                              <Calendar className="w-3 h-3 text-slate-600" />
                              {task.dueDate.slice(5)}
                            </div>
                          </div>

                          {/* Quick Status Shift Select */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="pt-1"
                          >
                            <select
                              value={task.status}
                              onChange={(e) => moveTaskStatus(task.id, e.target.value as TaskStatus)}
                              className="w-full text-[10px] bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                            >
                              <option value="backlog">Backlog</option>
                              <option value="todo">A Fazer</option>
                              <option value="in_progress">Em Progresso</option>
                              <option value="review">Revisão QA</option>
                              <option value="done">Concluída</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Prioridade</th>
                  <th className="py-3 px-4">Título da Tarefa</th>
                  <th className="py-3 px-4">Projeto</th>
                  <th className="py-3 px-4">Responsável</th>
                  <th className="py-3 px-4">Início</th>
                  <th className="py-3 px-4">Prazo</th>
                  <th className="py-3 px-4">Progresso</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredTasks.map((t) => {
                  const pBadge = getPriorityBadge(t.priority);
                  const chkTotal = t.checklist?.length || 0;
                  const chkDone = t.checklist?.filter((i) => i.completed).length || 0;
                  const pct = chkTotal > 0 ? Math.round((chkDone / chkTotal) * 100) : (t.progress || 0);

                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTaskForDetail(t)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md border ${pBadge.class}`}>
                          {pBadge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">
                        <div className="group-hover:text-cyan-400 transition-colors">{t.title}</div>
                        <span className="text-[11px] text-slate-400 font-normal line-clamp-1">{t.description}</span>
                      </td>
                      <td className="py-3 px-4 text-cyan-400 font-medium">{t.projectName}</td>
                      <td className="py-3 px-4 text-slate-200">{t.assignedTo}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{t.startDate || t.createdAt}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{t.dueDate}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{pct}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={t.status}
                          onChange={(e) => moveTaskStatus(t.id, e.target.value as TaskStatus)}
                          className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                        >
                          <option value="backlog">Backlog</option>
                          <option value="todo">A Fazer</option>
                          <option value="in_progress">Em Progresso</option>
                          <option value="review">Revisão QA</option>
                          <option value="done">Concluída</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => deleteTask(t.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Excluir Tarefa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: NOVA TAREFA COM CHECKLIST COMPLETO */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Criar Tarefa para a Equipe GK
              </h3>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Título da Tarefa *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Integrar autenticação e Firestore rules no app GK"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Descrição e Critérios de Aceite</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Instruções claras para o desenvolvedor ou designer..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Prioridade</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="urgente">🚨 Urgente (Crítico)</option>
                    <option value="alta">⚡ Alta Prioridade</option>
                    <option value="media">🔷 Média Prioridade</option>
                    <option value="baixa">⚪ Baixa Prioridade</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Responsável</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Projeto Relacionado</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Esforço Estimado (Horas)</label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Data de Início (Gantt)</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Prazo Final (Due Date) *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Ex: Firebase, React 19, UI/UX, TypeScript"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Checklist Builder */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                <label className="block font-semibold text-slate-200">
                  Subtarefas e Checklist de Conclusão ({formChecklist.length})
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFormChecklistItem}
                    onChange={(e) => setNewFormChecklistItem(e.target.value)}
                    placeholder="Adicionar critério ou subtarefa..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newFormChecklistItem.trim()) {
                          setFormChecklist((prev) => [
                            ...prev,
                            { id: `c-${Date.now()}`, title: newFormChecklistItem.trim(), completed: false }
                          ]);
                          setNewFormChecklistItem('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      if (newFormChecklistItem.trim()) {
                        setFormChecklist((prev) => [
                          ...prev,
                          { id: `c-${Date.now()}`, title: newFormChecklistItem.trim(), completed: false }
                        ]);
                        setNewFormChecklistItem('');
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold rounded-lg"
                  >
                    Adicionar
                  </button>
                </div>

                <div className="flex flex-col gap-1.5 mt-1 max-h-36 overflow-y-auto">
                  {formChecklist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800"
                    >
                      <span className="text-slate-300 truncate">{item.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFormChecklistItem(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-md shadow-cyan-500/20"
                >
                  Criar e Sincronizar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL / DRAWER: DETALHES DA TAREFA & CHECKLIST INTERATIVO */}
      {selectedTaskForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md border ${
                      getPriorityBadge(selectedTaskForDetail.priority).class
                    }`}
                  >
                    {getPriorityBadge(selectedTaskForDetail.priority).label}
                  </span>
                  <span className="text-xs text-cyan-400 font-semibold">
                    {selectedTaskForDetail.projectName}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {selectedTaskForDetail.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedTaskForDetail(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Descrição Técnica
              </label>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {selectedTaskForDetail.description || 'Sem descrição cadastrada.'}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">Responsável:</span>
                <span className="font-semibold text-white">{selectedTaskForDetail.assignedTo}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Status:</span>
                <select
                  value={selectedTaskForDetail.status}
                  onChange={(e) => {
                    const nextStatus = e.target.value as TaskStatus;
                    moveTaskStatus(selectedTaskForDetail.id, nextStatus);
                    setSelectedTaskForDetail((prev) => (prev ? { ...prev, status: nextStatus } : null));
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 mt-0.5"
                >
                  <option value="backlog">Backlog</option>
                  <option value="todo">A Fazer</option>
                  <option value="in_progress">Em Progresso</option>
                  <option value="review">Revisão QA</option>
                  <option value="done">Concluída</option>
                </select>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Início:</span>
                <span className="font-mono text-slate-300">{selectedTaskForDetail.startDate || selectedTaskForDetail.createdAt}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Prazo Final:</span>
                <span className="font-mono text-slate-300">{selectedTaskForDetail.dueDate}</span>
              </div>
            </div>

            {/* Interactive Checklist */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  Checklist de Subtarefas & Critérios
                </h4>
                {selectedTaskForDetail.checklist && selectedTaskForDetail.checklist.length > 0 && (
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">
                    {selectedTaskForDetail.checklist.filter((i) => i.completed).length}/
                    {selectedTaskForDetail.checklist.length} (
                    {Math.round(
                      (selectedTaskForDetail.checklist.filter((i) => i.completed).length /
                        selectedTaskForDetail.checklist.length) *
                        100
                    )}
                    %)
                  </span>
                )}
              </div>

              {/* Progress bar */}
              {selectedTaskForDetail.checklist && selectedTaskForDetail.checklist.length > 0 && (
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all"
                    style={{
                      width: `${
                        (selectedTaskForDetail.checklist.filter((i) => i.completed).length /
                          selectedTaskForDetail.checklist.length) *
                        100
                      }%`
                    }}
                  />
                </div>
              )}

              {/* Items List */}
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                {(!selectedTaskForDetail.checklist || selectedTaskForDetail.checklist.length === 0) ? (
                  <div className="text-[11px] text-slate-500 italic py-2">
                    Nenhum item no checklist. Adicione um abaixo.
                  </div>
                ) : (
                  selectedTaskForDetail.checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        toggleTaskChecklistItem(selectedTaskForDetail.id, item.id);
                        setSelectedTaskForDetail((prev) => {
                          if (!prev || !prev.checklist) return prev;
                          const nextList = prev.checklist.map((i) =>
                            i.id === item.id ? { ...i, completed: !i.completed } : i
                          );
                          return { ...prev, checklist: nextList };
                        });
                      }}
                      className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            item.completed
                              ? 'bg-cyan-500 border-cyan-500 text-slate-950'
                              : 'border-slate-600 bg-slate-950'
                          }`}
                        >
                          {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span
                          className={`text-xs ${
                            item.completed ? 'line-through text-slate-500' : 'text-slate-200'
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTaskChecklistItem(selectedTaskForDetail.id, item.id);
                          setSelectedTaskForDetail((prev) => {
                            if (!prev || !prev.checklist) return prev;
                            return { ...prev, checklist: prev.checklist.filter((i) => i.id !== item.id) };
                          });
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Remover item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add checklist item */}
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  placeholder="Novo critério ou subtarefa..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newChecklistText.trim()) {
                        addTaskChecklistItem(selectedTaskForDetail.id, newChecklistText);
                        setSelectedTaskForDetail((prev) => {
                          if (!prev) return prev;
                          const current = prev.checklist || [];
                          return {
                            ...prev,
                            checklist: [...current, { id: `c-${Date.now()}`, title: newChecklistText.trim(), completed: false }]
                          };
                        });
                        setNewChecklistText('');
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newChecklistText.trim()) {
                      addTaskChecklistItem(selectedTaskForDetail.id, newChecklistText);
                      setSelectedTaskForDetail((prev) => {
                        if (!prev) return prev;
                        const current = prev.checklist || [];
                        return {
                          ...prev,
                          checklist: [...current, { id: `c-${Date.now()}`, title: newChecklistText.trim(), completed: false }]
                        };
                      });
                      setNewChecklistText('');
                    }
                  }}
                  className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm"
                >
                  Adicionar
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  deleteTask(selectedTaskForDetail.id);
                  setSelectedTaskForDetail(null);
                }}
                className="px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Excluir Tarefa
              </button>

              <button
                type="button"
                onClick={() => setSelectedTaskForDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
