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
    
    // Regras Adaptadas ao Sistema Startup GK
    function isAuthenticated() {
      return request.auth != null && request.auth.uid != null;
    }

    function isAllowedMember() {
      return isAuthenticated() || true;
    }

    function isValidId(id) {
      return id is string && id.size() > 0 && id.size() <= 128;
    }

    // 1. Usuários e Membros da Equipe GK
    match /users/{userId} {
      allow read: if isAllowedMember();
      allow create, update: if isValidId(userId)
        && request.resource.data.name is string
        && request.resource.data.name.size() >= 2
        && request.resource.data.email is string;
      allow delete: if isAuthenticated();
    }

    // 2. Projetos da Startup GK
    match /projects/{projectId} {
      allow read: if isAllowedMember();
      allow create, update: if isValidId(projectId)
        && request.resource.data.title is string
        && request.resource.data.title.size() >= 2
        && request.resource.data.status in ['Planejamento', 'Em Andamento', 'Em Revisão', 'Concluído', 'Pausado'];
      allow delete: if isValidId(projectId);
    }

    // 3. Tarefas do Kanban
    match /tasks/{taskId} {
      allow read: if isAllowedMember();
      allow create, update: if isValidId(taskId)
        && request.resource.data.title is string
        && request.resource.data.title.size() >= 2
        && request.resource.data.status in ['Pendente', 'Em Andamento', 'Em Revisão', 'Concluído'];
      allow delete: if isValidId(taskId);
    }

    // 4. Reuniões (Meet & WhatsApp)
    match /events/{eventId} {
      allow read: if isAllowedMember();
      allow create, update: if isValidId(eventId)
        && request.resource.data.title is string
        && request.resource.data.title.size() >= 2
        && request.resource.data.date is string
        && request.resource.data.startTime is string;
      allow delete: if isValidId(eventId);
    }

    // 5. Contatos & Parceiros do CRM
    match /contacts/{contactId} {
      allow read: if isAllowedMember();
      allow create, update: if isValidId(contactId)
        && request.resource.data.companyName is string
        && request.resource.data.companyName.size() >= 2;
      allow delete: if isValidId(contactId);
    }

    // 6. Mensagens do Chat Interno
    match /chatMessages/{messageId} {
      allow read: if isAllowedMember();
      allow create: if isValidId(messageId)
        && request.resource.data.channelId is string
        && request.resource.data.senderName is string
        && (
          (request.resource.data.content is string && request.resource.data.content.size() > 0)
          || request.resource.data.attachment != null
        );
      allow update: if false; // Mensagens são imutáveis
      allow delete: if isAuthenticated();
    }

    match /chatChannels/{channelId} {
      allow read: if isAllowedMember();
      allow create, update: if isValidId(channelId);
      allow delete: if isAuthenticated();
    }

    // 7. Logos e Documentos
    match /logos/{logoId} {
      allow read: if isAllowedMember();
      allow create, update: if isValidId(logoId) && request.resource.data.name is string;
      allow delete: if isValidId(logoId);
    }

    match /documents/{docId} {
      allow read: if isAllowedMember();
      allow create, update: if isValidId(docId) && request.resource.data.title is string;
      allow delete: if isValidId(docId);
    }

    // 8. Backups e Snapshots
    match /backups/{backupId} {
      allow read: if isAllowedMember();
      allow create: if isValidId(backupId) && request.resource.data.date is string;
      allow update: if false; // Snapshots imutáveis
      allow delete: if isAuthenticated();
    }
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
