import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Clock,
  Download,
  ShieldCheck,
  Wifi,
  WifiOff,
  User,
  LogOut,
  Sparkles,
  Layers,
  Menu,
  Database,
  RotateCcw
} from 'lucide-react';
import { generatePdfReport } from '../utils/helpers';
import { ActiveTab } from './Sidebar';

interface NavbarProps {
  onToggleSidebar?: () => void;
  activeTab?: ActiveTab;
  setActiveTab?: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, activeTab, setActiveTab }) => {
  const {
    currentUser,
    activeAlarms,
    triggerTestAlarm,
    isOnline,
    projects,
    tasks,
    contacts,
    logout,
    setIsMeetingModalOpen,
    setIsAuthModalOpen,
    firebaseConnected,
    firebaseProjectId,
    setFirestoreRulesModalOpen,
    clearCacheAndReset
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleExportPdf = () => {
    generatePdfReport(projects, tasks, contacts, currentUser?.name || 'Sérgio GK');
  };

  const handleResetCache = () => {
    if (window.confirm('Deseja limpar todo o cache local e recarregar os dados limpos sincronizados com o Firestore?')) {
      clearCacheAndReset();
    }
  };

  return (
    <header className="h-16 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-40">
      {/* Brand Identity & Mobile Hamburger */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            title="Abrir menu de navegação"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="Startup GK"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-xl bg-slate-950 p-1 border border-cyan-500/40 shadow-md shadow-cyan-500/20"
            onError={(e) => {
              // Graceful fallback if image is still loading
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-sm sm:text-base tracking-tight font-sans">
                STARTUP GK
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                PORTAL PRIVADO
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block">
              Web Apps • Sites Institucionais • Páginas Publicitárias
            </p>
          </div>
        </div>
      </div>

      {/* Center live clock & Firestore status indicator */}
      <div className="hidden md:flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono font-bold text-white tracking-wider">{currentTime || '12:00:00'}</span>
        </div>

        {/* Firestore Database Connection Button */}
        <button
          onClick={() => setFirestoreRulesModalOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:scale-105 ${
            firebaseConnected
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
              : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
          }`}
          title="Ver Regras de Segurança do Firestore e Status da Conexão"
        >
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-[11px]">Firestore: {firebaseProjectId}</span>
          <span className={`w-2 h-2 rounded-full ${firebaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
        </button>

        {/* Offline / Cloud Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
            isOnline
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}
          title={isOnline ? 'Conexão em tempo real ativa' : 'Modo offline com sincronização local'}
        >
          {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          <span>{isOnline ? 'Nuvem OK' : 'Offline'}</span>
        </div>
      </div>

      {/* Right Controls: PDF Export, Meeting, Alarm Bell, User Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* PDF Export Button */}
        <button
          onClick={handleExportPdf}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs font-semibold transition-colors shadow-sm"
          title="Exportar Relatório Geral de TI em PDF"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Relatório PDF</span>
        </button>

        {/* Quick Meeting Button */}
        <button
          onClick={() => setIsMeetingModalOpen(true)}
          className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold text-xs transition-colors shadow shadow-cyan-500/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Agendar Reunião</span>
        </button>

        {/* Reset Cache & Clean Data Button */}
        <button
          onClick={handleResetCache}
          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors"
          title="Limpar Cache & Resetar Dados para Equipe Real"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Interactive Alarm Chime Button */}
        <div className="relative">
          <button
            onClick={triggerTestAlarm}
            className={`p-2 rounded-xl border transition-all ${
              activeAlarms.length > 0
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 animate-pulse'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="Testar Alarme Interativo em Tempo Real"
          >
            <Bell className="w-4 h-4" />
            {activeAlarms.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 text-slate-950 rounded-full text-[10px] font-black flex items-center justify-center">
                {activeAlarms.length}
              </span>
            )}
          </button>
        </div>

        {/* Current User Badge & Auth Switcher */}
        {currentUser && (
          <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-800">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors text-left"
              title="Conta do Membro & Segurança 2FA"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-cyan-500/40"
              />
              <div className="hidden md:block">
                <p className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                  {currentUser.name}
                  {currentUser.twoFactorEnabled && (
                    <ShieldCheck className="w-3 h-3 text-cyan-400" title="2FA Ativado" />
                  )}
                </p>
                <p className="text-[10px] text-cyan-400 leading-tight">{currentUser.role}</p>
              </div>
            </button>

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
              title="Encerrar sessão"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
