import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Lock,
  Mail,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Phone,
  Briefcase,
  Building2,
  LogIn,
  UserPlus,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { UserRole, Department, User } from '../types';

export const LoginScreen: React.FC = () => {
  const { login, registerAccount, verify2FA } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [waiting2FA, setWaiting2FA] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regRole, setRegRole] = useState<UserRole>('Tech Lead / Dev');
  const [regDept, setRegDept] = useState<Department>('Desenvolvimento Web');
  const [regPhone, setRegPhone] = useState('');
  const [regEnable2FA, setRegEnable2FA] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (waiting2FA) {
      if (!totpCode.trim()) {
        setLoginError('Digite o código de 6 dígitos de autenticação.');
        return;
      }
      const verified = verify2FA(totpCode.trim());
      if (!verified) {
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
      const result = await login(loginEmail.trim(), loginPassword.trim());
      if (!result.success) {
        setLoginError(result.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
      } else if (result.requires2fa) {
        setWaiting2FA(true);
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Falha ao autenticar. Tente novamente.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Preencha todos os campos obrigatórios (Nome, E-mail e Senha).');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('A senha de acesso deve possuir pelo menos 6 caracteres.');
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
        true // Auto-login immediately
      );

      if (!result.success) {
        setRegError(result.error || 'Não foi possível cadastrar a conta.');
      }
    } catch (err: any) {
      setRegError(err?.message || 'Erro no cadastro de funcionário.');
    } finally {
      setIsSubmittingRegister(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Container */}
      <div className="w-full max-w-md relative z-10 flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-cyan-500/40 p-2.5 flex items-center justify-center shadow-xl shadow-cyan-500/10">
            <img
              src="/logo.png"
              alt="Startup GK"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                STARTUP GK
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                PORTAL
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Plataforma de Gestão Integrada & Projetos
            </p>
          </div>
        </div>

        {/* Card Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Tab Navigation */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setLoginError(null);
                setWaiting2FA(false);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'login'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setRegError(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'register'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Cadastrar Membro</span>
            </button>
          </div>

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              {loginError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-3 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {!waiting2FA ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>E-mail Corporativo</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="usuario@empresa.com"
                      autoFocus
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Senha de Acesso</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                        title={showLoginPassword ? 'Ocultar senha' : 'Ver senha'}
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingLogin}
                    className="mt-2 w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
                  >
                    {isSubmittingLogin ? (
                      <span>Autenticando...</span>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Acessar o Sistema</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 py-2">
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 text-xs text-cyan-300 flex items-start gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Esta conta possui Verificação em Duas Etapas (2FA). Insira o token de segurança (código de 6 dígitos):</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Código de 6 Dígitos
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="w-full tracking-widest text-center text-xl font-mono bg-slate-950 border border-cyan-500 rounded-xl py-2.5 text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Código 2FA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWaiting2FA(false)}
                    className="text-xs text-slate-400 hover:text-white underline text-center"
                  >
                    Voltar para o e-mail e senha
                  </button>
                </div>
              )}
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3.5">
              {regError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-3 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Nome Completo *</span>
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Nome do colaborador"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>E-mail Corporativo *</span>
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="nome@startupgk.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Senha de Acesso *</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-9 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Cargo</span>
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Fundador / CEO">Fundador / CEO</option>
                    <option value="Tech Lead / Dev">Tech Lead / Dev</option>
                    <option value="Full-Stack Developer">Full-Stack Developer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Gerente de Projetos">Gerente de Projetos</option>
                    <option value="Consultor Comercial">Consultor Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Departamento</span>
                  </label>
                  <select
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value as Department)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Desenvolvimento Web">Desenvolvimento Web</option>
                    <option value="Design & UX">Design & UX</option>
                    <option value="Operações & Negócios">Operações & Negócios</option>
                    <option value="Atendimento ao Cliente">Atendimento ao Cliente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Telefone / WhatsApp (Opcional)</span>
                </label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+55 11 99999-9999"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer mt-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={regEnable2FA}
                  onChange={(e) => setRegEnable2FA(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 w-4 h-4 bg-slate-900"
                />
                <span className="text-xs text-slate-300">
                  Habilitar Verificação em Duas Etapas (2FA) para maior segurança
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmittingRegister}
                className="mt-1 w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
              >
                {isSubmittingRegister ? (
                  <span>Cadastrando...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Cadastrar & Acessar Sistema</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Security Badges */}
        <div className="flex items-center justify-center gap-4 text-slate-500 text-[11px]">
          <div className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-cyan-400/70" />
            <span>Criptografia SSL/TLS</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400/70" />
            <span>Firebase Auth Real-time</span>
          </div>
        </div>
      </div>
    </div>
  );
};
