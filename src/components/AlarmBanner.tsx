import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Clock, ExternalLink, X, Volume2 } from 'lucide-react';

export const AlarmBanner: React.FC = () => {
  const { activeAlarms, dismissAlarm, snoozeAlarm } = useApp();

  if (activeAlarms.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-auto animate-in slide-in-from-bottom-5">
      {activeAlarms.map((alarm) => (
        <div
          key={alarm.id}
          className="bg-slate-900 border-2 border-cyan-500/80 shadow-2xl shadow-cyan-500/20 rounded-xl p-4 text-slate-100 flex flex-col gap-3 backdrop-blur-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 animate-pulse">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" /> Alarme em Tempo Real
                </span>
                <h4 className="font-semibold text-slate-100 text-sm mt-0.5 leading-snug">
                  {alarm.title}
                </h4>
              </div>
            </div>
            <button
              onClick={() => dismissAlarm(alarm.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
              title="Fechar alarme"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 px-2.5 py-1.5 rounded-md border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Horário: <strong className="text-white">{alarm.eventTime}</strong></span>
          </div>

          {alarm.participants && alarm.participants.length > 0 && (
            <p className="text-xs text-slate-400 line-clamp-1">
              Participantes: {alarm.participants.join(', ')}
            </p>
          )}

          <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
            {alarm.meetLink && (
              <a
                href={alarm.meetLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Entrar na Reunião
              </a>
            )}
            <button
              onClick={() => snoozeAlarm(alarm.id, 5)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg transition-colors"
            >
              Adiar 5 min
            </button>
            <button
              onClick={() => dismissAlarm(alarm.id)}
              className="px-3 py-1.5 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs rounded-lg transition-colors"
            >
              Dispensar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
