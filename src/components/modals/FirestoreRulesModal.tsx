import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Copy,
  Check,
  X,
  Database,
  ExternalLink,
  Flame,
  AlertCircle,
  Code
} from 'lucide-react';

export const FirestoreRulesModal: React.FC = () => {
  const { firestoreRulesModalOpen, setFirestoreRulesModalOpen, firebaseProjectId } = useApp();
  const [copied, setCopied] = useState(false);

  if (!firestoreRulesModalOpen) return null;

  const rulesText = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function: verifica se o usuário está autenticado
    function isAuthenticated() {
      return request.auth != null && request.auth.uid != null;
    }

    // Helper function: verifica se é o proprietário do documento
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Coleção de Usuários da Startup GK
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAuthenticated() && (request.auth.uid == userId || resource.data.role == 'Fundador / CEO');
      allow delete: if isAuthenticated() && resource.data.role == 'Fundador / CEO';
    }

    // Módulo de Projetos (Web Apps, Sites, Landing Pages)
    match /projects/{projectId} {
      allow read, write: if isAuthenticated();
    }

    // Módulo de Tarefas Visuais (Kanban, Gantt e Checklist)
    match /tasks/{taskId} {
      allow read, write: if isAuthenticated();
    }

    // Calendário & Reuniões
    match /events/{eventId} {
      allow read, write: if isAuthenticated();
    }

    // CRM de Contatos & Parceiros
    match /contacts/{contactId} {
      allow read, write: if isAuthenticated();
    }

    // Chat Corporativo em Tempo Real
    match /chatMessages/{messageId} {
      allow read, create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && (resource.data.senderId == request.auth.uid || isOwner(resource.data.senderId));
    }

    match /chatChannels/{channelId} {
      allow read, write: if isAuthenticated();
    }

    // Galeria de Logotipos Oficiais
    match /logos/{logoId} {
      allow read, write: if isAuthenticated();
    }

    // Documentos Digitais e Contratos
    match /documents/{docId} {
      allow read, write: if isAuthenticated();
    }

    // Backups e Auditoria de Segurança
    match /backups/{backupId} {
      allow read, create: if isAuthenticated();
      allow update, delete: if false; // Snapshots imutáveis
    }

    // Regra de desenvolvimento/teste (caso queira liberar temporariamente):
    // match /{document=**} { allow read, write: if request.auth != null; }
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rulesText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Regras de Segurança Oficiais do Firestore
              </h3>
              <p className="text-xs text-slate-400">
                Projeto Firebase vinculado: <span className="text-cyan-400 font-mono font-bold">{firebaseProjectId}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setFirestoreRulesModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-xl p-3.5 text-xs text-slate-300 flex items-start gap-3">
          <Flame className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-cyan-300 block mb-1">
              Como aplicar as regras no Firebase Console:
            </span>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Acesse o console do Firebase em seu projeto <b className="text-white">{firebaseProjectId}</b>.</li>
              <li>No menu lateral esquerdo, clique em <b className="text-white">Firestore Database &gt; Regras (Rules)</b>.</li>
              <li>Substitua todo o conteúdo existente pelo código abaixo e clique em <b className="text-cyan-400 font-bold">Publicar (Publish)</b>.</li>
            </ol>
          </div>
        </div>

        {/* Code Box */}
        <div className="relative">
          <div className="flex items-center justify-between bg-slate-950 px-3.5 py-2 border-t border-x border-slate-800 rounded-t-xl text-xs text-slate-400">
            <span className="font-mono text-[11px] flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-cyan-400" /> firestore.rules
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-all text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copiado com Sucesso!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copiar Regras
                </>
              )}
            </button>
          </div>
          <pre className="bg-slate-950/90 border border-slate-800 rounded-b-xl p-4 text-[11px] font-mono text-cyan-200/90 overflow-x-auto max-h-72 leading-relaxed selection:bg-cyan-500 selection:text-slate-950">
            {rulesText}
          </pre>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <a
            href="https://console.firebase.google.com/project/startup-gk-93be2/firestore/rules"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Abrir Painel de Regras no Firebase Console
          </a>

          <button
            onClick={() => setFirestoreRulesModalOpen(false)}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Entendido, Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
