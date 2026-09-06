import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  Layers,
  BarChart3
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../../types';

export const GanttChartView: React.FC<{ onOpenTaskModal?: (task: Task) => void }> = ({ onOpenTaskModal }) => {
  const { tasks, projects } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [timelineRangeDays, setTimelineRangeDays] = useState<number>(21); // 3 weeks view
  const [startDateOffset, setStartDateOffset] = useState<number>(0);

  // Reference base date (Today: 2026-09-06)
  const baseDate = useMemo(() => {
    const d = new Date(2026, 8, 6); // Month 8 is September
    d.setDate(d.getDate() + startDateOffset);
    return d;
  }, [startDateOffset]);

  // Generate array of days for timeline header
  const timelineDays = useMemo(() => {
    const days: { date: Date; dateStr: string; dayNum: number; dayOfWeek: string; isWeekend: boolean; isToday: boolean }[] = [];
    const todayStr = '2026-09-06';

    for (let i = -2; i < timelineRangeDays - 2; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      const dayOfWeek = d.toLocaleDateString('pt-BR', { weekday: 'narrow' }).toUpperCase();
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      days.push({
        date: d,
        dateStr: iso,
        dayNum: d.getDate(),
        dayOfWeek,
        isWeekend,
        isToday: iso === todayStr
      });
    }
    return days;
  }, [baseDate, timelineRangeDays]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (selectedProjectId !== 'all' && t.projectId !== selectedProjectId) return false;
      return true;
    });
  }, [tasks, selectedProjectId]);

  // Metrics
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress').length;
  const totalHours = filteredTasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'done':
        return {
          bar: 'bg-gradient-to-r from-emerald-600 to-emerald-500 border-emerald-400/50 text-white',
          glow: 'shadow-emerald-500/20'
        };
      case 'review':
        return {
          bar: 'bg-gradient-to-r from-amber-600 to-amber-500 border-amber-400/50 text-white',
          glow: 'shadow-amber-500/20'
        };
      case 'in_progress':
        return {
          bar: 'bg-gradient-to-r from-cyan-600 to-cyan-500 border-cyan-400/50 text-slate-950 font-bold',
          glow: 'shadow-cyan-500/30'
        };
      case 'todo':
        return {
          bar: 'bg-gradient-to-r from-blue-700 to-blue-600 border-blue-400/40 text-blue-100',
          glow: 'shadow-blue-500/20'
        };
      case 'backlog':
      default:
        return {
          bar: 'bg-gradient-to-r from-slate-700 to-slate-600 border-slate-500/40 text-slate-300',
          glow: 'shadow-slate-900'
        };
    }
  };

  const getPriorityDot = (p: TaskPriority) => {
    switch (p) {
      case 'urgente': return 'bg-rose-500 animate-pulse';
      case 'alta': return 'bg-amber-400';
      case 'media': return 'bg-cyan-400';
      case 'baixa': return 'bg-slate-400';
    }
  };

  // Calculate pixel position on Gantt grid
  const calculateBarCoordinates = (task: Task) => {
    if (!timelineDays.length) return null;
    const firstDayDate = timelineDays[0].date.getTime();
    const lastDayDate = timelineDays[timelineDays.length - 1].date.getTime() + 86400000;

    const taskStart = task.startDate ? new Date(task.startDate).getTime() : new Date(task.createdAt || '2026-09-01').getTime();
    const taskEnd = task.dueDate ? new Date(task.dueDate).getTime() + 86400000 : taskStart + 3 * 86400000;

    // Check if task is within visible window
    if (taskEnd < firstDayDate || taskStart > lastDayDate) {
      return null;
    }

    const totalWindowDuration = lastDayDate - firstDayDate;
    const clampedStart = Math.max(taskStart, firstDayDate);
    const clampedEnd = Math.min(taskEnd, lastDayDate);

    const leftPercent = ((clampedStart - firstDayDate) / totalWindowDuration) * 100;
    const widthPercent = Math.max(((clampedEnd - clampedStart) / totalWindowDuration) * 100, 3.5);

    return {
      left: `${Math.max(0, leftPercent)}%`,
      width: `${Math.min(100 - leftPercent, widthPercent)}%`
    };
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-150">
      {/* KPI Header Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-white">{totalTasks}</div>
            <div className="text-[11px] text-slate-400">Tarefas no Cronograma</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-cyan-400">{inProgressTasks}</div>
            <div className="text-[11px] text-slate-400">Em Execução</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-400">{completedTasks}</div>
            <div className="text-[11px] text-slate-400">Concluídas</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-white">{totalHours}h</div>
            <div className="text-[11px] text-slate-400">Esforço Total Estimado</div>
          </div>
        </div>
      </div>

      {/* Gantt Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 font-medium">Filtrar Projeto:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer font-semibold"
            >
              <option value="all" className="bg-slate-900">Todos os Projetos ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900">
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setStartDateOffset((prev) => prev - 7)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              title="Voltar 1 semana"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setStartDateOffset(0)}
              className="px-2.5 py-1 text-xs font-bold text-cyan-400 hover:bg-slate-800 rounded-lg"
            >
              Hoje
            </button>
            <button
              onClick={() => setStartDateOffset((prev) => prev + 7)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              title="Avançar 1 semana"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setTimelineRangeDays(14)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                timelineRangeDays === 14 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              14 Dias
            </button>
            <button
              onClick={() => setTimelineRangeDays(21)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                timelineRangeDays === 21 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              21 Dias
            </button>
            <button
              onClick={() => setTimelineRangeDays(30)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                timelineRangeDays === 30 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Dias
            </button>
          </div>
        </div>
      </div>

      {/* Main Gantt Canvas */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
        {/* Table & Timeline Header */}
        <div className="flex border-b border-slate-800 bg-slate-950/90 text-xs">
          {/* Left info column header */}
          <div className="w-72 sm:w-80 min-w-[280px] p-3.5 border-r border-slate-800 font-bold text-slate-400 flex items-center justify-between">
            <span>Tarefa & Responsável</span>
            <span className="text-[10px] text-slate-500">Prazo</span>
          </div>

          {/* Right Days Header */}
          <div className="flex-1 flex overflow-hidden">
            {timelineDays.map((day) => (
              <div
                key={day.dateStr}
                className={`flex-1 min-w-[32px] py-2 text-center border-r border-slate-800/60 flex flex-col items-center justify-center transition-colors ${
                  day.isToday ? 'bg-cyan-950/40 text-cyan-400 font-black' : day.isWeekend ? 'bg-slate-950/40 text-slate-500' : 'text-slate-400'
                }`}
              >
                <span className="text-[9px] font-mono leading-none">{day.dayOfWeek}</span>
                <span className={`text-[11px] font-mono leading-tight mt-0.5 ${day.isToday ? 'text-cyan-400 font-bold underline' : ''}`}>
                  {day.dayNum}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gantt Task Rows */}
        <div className="divide-y divide-slate-800/60 overflow-y-auto max-h-[600px]">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Nenhuma tarefa encontrada com os filtros selecionados.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const coords = calculateBarCoordinates(task);
              const colorTheme = getStatusColor(task.status);
              const checklistTotal = task.checklist?.length || 0;
              const checklistCompleted = task.checklist?.filter((i) => i.completed).length || 0;

              return (
                <div
                  key={task.id}
                  onClick={() => onOpenTaskModal && onOpenTaskModal(task)}
                  className="flex hover:bg-slate-800/30 transition-colors group cursor-pointer"
                >
                  {/* Left Column: Task meta info */}
                  <div className="w-72 sm:w-80 min-w-[280px] p-3 border-r border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${getPriorityDot(task.priority)}`} />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-400 transition-colors">
                          {task.title}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="text-cyan-400 font-medium truncate max-w-[100px]">{task.assignedTo}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 truncate max-w-[120px]">{task.projectName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-mono text-slate-400">
                        {task.dueDate.slice(5)}
                      </div>
                      {checklistTotal > 0 && (
                        <div className="text-[9px] text-slate-500">
                          {checklistCompleted}/{checklistTotal}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Timeline Grid & Bar */}
                  <div className="flex-1 relative flex items-center h-14 bg-slate-950/20">
                    {/* Background Day Columns for Grid Effect */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {timelineDays.map((day) => (
                        <div
                          key={`col-${day.dateStr}`}
                          className={`flex-1 border-r border-slate-800/30 ${
                            day.isToday ? 'bg-cyan-500/[0.04]' : day.isWeekend ? 'bg-slate-900/10' : ''
                          }`}
                        />
                      ))}
                    </div>

                    {/* Today Vertical Line Indicator */}
                    {timelineDays.some((d) => d.isToday) && (
                      <div
                        className="absolute top-0 bottom-0 w-px bg-cyan-400/80 shadow-[0_0_8px_rgba(6,182,212,0.8)] z-10 pointer-events-none"
                        style={{
                          left: `${
                            ((timelineDays.findIndex((d) => d.isToday) + 0.5) / timelineDays.length) * 100
                          }%`
                        }}
                      />
                    )}

                    {/* Horizontal Task Gantt Bar */}
                    {coords && (
                      <div
                        className="absolute h-8 rounded-xl border flex items-center px-2.5 shadow-md transition-all duration-200 z-1 hover:brightness-110 overflow-hidden"
                        style={{
                          left: coords.left,
                          width: coords.width
                        }}
                      >
                        {/* Progress Fill Layer */}
                        <div
                          className={`absolute inset-0 ${colorTheme.bar} opacity-90`}
                        />

                        {/* Internal progress bar indicator */}
                        {task.progress !== undefined && task.progress > 0 && (
                          <div
                            className="absolute top-0 bottom-0 left-0 bg-white/20"
                            style={{ width: `${task.progress}%` }}
                          />
                        )}

                        {/* Bar Label */}
                        <div className="relative z-10 flex items-center justify-between w-full text-[11px] truncate">
                          <span className="truncate font-semibold text-slate-100 drop-shadow-sm">
                            {task.title}
                          </span>
                          {task.progress !== undefined && (
                            <span className="text-[10px] font-mono ml-2 opacity-90 shrink-0">
                              {task.progress}%
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Legend */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-semibold text-slate-300">Legenda de Cores:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-gradient-to-r from-blue-700 to-blue-600 border border-blue-400" />
              <span>A Fazer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-gradient-to-r from-cyan-600 to-cyan-500 border border-cyan-400" />
              <span>Em Execução</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-gradient-to-r from-amber-600 to-amber-500 border border-amber-400" />
              <span>Revisão QA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-gradient-to-r from-emerald-600 to-emerald-500 border border-emerald-400" />
              <span>Concluída</span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Linha vertical ciano = Dia de Hoje
          </div>
        </div>
      </div>
    </div>
  );
};
