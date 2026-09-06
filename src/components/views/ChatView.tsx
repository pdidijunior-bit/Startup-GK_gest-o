import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  Paperclip,
  Smile,
  Hash,
  Users,
  Code,
  FileText,
  Sparkles
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const {
    channels,
    activeChannelId,
    setActiveChannelId,
    messages,
    sendMessage,
    currentUser,
    users
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const channelMessages = messages.filter((m) => m.channelId === activeChannelId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleSendQuickCodeSnippet = () => {
    sendMessage('Compartilhando snippet de código do novo endpoint da Startup GK:', {
      name: 'api-auth-middleware.ts',
      size: '18 KB',
      type: 'code'
    });
    setShowAttachmentModal(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150 h-[calc(100vh-130px)] min-h-[580px]">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-400" />
          <div>
            <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-cyan-400" /> {activeChannel.name}
            </h1>
            <p className="text-xs text-slate-400">{activeChannel.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>{users.length} membros na equipe GK</span>
        </div>
      </div>

      {/* Chat Layout: Channel sidebar on left, Chat conversation in middle, Team presence on right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-hidden">
        {/* Left 3 Cols: Channels */}
        <div className="hidden md:flex md:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-3 flex-col gap-3 overflow-y-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 pt-1">
            Canais de Comunicação GK
          </span>
          <div className="flex flex-col gap-1">
            {channels.map((chan) => {
              const isActive = chan.id === activeChannelId;
              return (
                <button
                  key={chan.id}
                  onClick={() => setActiveChannelId(chan.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Hash className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                    <span className="truncate">{chan.name}</span>
                  </div>
                  {chan.unreadCount && chan.unreadCount > 0 ? (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-cyan-500 text-slate-950">
                      {chan.unreadCount}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-3 border-t border-slate-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-2">
              Status da Equipe GK
            </span>
            <div className="flex flex-col gap-2">
              {users.map((u) => (
                <div key={u.id} className="flex items-center gap-2 px-2 py-1 text-xs">
                  <div className="relative">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-6 h-6 rounded-lg object-cover ring-1 ring-slate-700"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-900 ${
                        u.status === 'online'
                          ? 'bg-emerald-400'
                          : u.status === 'busy'
                          ? 'bg-rose-400'
                          : u.status === 'in_meeting'
                          ? 'bg-cyan-400'
                          : 'bg-amber-400'
                      }`}
                    />
                  </div>
                  <div className="truncate">
                    <p className="text-slate-200 font-medium truncate leading-tight text-[11px]">{u.name}</p>
                    <p className="text-[9px] text-slate-500 truncate">{u.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle/Right 9 Cols: Messages Area */}
        <div className="md:col-span-9 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-sm">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3.5">
            {channelMessages.map((msg) => {
              const isCurrentUser = msg.senderId === currentUser?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 text-xs ${
                    isCurrentUser ? 'flex-row-reverse' : ''
                  }`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-xl object-cover shrink-0 ring-1 ring-slate-800"
                  />
                  <div
                    className={`flex flex-col gap-1 max-w-[80%] ${
                      isCurrentUser ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{msg.senderName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {msg.senderRole}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-slate-100 leading-relaxed ${
                        isCurrentUser
                          ? 'bg-cyan-600/30 border border-cyan-500/40 rounded-tr-none'
                          : 'bg-slate-950 border border-slate-800 rounded-tl-none'
                      }`}
                    >
                      <p>{msg.content}</p>

                      {/* Attachment if present */}
                      {msg.attachment && (
                        <div className="mt-2 p-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-[11px]">
                          <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-cyan-400" />
                            <span className="font-mono text-cyan-300 font-bold">
                              {msg.attachment.name}
                            </span>
                            <span className="text-slate-500">({msg.attachment.size})</span>
                          </div>
                          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            Código GK
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Reactions */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        {msg.reactions.map((r, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded-full text-[10px] text-slate-300 flex items-center gap-1"
                          >
                            <span>{r.emoji}</span>
                            <span className="font-mono font-bold">{r.count}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Form */}
          <form
            onSubmit={handleSend}
            className="pt-3 border-t border-slate-800 flex items-center gap-2 mt-2"
          >
            <button
              type="button"
              onClick={handleSendQuickCodeSnippet}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
              title="Compartilhar Código de Exemplo"
            >
              <Code className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Enviar mensagem no canal #${activeChannel.name}...`}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
            />

            <button
              type="submit"
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
