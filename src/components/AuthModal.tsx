import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Lock,
  Mail,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Users,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  Phone,
  Briefcase,
  Building2,
  Trash2,
  Check,
  LogOut,
  X,
  Sparkles
} from 'lucide-react';
import { UserRole, Department, User } from '../types';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = (props) => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    users,
    login,
    registerAccount,
    switchUser,
    deleteUser,
    logout,
    verify2FA
  } = useApp();

  const isOpen = props.isOpen !== undefined ? props.isOpen : isAuthModalOpen;

  const handleClose = () => {
    if (props.onClose) props.onClose();
    setIsAuthModalOpen(false);
  };

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'team'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [waiting2FA, setWaiting2FA] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Register employee form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regRole, setRegRole] = useState<UserRole>('Full-Stack Developer');
  const [regDept, setRegDept] = useState<Department>('Desenvolvimento Web');
  const [regPhone, setRegPhone] = useState('');
  const [regEnable2FA, setRegEnable2FA] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (waiting2FA) {
      if (!totpCode.trim()) {
        setLoginError('Digite o código de 6 dígitos de autenticação.');
        return;
      }
      const verified = verify2FA(totpCode.trim());
      if (verified) {
        handleClose();
      } else {
        setLoginError('Código 2FA incorreto ou expirado. Tente novamente ou use 123456 para teste.');
      }
      return;
    }

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Preencha seu e-mail e senha de acesso.');
      return;
    }

    setIsSubmittingLogin(true);
    try {
      const result = await login(loginEmail.trim(), loginPassword);
      if (result.success) {
        if (result.requires2fa) {
          setWaiting2FA(true);
        } else {
          handleClose();
        }
      } else {
        setLoginError(result.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Erro ao autenticar. Tente novamente.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccessMessage(null);

    if (!regName.trim()) {
      setRegError('Por favor, informe o nome completo do membro.');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('Por favor, informe o e-mail corporativo.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('A senha de acesso deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsSubmittingRegister(true);
    try {
      const result = await registerAccount(
        {
          name: regName.trim(),
          email: regEmail.trim(),
          role: regRole,
          department: regDept,
          phone: regPhone.trim(),
          twoFactorEnabled: regEnable2FA
        },
        regPassword,
        false // Do not immediately kick out current session
      );

      if (result.success) {
        setRegSuccessMessage(`Funcionário "${regName.trim()}" cadastrado com sucesso na equipe GK!`);
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        setRegPhone('');
        setRegEnable2FA(false);
      } else {
        setRegError(result.error || 'Erro ao cadastrar novo funcionário.');
      }
    } catch (err: any) {
      setRegError(err.message || 'Falha na criação da conta de funcionário.');
    } finally {
      setIsSubmittingRegister(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                Segurança & Gestão de Funcionários GK
              </h3>
              <p className="text-xs text-slate-400">
                Acesso corporativo, cadastro de novos membros e permissões de equipe
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setLoginError(null);
            }}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'login'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Entrar (Login)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setRegError(null);
              setRegSuccessMessage(null);
            }}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'register'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Novo Membro / Funcionário</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'team'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Equipe ({users.length})</span>
          </button>
        </div>

        {/* TAB 1: LOGIN */}
        {activeTab === 'login' && (
          <div className="flex flex-col gap-4 text-xs">
            {currentUser && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-cyan-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-xs">{currentUser.name}</span>
                      <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[10px] rounded font-bold border border-emerald-500/30">
                        Ativo
                      </span>
                    </div>
                    <span className="text-slate-400 text-[11px]">{currentUser.email} • {currentUser.role}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 border border-slate-700"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sair</span>
                </button>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
              {!waiting2FA ? (
                <>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>E-mail Corporativo</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Ex: usuario@startupgk.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Senha de Acesso</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Sua senha segura"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-9 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/40 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                    <Smartphone className="w-4 h-4" />
                    <span>Autenticação de Dois Fatores (2FA) Ativa</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Insira o código de 6 dígitos gerado pelo aplicativo autenticador do perfil <strong>{loginEmail}</strong>.
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value)}
                      placeholder="123456"
                      className="flex-1 bg-slate-900 border border-cyan-500 rounded-xl px-3 py-2 text-center text-lg font-mono font-bold tracking-widest text-cyan-300 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setTotpCode('123456')}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 font-medium"
                    >
                      Usar 123456
                    </button>
                  </div>
                </div>
              )}

              {loginError && (
                <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full mt-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>
                  {isSubmittingLogin
                    ? 'Verificando...'
                    : waiting2FA
                    ? 'Validar 2FA e Acessar'
                    : 'Acessar Sistema GK'}
                </span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: REGISTER NEW EMPLOYEE */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              Cadastre novos usuários, sócios ou funcionários para a equipe da Startup GK. O membro poderá acessar o sistema imediatamente com o e-mail e senha definidos.
            </div>

            {regSuccessMessage && (
              <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">{regSuccessMessage}</span>
              </div>
            )}

            {regError && (
              <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <UserIcon className="w-3 h-3 text-cyan-400" />
                  <span>Nome Completo *</span>
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ex: Carlos Mendes"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-cyan-400" />
                  <span>E-mail Corporativo *</span>
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="carlos@startupgk.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span>Senha de Acesso *</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-8 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-cyan-400" />
                  <span>Telefone / WhatsApp</span>
                </label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+55 11 99999-8888"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-cyan-400" />
                  <span>Cargo / Função</span>
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 text-xs"
                >
                  <option value="Fundador / CEO">Fundador / CEO</option>
                  <option value="Tech Lead / Dev">Tech Lead / Dev</option>
                  <option value="Full-Stack Developer">Full-Stack Developer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Gerente de Contas">Gerente de Contas</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-cyan-400" />
                  <span>Departamento</span>
                </label>
                <select
                  value={regDept}
                  onChange={(e) => setRegDept(e.target.value as Department)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 text-xs"
                >
                  <option value="Desenvolvimento Web">Desenvolvimento Web</option>
                  <option value="Design & UX">Design & UX</option>
                  <option value="Operações & Negócios">Operações & Negócios</option>
                  <option value="Marketing Digital">Marketing Digital</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200 block text-xs">Exigir Autenticação em Duas Etapas (2FA)</span>
                <span className="text-[11px] text-slate-400">Solicitar código autenticador além de login e senha</span>
              </div>
              <input
                type="checkbox"
                checked={regEnable2FA}
                onChange={(e) => setRegEnable2FA(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingRegister}
              className="w-full mt-2 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isSubmittingRegister ? 'Cadastrando...' : 'Cadastrar Funcionário na Startup GK'}</span>
            </button>
          </form>
        )}

        {/* TAB 3: TEAM MEMBERS DIRECTORY */}
        {activeTab === 'team' && (
          <div className="flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-semibold">
                {users.length} membros cadastrados no sistema
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <UserPlus className="w-3 h-3" />
                <span>Adicionar Membro</span>
              </button>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-[380px] pr-1">
              {users.map((user) => {
                const isCurrent = currentUser?.id === user.id;

                return (
                  <div
                    key={user.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                      isCurrent
                        ? 'bg-slate-950 border-cyan-500/60 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs truncate">{user.name}</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 text-[10px] rounded font-bold border border-cyan-500/30 shrink-0">
                              Você (Sessão Ativa)
                            </span>
                          )}
                          {user.twoFactorEnabled && (
                            <span className="px-1 py-0.2 bg-emerald-500/10 text-emerald-400 text-[9px] rounded font-mono border border-emerald-500/20 shrink-0">
                              2FA Ativo
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-[11px] truncate">{user.email}</p>
                        <p className="text-slate-500 text-[10px] truncate">{user.role} • {user.department}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isCurrent ? (
                        <>
                          <button
                            type="button"
                            onClick={() => switchUser(user.id)}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold transition-colors border border-slate-700"
                            title="Alternar para a sessão deste funcionário"
                          >
                            Alternar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Remover ${user.name} da equipe?`)) {
                                deleteUser(user.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Remover membro da equipe"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-1 text-cyan-400 text-[11px] font-semibold pr-2">
                          <Check className="w-3.5 h-3.5" />
                          <span>Conectado</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
