import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, Video, Users, Building, Bell } from 'lucide-react';
import { EventType } from '../types';

export const MeetingModal: React.FC = () => {
  const {
    isMeetingModalOpen,
    setIsMeetingModalOpen,
    selectedContactForMeeting,
    setSelectedContactForMeeting,
    addMeeting,
    currentUser,
    users
  } = useApp();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('reuniao_cliente');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('14:45');
  const [locationOrUrl, setLocationOrUrl] = useState('Google Meet - Sala GK Tech');
  const [meetLink, setMeetLink] = useState('https://meet.google.com/gk-online-meet');
  const [participants, setParticipants] = useState<string[]>(currentUser?.name ? [currentUser.name] : ['Equipe GK']);
  const [notes, setNotes] = useState('');
  const [reminderMinutes, setReminderMinutes] = useState(15);
  const [clientOrPartner, setClientOrPartner] = useState('');

  useEffect(() => {
    if (selectedContactForMeeting) {
      setTitle(`Reunião com ${selectedContactForMeeting.companyName}`);
      setType('reuniao_cliente');
      setClientOrPartner(selectedContactForMeeting.companyName);
      setNotes(`Reunião agendada via CRM da Startup GK para alinhamento com ${selectedContactForMeeting.contactPerson} (${selectedContactForMeeting.role}).`);
      const myName = currentUser?.name || 'Equipe GK';
      setParticipants([myName, selectedContactForMeeting.contactPerson]);
    }
  }, [selectedContactForMeeting, currentUser]);

  if (!isMeetingModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addMeeting({
      title,
      type,
      date,
      startTime,
      endTime,
      locationOrUrl,
      meetLink,
      participants,
      notes,
      reminderMinutesBefore: reminderMinutes,
      clientOrPartner: clientOrPartner || undefined,
      isExternalSynced: true
    });

    setIsMeetingModalOpen(false);
    setSelectedContactForMeeting(null);
  };

  const toggleParticipant = (name: string) => {
    if (participants.includes(name)) {
      setParticipants(participants.filter((p) => p !== name));
    } else {
      setParticipants([...participants, name]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Agendar Reunião ou Evento</h3>
              <p className="text-xs text-slate-400">Startup GK • Sincronização automática e alarme em tempo real</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsMeetingModalOpen(false);
              setSelectedContactForMeeting(null);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Título do Agendamento *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Demo de Web App com Diretor Técnico"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Evento</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="reuniao_cliente">Reunião com Cliente</option>
                <option value="sprint_dev">Sprint Dev / Arquitetura</option>
                <option value="pitch">Apresentação / Pitch Comercial</option>
                <option value="alinhamento_interno">Alinhamento Interno</option>
                <option value="entrega">Entrega de Projeto</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cliente ou Parceiro</label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={clientOrPartner}
                  onChange={(e) => setClientOrPartner(e.target.value)}
                  placeholder="Nome da empresa (opcional)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Data *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Início *</label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-2 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Término *</label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-2 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Link da Sala Virtual</label>
              <div className="relative">
                <Video className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="url"
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Alarme Antecipado</label>
              <div className="relative">
                <Bell className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <select
                  value={reminderMinutes}
                  onChange={(e) => setReminderMinutes(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value={5}>5 minutos antes</option>
                  <option value={10}>10 minutos antes</option>
                  <option value={15}>15 minutos antes</option>
                  <option value={30}>30 minutos antes</option>
                  <option value={60}>1 hora antes</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" /> Participantes da Equipe GK
            </label>
            <div className="flex flex-wrap gap-2">
              {users.map((u) => {
                const selected = participants.includes(u.name);
                return (
                  <button
                    type="button"
                    key={u.id}
                    onClick={() => toggleParticipant(u.name)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                      selected
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {u.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Pauta / Observações</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Objetivos principais da reunião..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsMeetingModalOpen(false);
                setSelectedContactForMeeting(null);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-cyan-500/20"
            >
              Confirmar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
