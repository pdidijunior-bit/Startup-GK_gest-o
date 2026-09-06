import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Image as ImageIcon,
  Download,
  Plus,
  Search,
  ExternalLink,
  Smartphone,
  CheckCircle2,
  X,
  Palette,
  Sparkles
} from 'lucide-react';
import { BrandLogo } from '../../types';

export const LogosGalleryView: React.FC = () => {
  const { logos, addBrandLogo, downloadBrandLogo } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Add logo form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Clientes Ativos' | 'Parceiros Estratégicos' | 'Certificações / Tech'>('Clientes Ativos');
  const [format, setFormat] = useState<'SVG' | 'PNG' | 'WEBP'>('SVG');
  const [dimensions, setDimensions] = useState('1024x1024 px');
  const [colorHex, setColorHex] = useState('#06b6d4');
  const [description, setDescription] = useState('');

  const filteredLogos = logos.filter((logo) => {
    const matchesSearch =
      logo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      logo.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      logo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat = selectedFormat === 'all' || logo.format === selectedFormat;
    return matchesSearch && matchesFormat;
  });

  const handleDownloadToDevice = (logo: BrandLogo) => {
    downloadBrandLogo(logo);
    setDownloadSuccessToast(`Logotipo de "${logo.name}" descarregado no celular/computador com sucesso!`);
    setTimeout(() => setDownloadSuccessToast(null), 3500);
  };

  const handleAddLogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addBrandLogo({
      name,
      category,
      format,
      dimensions,
      size: '1.2 MB',
      colorHex,
      description: description || `Logotipo corporativo oficial de ${name} para aplicações da Startup GK.`,
      svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" rx="40" fill="%230f172a"/><circle cx="200" cy="200" r="110" fill="none" stroke="${encodeURIComponent(colorHex)}" stroke-width="14"/><text x="200" y="215" font-family="sans-serif" font-size="34" font-weight="900" fill="%23ffffff" text-anchor="middle">${encodeURIComponent(name)}</text></svg>`
    });

    setIsAddModalOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-black text-white tracking-tight">
              Galeria de Logotipos de Parceiros & Clientes
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Armazenamento seguro de identidades visuais com download direto para celular e computador.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" /> Adicionar Logotipo
        </button>
      </div>

      {/* Toast Notification */}
      {downloadSuccessToast && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por parceiro, cliente ou categoria..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-cyan-500"
        >
          <option value="all">Todos os Formatos</option>
          <option value="SVG">Vetor SVG</option>
          <option value="PNG">PNG Transparente</option>
          <option value="WEBP">WebP Otimizado</option>
        </select>

        <span className="text-slate-500">
          {filteredLogos.length} logotipos na galeria GK
        </span>
      </div>

      {/* Logos Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredLogos.map((logo) => (
          <div
            key={logo.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all shadow-sm group"
          >
            {/* Visual Logo Preview */}
            <div className="w-full h-36 bg-slate-950 rounded-xl border border-slate-800/80 p-4 flex items-center justify-center relative overflow-hidden group-hover:border-cyan-500/40 transition-colors">
              {logo.svgDataUri ? (
                <img
                  src={logo.svgDataUri}
                  alt={logo.name}
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1 text-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg text-white border"
                    style={{ borderColor: logo.colorHex, backgroundColor: `${logo.colorHex}20` }}
                  >
                    {logo.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-300 mt-1">{logo.name}</span>
                </div>
              )}
              <span className="absolute top-2 right-2 text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900/80 text-cyan-400 border border-slate-700">
                {logo.format}
              </span>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center justify-between gap-1">
                <h3 className="font-bold text-white text-sm leading-snug truncate">{logo.name}</h3>
                <span
                  className="w-3 h-3 rounded-full shrink-0 border border-slate-700"
                  style={{ backgroundColor: logo.colorHex }}
                  title={logo.colorHex}
                />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{logo.category}</p>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{logo.description}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
                <span>{logo.dimensions}</span>
                <span>{logo.size}</span>
              </div>
            </div>

            {/* Download Button for Mobile & PC */}
            <button
              onClick={() => handleDownloadToDevice(logo)}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Descarregar no Celular</span>
            </button>
          </div>
        ))}
      </div>

      {/* Modal Adicionar Logotipo */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Salvar Logotipo de Parceiro
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLogo} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nome do Parceiro / Empresa *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Banco Neon ou Agência Alpha"
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
                    <option value="Clientes Ativos">Clientes Ativos</option>
                    <option value="Parceiros Estratégicos">Parceiros Estratégicos</option>
                    <option value="Certificações / Tech">Certificações / Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Formato</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="SVG">SVG Vetorial</option>
                    <option value="PNG">PNG Transparente</option>
                    <option value="WEBP">WebP HD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Dimensões</label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="1024x1024 px"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Cor Primária (HEX)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-slate-950 border border-slate-700"
                    />
                    <input
                      type="text"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-white font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Descrição / Aplicação</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Guia de uso da marca em sites, web apps e campanhas..."
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
                  Salvar Logotipo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
