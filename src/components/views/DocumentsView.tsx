import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Lock,
  WifiOff,
  FolderDown,
  FileCheck,
  X,
  Sparkles,
  Tag
} from 'lucide-react';
import { DigitalDocument } from '../../types';

export const DocumentsView: React.FC = () => {
  const { documents, downloadDigitalDocument } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // New Document form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Contratos Digitais' | 'Briefings de Projetos' | 'Propostas Comerciais' | 'Especificações Técnicas'>('Contratos Digitais');
  const [fileType, setFileType] = useState<'PDF' | 'DOCX' | 'JSON' | 'ZIP'>('PDF');
  const [summary, setSummary] = useState('');
  const [tagsInput, setTagsInput] = useState('Contrato, TI, GK');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleDownloadDocument = (doc: DigitalDocument) => {
    downloadDigitalDocument(doc);
    setDownloadToast(`"${doc.title}" descarregado para a pasta do seu celular / computador!`);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newDoc: DigitalDocument = {
      id: `doc-${Date.now()}`,
      title,
      category,
      fileType,
      fileSize: '2.8 MB',
      date: new Date().toISOString().slice(0, 10),
      version: 'v1.0',
      status: 'Assinado',
      summary: summary || 'Documento corporativo aprovado e registrado para execução pela Startup GK.',
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
    };

    // Download immediately or simulate
    handleDownloadDocument(newDoc);
    setIsAddModalOpen(false);
    setTitle('');
    setSummary('');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-black text-white tracking-tight">
              Documentos Digitais & Armazenamento Offline
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Descarregue contratos, NDAs e propostas em pastas locais do celular para acesso mesmo sem internet.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" /> Novo Documento GK
        </button>
      </div>

      {/* Offline Storage Info Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-800/40 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-cyan-400 shrink-0">
            <WifiOff className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white">Modo Offline Habilitado</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Todos os documentos podem ser descarregados diretamente para a pasta "Downloads", "Documentos" ou iCloud/Google Drive do seu celular para consulta sem conexão de rede.
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {downloadToast && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, escopo ou contrato..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-cyan-500"
        >
          <option value="all">Todas as Categorias</option>
          <option value="Contratos Digitais">Contratos Digitais</option>
          <option value="Briefings de Projetos">Briefings de Projetos</option>
          <option value="Propostas Comerciais">Propostas Comerciais</option>
          <option value="Especificações Técnicas">Especificações Técnicas</option>
        </select>

        <span className="text-slate-500">
          {filteredDocs.length} documentos listados
        </span>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => {
          const categoryBadge =
            doc.category === 'Contratos Digitais'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : doc.category === 'Propostas Comerciais'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : doc.category === 'Briefings de Projetos'
              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
              : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';

          return (
            <div
              key={doc.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${categoryBadge}`}>
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {doc.fileType} • {doc.fileSize}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm leading-snug">{doc.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-3">{doc.summary}</p>

                {/* Tags */}
                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {doc.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{doc.date}</span>
                  <span className="text-cyan-400 font-bold">{doc.status}</span>
                </div>

                <button
                  onClick={() => handleDownloadDocument(doc)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FolderDown className="w-4 h-4 text-cyan-400" />
                  <span>Descarregar para o Celular / Pasta</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Novo Documento */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Salvar Novo Documento Digital
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Título do Documento *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Contrato de Manutenção e SLA - Cliente X"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Contratos Digitais">Contratos Digitais</option>
                    <option value="Briefings de Projetos">Briefings de Projetos</option>
                    <option value="Propostas Comerciais">Propostas Comerciais</option>
                    <option value="Especificações Técnicas">Especificações Técnicas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Formato</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="PDF">PDF Digital</option>
                    <option value="DOCX">Word DOCX</option>
                    <option value="JSON">JSON Data</option>
                    <option value="ZIP">ZIP Compactado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Contrato, TI, GK"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Resumo / Escopo</label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Resumo das cláusulas, escopo de homologação e garantias..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-md shadow-cyan-500/20"
                >
                  Salvar e Baixar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
