import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  BookOpen,
  Plus,
  Search,
  Building,
  History,
  Clock,
  Send,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Sparkles
} from 'lucide-react';
import { ContactPartner, PartnerCategory, LeadStatus } from '../../types';

export const ContactsCrmView: React.FC = () => {
  const {
    contacts,
    addContact,
    addContactNote,
    callContact,
    whatsappContact,
    emailContact,
    setSelectedContactForMeeting,
    setIsMeetingModalOpen
  } = useApp();

  const [selectedContactId, setSelectedContactId] = useState<string>(contacts[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [newNoteText, setNewNoteText] = useState('');
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);

  // New Contact form
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [category, setCategory] = useState<PartnerCategory>('Cliente Potencial');
  const [status, setStatus] = useState<LeadStatus>('Novo Lead');
  const [estimatedValue, setEstimatedValue] = useState(25000);
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || c.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const selectedContact = contacts.find((c) => c.id === selectedContactId) || filteredContacts[0];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedContact) return;

    addContactNote(selectedContact.id, newNoteText.trim());
    setNewNoteText('');
  };

  const handleScheduleMeeting = (contact: ContactPartner) => {
    setSelectedContactForMeeting(contact);
    setIsMeetingModalOpen(true);
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactPerson.trim()) return;

    addContact({
      companyName,
      contactPerson,
      role: role || 'Responsável Comercial',
      email: email || 'contato@empresa.com.br',
      phone: phone || '+55 11 99999-9999',
      whatsapp: whatsapp || phone.replace(/[^\d]/g, '') || '5511999999999',
      category,
      status,
      estimatedValue: Number(estimatedValue) || 15000,
      website: website || undefined,
      address: address || 'São Paulo, SP',
      lastContactDate: new Date().toISOString().slice(0, 10)
    });

    setIsNewContactModalOpen(false);
    setCompanyName('');
    setContactPerson('');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-black text-white tracking-tight">
              CRM de Contatos, Parceiros & Livro de Notas
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Histórico automático de interações: Chamar no discador, abrir WhatsApp, enviar e-mail e agendar reuniões.
          </p>
        </div>

        <button
          onClick={() => setIsNewContactModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" /> Novo Contato / Lead
        </button>
      </div>

      {/* Main CRM Grid: Left column contact list, Right column contact details & notebook */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Contact Directory */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3.5">
          {/* Search & Filter */}
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por empresa, nome ou e-mail..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Todas as Categorias</option>
              <option value="Cliente Potencial">Clientes Potenciais</option>
              <option value="Parceiro Tecnológico">Parceiros Tecnológicos</option>
              <option value="Agência de Publicidade">Agências de Publicidade</option>
              <option value="Fornecedor Cloud">Fornecedores Cloud</option>
            </select>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>{filteredContacts.length} contatos registrados</span>
            <span className="text-cyan-400 font-mono">GK CRM Realtime</span>
          </div>

          {/* Contact Cards List */}
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[640px] pr-1">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                <Users className="w-8 h-8 text-slate-700" />
                <span className="font-semibold text-slate-300">Nenhum contato cadastrado</span>
                <span className="text-[11px] text-slate-500">Cadastre clientes ou parceiros para o CRM da GK.</span>
                <button
                  onClick={() => setIsNewContactModalOpen(true)}
                  className="mt-2 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Novo Contato
                </button>
              </div>
            ) : (
              filteredContacts.map((contact) => {
              const isSelected = selectedContact?.id === contact.id;
              const statusColor =
                contact.status === 'Contrato Fechado'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : contact.status === 'Em Negociação'
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  : contact.status === 'Proposta Enviada'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700';

              return (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContactId(contact.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-950 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-xs leading-snug">
                        {contact.companyName}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {contact.contactPerson} • {contact.role}
                      </p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${statusColor}`}>
                      {contact.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">
                      R$ {contact.estimatedValue.toLocaleString('pt-BR')}
                    </span>
                    <span>Notas: {contact.notesBook.length}</span>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>

        {/* Right 7 Cols: Detailed Contact Card, Quick Action Buttons, Notebook, and Auto-Logged History */}
        {selectedContact ? (
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Top Contact Header Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white tracking-tight">
                      {selectedContact.companyName}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {selectedContact.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Responsável: <strong className="text-slate-200">{selectedContact.contactPerson}</strong> ({selectedContact.role})
                  </p>
                </div>

                <div className="text-right sm:self-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Valor Estimado</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    R$ {selectedContact.estimatedValue.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Direct Action Buttons: Chamar, WhatsApp, E-mail, Agendar */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Ações Diretas com Histórico Salvo Automaticamente:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Chamar */}
                  <button
                    onClick={() => callContact(selectedContact)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow shadow-emerald-600/20"
                    title={`Chamar no discador do celular: ${selectedContact.phone}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Chamar</span>
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={() => whatsappContact(selectedContact)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow shadow-emerald-500/20"
                    title={`Abrir WhatsApp imediatamente: ${selectedContact.whatsapp}`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  {/* E-mail */}
                  <button
                    onClick={() => emailContact(selectedContact)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow shadow-blue-600/20"
                    title={`Enviar e-mail para: ${selectedContact.email}`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Enviar E-mail</span>
                  </button>

                  {/* Agendar Reunião */}
                  <button
                    onClick={() => handleScheduleMeeting(selectedContact)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow shadow-cyan-500/20"
                    title="Agendar reunião com este parceiro no calendário"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Agendar Reunião</span>
                  </button>
                </div>
              </div>

              {/* Contact Meta Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                <div>
                  <span className="text-[10px] text-slate-500 block">Telefone:</span>
                  <span className="font-mono text-slate-200">{selectedContact.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">E-mail:</span>
                  <span className="text-slate-200 truncate block">{selectedContact.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Último Contato:</span>
                  <span className="text-slate-200">{selectedContact.lastContactDate}</span>
                </div>
              </div>
            </div>

            {/* Livro de Notas (Notebook) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">
                    Livro de Notas de {selectedContact.companyName}
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedContact.notesBook.length} anotações
                </span>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex flex-col gap-2">
                <textarea
                  rows={2}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Escreva uma nova anotação sobre reuniões, preferências técnicas, briefing..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow"
                  >
                    <Send className="w-3 h-3" /> Adicionar ao Livro de Notas
                  </button>
                </div>
              </form>

              {/* Notes List */}
              <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto">
                {selectedContact.notesBook.map((note) => (
                  <div
                    key={note.id}
                    className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-cyan-400">{note.author}</span>
                      <span className="font-mono">{note.timestamp}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interaction History Timeline (Salvo Automaticamente) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">
                    Histórico de Interações Salvo Automaticamente
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Logs Ativos
                </span>
              </div>

              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {selectedContact.interactionHistory.map((log) => {
                  const typeIcon =
                    log.type === 'call' ? (
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    ) : log.type === 'whatsapp' ? (
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    ) : log.type === 'email' ? (
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                    ) : log.type === 'meeting' ? (
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                    );

                  return (
                    <div
                      key={log.id}
                      className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-start gap-3 text-xs"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-900 shrink-0 mt-0.5">
                        {typeIcon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-white">{log.summary}</span>
                          <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                        </div>
                        {log.details && <p className="text-slate-400 text-[11px] mt-0.5">{log.details}</p>}
                        <span className="text-[10px] text-cyan-400 font-medium block mt-1">
                          Registrado por {log.author}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            Selecione um contato para visualizar detalhes e livro de notas.
          </div>
        )}
      </div>

      {/* Modal Criar Novo Contato */}
      {isNewContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Cadastrar Novo Parceiro / Lead
              </h3>
              <button
                onClick={() => setIsNewContactModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="flex flex-col gap-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nome da Empresa *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ex: FinTech Alpha"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nome do Contato *</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Ex: Juliana Prado"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Cargo / Função</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Ex: Diretora de Marketing"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">E-mail Corporativo</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="juliana@fintechalpha.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Telefone (Discador)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+55 11 98888-7777"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">WhatsApp (com DDI/DDD)</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="5511988887777"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PartnerCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Cliente Potencial">Cliente Potencial</option>
                    <option value="Parceiro Tecnológico">Parceiro Tecnológico</option>
                    <option value="Agência de Publicidade">Agência de Publicidade</option>
                    <option value="Fornecedor Cloud">Fornecedor Cloud</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Status do Lead</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as LeadStatus)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Novo Lead">Novo Lead</option>
                    <option value="Contato Inicial">Contato Inicial</option>
                    <option value="Proposta Enviada">Proposta Enviada</option>
                    <option value="Em Negociação">Em Negociação</option>
                    <option value="Contrato Fechado">Contrato Fechado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Valor Estimado (R$)</label>
                  <input
                    type="number"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Website / Domínio</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewContactModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-md shadow-cyan-500/20"
                >
                  Salvar Parceiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
