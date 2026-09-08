import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Plus,
  Bell,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  Building,
  CheckCircle2,
  MessageCircle,
  Trash2
} from 'lucide-react';
import { MeetingEvent } from '../../types';
import { generateIcsCalendar, triggerFileDownload, createGoogleCalendarUrl } from '../../utils/helpers';

export const CalendarView: React.FC = () => {
  const { meetings, setIsMeetingModalOpen, activeAlarms, triggerTestAlarm, deleteMeeting } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [activeView, setActiveView] = useState<'month' | 'agenda'>('month');

  // Days in month calculation
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handleExportIcs = () => {
    const icsContent = generateIcsCalendar(meetings);
    triggerFileDownload(icsContent, 'StartupGK_Agenda_Reunioes.ics', 'text/calendar;charset=utf-8');
  };

  const selectedDateMeetings = meetings.filter((m) => m.date === selectedDate);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-black text-white tracking-tight">
              Calendário Interativo & Sincronização Externa
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Agendamento em tempo real com alarmes sonoros e exportação para Google Calendar, Apple e Outlook.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportIcs}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs font-semibold transition-colors"
            title="Sincronizar com Apple Calendar, Outlook e Google Calendar (.ics)"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sincronizar (.ics)</span>
          </button>

          <button
            onClick={triggerTestAlarm}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl border border-cyan-500/30 text-xs font-semibold transition-colors"
            title="Testar alarme sonoro e visual"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Testar Alarme</span>
          </button>

          <button
            onClick={() => setIsMeetingModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" /> Agendar Reunião
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar left, Day Agenda right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Calendar Grid */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
          {/* Calendar Header with month navigator */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-white">
                {monthNames[month]} de {year}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                {meetings.length} agendamentos totais
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const now = new Date();
                  setCurrentMonthDate(now);
                  setSelectedDate(now.toISOString().slice(0, 10));
                }}
                className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                Hoje
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-500 uppercase">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty days before month start */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 sm:h-24 bg-slate-950/20 rounded-xl p-1 opacity-20" />
            ))}

            {/* Days of month */}
            {Array.from({ length: totalDays }).map((_, i) => {
              const dayNum = i + 1;
              const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayMeetings = meetings.filter((m) => m.date === dayStr);
              const isSelected = selectedDate === dayStr;
              const isToday = new Date().toISOString().slice(0, 10) === dayStr;

              return (
                <button
                  type="button"
                  key={`day-${dayNum}`}
                  onClick={() => setSelectedDate(dayStr)}
                  className={`h-20 sm:h-24 p-1.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                      : isToday
                      ? 'bg-slate-950 border-cyan-500/40 text-white'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                        isToday ? 'bg-cyan-500 text-slate-950 font-black' : isSelected ? 'text-cyan-400' : 'text-slate-400'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayMeetings.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>

                  <div className="flex flex-col gap-1 overflow-hidden">
                    {dayMeetings.slice(0, 2).map((m) => (
                      <div
                        key={m.id}
                        className="text-[9px] font-semibold truncate px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                        title={m.title}
                      >
                        {m.startTime} {m.title}
                      </div>
                    ))}
                    {dayMeetings.length > 2 && (
                      <span className="text-[8px] text-slate-500 font-bold">
                        +{dayMeetings.length - 2} mais
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Selected Date Events & Live Alarms */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Pauta do Dia Selecionado
              </span>
              <h3 className="font-bold text-white text-sm">
                {selectedDate}
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold">
              {selectedDateMeetings.length} reuniões
            </span>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px]">
            {selectedDateMeetings.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 flex flex-col items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-slate-600" />
                <p>Nenhuma reunião agendada para {selectedDate}.</p>
                <button
                  onClick={() => setIsMeetingModalOpen(true)}
                  className="mt-2 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold rounded-lg text-xs border border-cyan-500/30 transition-colors"
                >
                  + Agendar neste dia
                </button>
              </div>
            ) : (
              selectedDateMeetings.map((meet) => {
                const gCalUrl = createGoogleCalendarUrl(meet);
                return (
                  <div
                    key={meet.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-2.5 hover:border-slate-700 transition-colors shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                        {meet.startTime} às {meet.endTime}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Bell className="w-3 h-3 text-cyan-400" /> Alarme {meet.reminderMinutesBefore}m
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-100 text-sm">{meet.title}</h4>

                    {meet.clientOrPartner && (
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        Cliente: <strong className="text-slate-300">{meet.clientOrPartner}</strong>
                      </p>
                    )}

                    {meet.notes && (
                      <p className="text-xs text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                        {meet.notes}
                      </p>
                    )}

                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{meet.participants.join(', ')}</span>
                    </div>

                    {/* Action Links: WhatsApp, Google Meet, Google Calendar and Delete */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900">
                      <div className="flex items-center gap-2">
                        {meet.platform === 'whatsapp' || meet.whatsappCallLink ? (
                          <a
                            href={
                              meet.whatsappCallLink ||
                              (meet.whatsappNumber
                                ? `https://wa.me/${meet.whatsappNumber.replace(/[^\d+]/g, '')}`
                                : '#')
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm shadow-emerald-500/20"
                            title="Abrir chamada / conversa de vídeo direta no WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Entrar no WhatsApp
                          </a>
                        ) : meet.meetLink ? (
                          <a
                            href={meet.meetLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm shadow-cyan-500/20"
                          >
                            <Video className="w-3.5 h-3.5" /> Entrar no Meet
                          </a>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-1.5 ml-auto">
                        <a
                          href={gCalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
                          title="Adicionar ao Google Calendar pessoal"
                        >
                          <ExternalLink className="w-3 h-3 text-cyan-400" /> Google Calendar
                        </a>

                        <button
                          type="button"
                          onClick={() => deleteMeeting(meet.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Cancelar / Excluir reunião"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
