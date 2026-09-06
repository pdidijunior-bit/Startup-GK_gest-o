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
  Zap
} from 'lucide-react';
import { MONTHLY_PERFORMANCE } from '../../data/initialData';
import { generatePdfReport } from '../../utils/helpers';

export const AnalyticsView: React.FC = () => {
  const { projects, tasks, contacts, currentUser } = useApp();

  const handleExportPdf = () => {
    generatePdfReport(projects, tasks, contacts, currentUser?.name || 'Sérgio GK');
  };

  const maxFaturamento = Math.max(...MONTHLY_PERFORMANCE.map((m) => m.faturamento));

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-black text-white tracking-tight">
              Estatísticas, Performance Mensal & Conversão
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Métricas de conversão de leads, receita e velocidade de entrega da Startup GK.
          </p>
        </div>

        <button
          onClick={handleExportPdf}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20"
        >
          <Download className="w-4 h-4" /> Exportar Relatório em PDF
        </button>
      </div>

      {/* Top Highlight Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400">Faturamento Projetado (Set/26)</span>
          <h3 className="text-2xl font-black text-white mt-1">R$ 118.000,00</h3>
          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-1.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> +22.3% de crescimento acelerado
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400">Taxa de Conversão de Clientes</span>
          <h3 className="text-2xl font-black text-cyan-400 mt-1">58.0%</h3>
          <p className="text-xs text-slate-400 mt-1.5">
            De leads qualificados para contratos assinados
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400">Ticket Médio por Projeto</span>
          <h3 className="text-2xl font-black text-purple-400 mt-1">R$ 36.375,00</h3>
          <p className="text-xs text-slate-400 mt-1.5">
            Web Apps, Landing Pages e Portais Corporativos
          </p>
        </div>
      </div>

      {/* Main Charts: Faturamento Mensal Bar Chart + Conversion Rate Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Faturamento Mensal Progression */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-sm">Evolução Mensal de Faturamento (R$)</h3>
              <p className="text-[11px] text-slate-400">Histórico de abril a setembro de 2026</p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Total Acumulado: R$ 457.5k
            </span>
          </div>

          {/* Custom SVG / HTML Bar Chart */}
          <div className="flex items-end justify-between gap-3 h-64 pt-6 px-2">
            {MONTHLY_PERFORMANCE.map((item, idx) => {
              const heightPercent = Math.round((item.faturamento / maxFaturamento) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {Math.round(item.faturamento / 1000)}k
                  </span>
                  <div className="w-full bg-slate-950 rounded-xl p-1 h-full flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-lg transition-all duration-500 group-hover:brightness-125 shadow-lg shadow-cyan-500/10"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 text-center truncate w-full">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Taxa de Conversão de Novos Clientes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-sm">Taxa de Conversão de Clientes (%)</h3>
              <p className="text-[11px] text-slate-400">Eficácia das reuniões e propostas da GK</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Recorde: 58%
            </span>
          </div>

          <div className="flex flex-col gap-4 justify-center flex-1">
            {MONTHLY_PERFORMANCE.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{item.month}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.novosProjetos} novos contratos
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{item.taxaConversao}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.taxaConversao}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breakdown by Product Category */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-sm">
            Distribuição de Faturamento por Solução de TI GK
          </h3>
          <span className="text-xs text-slate-400">Mix de Produtos de Alta Rentabilidade</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-bold text-cyan-400">1. Web Apps & Portais SaaS</span>
            <div className="text-xl font-extrabold text-white">55% do Faturamento</div>
            <p className="text-[11px] text-slate-400">
              Projetos complexos com React, Node, bancos de dados e regras de negócio sob medida.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-bold text-purple-400">2. Páginas Publicitárias (Landing Ads)</span>
            <div className="text-xl font-extrabold text-white">25% do Faturamento</div>
            <p className="text-[11px] text-slate-400">
              Páginas de altíssima velocidade e conversão para campanhas no Google Ads e Meta Ads.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-bold text-blue-400">3. Sites Institucionais Modernos</span>
            <div className="text-xl font-extrabold text-white">20% do Faturamento</div>
            <p className="text-[11px] text-slate-400">
              Identidade digital corporativa com SEO avançado e experiência premium.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
