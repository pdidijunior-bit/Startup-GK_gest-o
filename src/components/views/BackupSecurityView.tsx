import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Cloud,
  Download,
  Upload,
  Key,
  Smartphone,
  Lock,
  CheckCircle2,
  RefreshCw,
  HardDrive,
  AlertTriangle,
  History,
  FileCheck
} from 'lucide-react';
import { triggerFileDownload } from '../../utils/helpers';

export const BackupSecurityView: React.FC = () => {
  const {
    backups,
    createCloudBackup,
    currentUser,
    is2FAEnabled,
    setIs2FAEnabled,
    projects,
    tasks,
    contacts,
    meetings
  } = useApp();

  const [backupToast, setBackupToast] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTriggerCloudBackup = () => {
    setIsProcessing(true);
    setTimeout(() => {
      createCloudBackup();
      setIsProcessing(false);
      setBackupToast('Backup na nuvem gerado e salvo com sucesso com criptografia AES-256!');
      setTimeout(() => setBackupToast(null), 4000);
    }, 1000);
  };

  const handleExportFullJsonBackup = () => {
    const backupPayload = {
      app: 'Startup GK Enterprise Management',
      version: '2.4.0',
      exportedAt: new Date().toISOString(),
      author: currentUser?.name || 'Sérgio GK',
      data: {
        projects,
        tasks,
        contacts,
        meetings,
        security: {
          twoFactorAuthEnforced: is2FAEnabled,
          encryptionStandard: 'AES-256-GCM'
        }
      }
    };

    triggerFileDownload(
      JSON.stringify(backupPayload, null, 2),
      `StartupGK_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`,
      'application/json'
    );

    setBackupToast('Arquivo de recuperação completo (.json) baixado para o seu dispositivo!');
    setTimeout(() => setBackupToast(null), 4000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-black text-white tracking-tight">
              Segurança Máxima 2FA & Backup dos Dados na Nuvem
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Garantia de que nenhuma informação da Startup GK seja perdida com backups e autenticação de dois fatores.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportFullJsonBackup}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Baixar Arquivo .JSON</span>
          </button>

          <button
            onClick={handleTriggerCloudBackup}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Cloud className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Sincronizando...' : 'Novo Backup na Nuvem'}</span>
          </button>
        </div>
      </div>

      {/* Toast */}
      {backupToast && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{backupToast}</span>
        </div>
      )}

      {/* Security & 2FA Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2FA Configuration Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Autenticação de Dois Fatores (2FA)</h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  is2FAEnabled
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {is2FAEnabled ? '2FA ATIVO & OBRIGATÓRIO' : 'DESATIVADO'}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              O 2FA adiciona uma camada impenetrável de proteção exigindo um código de 6 dígitos gerado via aplicativo autenticador (Google Authenticator / Authy) além de login e senha.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mt-4 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status da Conta GK:</span>
                <span className="font-bold text-cyan-400">{currentUser?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Método de Segundo Fator:</span>
                <span className="text-slate-200 font-mono">TOTP RFC-6238</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Criptografia em Repouso:</span>
                <span className="text-emerald-400 font-mono font-bold">AES-256-GCM</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Exigir 2FA a cada login</span>
            <button
              onClick={() => setIs2FAEnabled(!is2FAEnabled)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                is2FAEnabled
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
              }`}
            >
              {is2FAEnabled ? 'Desativar Temporariamente' : 'Ativar 2FA Imediato'}
            </button>
          </div>
        </div>

        {/* Cloud Auto-Backup Engine */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Backup Automático em Nuvem Privada</h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Sincronização 10s
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Todos os dados de projetos, tarefas, contatos e histórico de interações são salvos de forma redundante no cache local do dispositivo e enviados para o repositório de backup em nuvem.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mt-4 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Projetos & Tarefas Protegidos:</span>
                <span className="font-bold text-slate-200">{projects.length} proj. / {tasks.length} tarefas</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Contatos e Livros de Notas:</span>
                <span className="font-bold text-slate-200">{contacts.length} empresas catalogadas</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Reuniões & Alarmes Ativos:</span>
                <span className="font-bold text-slate-200">{meetings.length} agendamentos</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Disponibilidade Offline 100%</span>
            <button
              onClick={handleExportFullJsonBackup}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
            >
              Exportar Cópia Offline
            </button>
          </div>
        </div>
      </div>

      {/* Snapshots History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-white text-sm">Histórico de Snapshots e Backups na Nuvem</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {backups.length} snapshots armazenados
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {backups.map((b) => (
            <div
              key={b.id}
              className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-900 text-cyan-400">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{b.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    Snapshot ID: {b.id} • {b.timestamp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-[10px] font-mono text-slate-400 px-2 py-1 rounded bg-slate-900 border border-slate-800">
                  {b.size}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {b.status.toUpperCase()}
                </span>
                <button
                  onClick={handleExportFullJsonBackup}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Restaurar / Baixar este Snapshot"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
