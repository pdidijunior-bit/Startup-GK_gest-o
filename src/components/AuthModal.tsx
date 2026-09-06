import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, User as UserIcon, Mail, Key, CheckCircle, Smartphone, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, verify2FA, registerAccount, users } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<number>(1);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('sergio@startupgk.com');
  const [loginPass, setLoginPass] = useState('gk@pass2026');
  const [totpCode, setTotpCode] = useState('');
  const [waiting2FA, setWaiting2FA] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register multi-step form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Full-Stack Developer');
  const [regDept, setRegDept] = useState<'Desenvolvimento Web' | 'Design & UX' | 'Operações & Negócios' | 'Marketing Digital'>('Desenvolvimento Web');
  
  // Step 2
  const [regPass, setRegPass] = useState('');
  const [regPassConfirm, setRegPassConfirm] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [permissionLevel, setPermissionLevel] = useState('Desenvolvedor Pleno/Sênior');

  // Step 3 (2FA)
  const [regTotpTest, setRegTotpTest] = useState('');
  const [recoveryCodesSaved, setRecoveryCodesSaved] = useState(false);

  // Step 4 (NDA)
  const [ndaAccepted, setNdaAccepted] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (waiting2FA) {
      const ok = verify2FA(totpCode);
      if (ok) {
        onClose();
      } else {
        setLoginError('Código 2FA incorreto. Use 123456 para testes de homologação.');
      }
      return;
    }

    const res = login(loginEmail, loginPass);
    if (res.requires2fa) {
      setWaiting2FA(true);
    } else if (res.success) {
      onClose();
    } else {
      setLoginError(res.error || 'Credenciais inválidas.');
    }
  };

  const handleQuickSelectUser = (userEmail: string) => {
    setLoginEmail(userEmail);
    setLoginPass('gk@pass2026');
    setWaiting2FA(false);
  };

  const handleRegisterNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!regName || !regEmail) return;
      setStep(2);
    } else if (step === 2) {
      if (!regPass || regPass !== regPassConfirm) {
        alert('As senhas não coincidem ou são muito curtas.');
        return;
      }
      if (inviteCode !== 'GK-TEAM-2026' && inviteCode !== 'GK2026' && inviteCode !== 'STARTUP-GK') {
        alert('Código de Convite de Segurança GK inválido. Use "GK-TEAM-2026" para validar.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!recoveryCodesSaved) {
        alert('Por favor, marque a caixa confirmando que salvou os códigos de recuperação de 2FA.');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (!ndaAccepted) {
        alert('É obrigatório aceitar o Termo de Sigilo & NDA interno da Startup GK.');
        return;
      }
      // Register account
      registerAccount({
        name: regName,
        email: regEmail,
        phone: regPhone,
        role: regRole,
        department: regDept,
        twoFactorEnabled: true
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-lg">
              GK
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Startup GK • Controle de Acesso</h3>
              <p className="text-xs text-slate-400">Portal Privado e Seguro de Gestão de TI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-xs font-semibold px-2 py-1"
          >
            Fechar
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setWaiting2FA(false);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Entrar na Equipe GK (Login)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setStep(1);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cadastrar Novo Membro (4 Passos)
          </button>
        </div>

        {/* LOGIN MODE */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5 text-sm">
            {!waiting2FA ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" /> E-mail Corporativo GK
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="seu.nome@startupgk.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> Senha Segura
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm"
                  />
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs flex flex-col gap-1.5">
                  <span className="text-slate-400 font-semibold">Acesso Rápido para Demonstração:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {users.slice(0, 3).map((u) => (
                      <button
                        type="button"
                        key={u.id}
                        onClick={() => handleQuickSelectUser(u.email)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-[11px] border border-slate-700 transition-colors"
                      >
                        {u.name} ({u.role})
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/40 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <Smartphone className="w-4 h-4" /> Autenticação de Dois Fatores (2FA) Ativa
                </div>
                <p className="text-xs text-slate-300">
                  Insira o código de 6 dígitos gerado pelo seu aplicativo autenticador (Google Authenticator / Authy) para o perfil de <strong>{loginEmail}</strong>.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    placeholder="Ex: 123456"
                    className="flex-1 bg-slate-900 border border-cyan-500 rounded-xl px-3 py-2.5 text-center text-lg font-mono font-bold tracking-widest text-cyan-300 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setTotpCode('123456')}
                    className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 font-medium"
                    title="Preencher código de teste 123456"
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
              className="w-full mt-2 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              {waiting2FA ? 'Confirmar 2FA e Acessar Portal' : 'Autenticar na Startup GK'}
            </button>
          </form>
        )}

        {/* MULTI-STEP REGISTRATION */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterNext} className="flex flex-col gap-4 text-sm">
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span className={`font-semibold ${step >= 1 ? 'text-cyan-400' : ''}`}>1. Identificação</span>
              <span className="text-slate-600">→</span>
              <span className={`font-semibold ${step >= 2 ? 'text-cyan-400' : ''}`}>2. Credenciais & Convite</span>
              <span className="text-slate-600">→</span>
              <span className={`font-semibold ${step >= 3 ? 'text-cyan-400' : ''}`}>3. 2FA Obrigatório</span>
              <span className="text-slate-600">→</span>
              <span className={`font-semibold ${step >= 4 ? 'text-cyan-400' : ''}`}>4. NDA TI</span>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                  <UserIcon className="w-4 h-4 text-cyan-400" /> Passo 1: Informações Profissionais
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ex: Rafael Oliveira"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail Corporativo *</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="rafael@startupgk.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp de Contato</label>
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+55 11 99999-8888"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Cargo Técnico</label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Full-Stack Developer">Full-Stack Developer</option>
                      <option value="Tech Lead / Dev">Tech Lead / Dev</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="Gerente de Contas">Gerente de Contas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Departamento</label>
                    <select
                      value={regDept}
                      onChange={(e) => setRegDept(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Desenvolvimento Web">Desenvolvimento Web</option>
                      <option value="Design & UX">Design & UX</option>
                      <option value="Operações & Negócios">Operações & Negócios</option>
                      <option value="Marketing Digital">Marketing Digital</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-cyan-400" /> Passo 2: Credenciais & Token Privado GK
                </h4>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Senha de Acesso *</label>
                    <input
                      type="password"
                      required
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Confirmar Senha *</label>
                    <input
                      type="password"
                      required
                      value={regPassConfirm}
                      onChange={(e) => setRegPassConfirm(e.target.value)}
                      placeholder="Repita a senha"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/30">
                  <label className="block text-xs font-semibold text-amber-300 mb-1 flex items-center justify-between">
                    <span>Código de Convite de Segurança GK *</span>
                    <button
                      type="button"
                      onClick={() => setInviteCode('GK-TEAM-2026')}
                      className="text-[10px] text-cyan-400 hover:underline"
                    >
                      Preencher GK-TEAM-2026
                    </button>
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2">
                    Como este sistema é estritamente privado da equipe da Startup GK, é exigido o token mestre corporativo.
                  </p>
                  <input
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="Ex: GK-TEAM-2026"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-amber-300 font-mono font-bold text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nível de Permissão Inicial</label>
                  <select
                    value={permissionLevel}
                    onChange={(e) => setPermissionLevel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Desenvolvedor Pleno/Sênior">Desenvolvedor Pleno/Sênior (Código e Projetos)</option>
                    <option value="Designer de Interfaces">Designer de Interfaces (Logotipos e Landing Pages)</option>
                    <option value="Gestor de Contas & CRM">Gestor de Contas & CRM (Contatos e Negociações)</option>
                    <option value="Administrador Geral">Administrador Geral GK (Acesso Total)</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-cyan-400" /> Passo 3: Ativação de Autenticação em Duas Etapas (2FA)
                </h4>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="w-20 h-20 bg-white p-1 rounded-lg flex items-center justify-center shrink-0">
                    {/* SVG QR Code representation */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <rect width="100" height="100" fill="white" />
                      <rect x="10" y="10" width="30" height="30" fill="black" />
                      <rect x="15" y="15" width="20" height="20" fill="white" />
                      <rect x="20" y="20" width="10" height="10" fill="black" />
                      <rect x="60" y="10" width="30" height="30" fill="black" />
                      <rect x="65" y="15" width="20" height="20" fill="white" />
                      <rect x="70" y="20" width="10" height="10" fill="black" />
                      <rect x="10" y="60" width="30" height="30" fill="black" />
                      <rect x="15" y="65" width="20" height="20" fill="white" />
                      <rect x="20" y="70" width="10" height="10" fill="black" />
                      <rect x="50" y="50" width="10" height="10" fill="black" />
                      <rect x="70" y="70" width="15" height="15" fill="black" />
                    </svg>
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-200">Chave Secreta TOTP:</p>
                    <code className="bg-slate-900 text-cyan-300 px-2 py-1 rounded font-mono text-[11px] block mt-1">
                      GK-AUTH-TOTP-SECRET-992
                    </code>
                    <p className="text-slate-400 text-[10px] mt-1">
                      Escaneie no Google Authenticator ou Microsoft Authenticator.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <span className="font-semibold text-slate-300 block mb-1">Códigos de Recuperação de Emergência:</span>
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] text-slate-400">
                    <span className="bg-slate-900 px-2 py-1 rounded">GK-8812-4011</span>
                    <span className="bg-slate-900 px-2 py-1 rounded">GK-3392-1084</span>
                    <span className="bg-slate-900 px-2 py-1 rounded">GK-7729-5510</span>
                    <span className="bg-slate-900 px-2 py-1 rounded">GK-9041-3327</span>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={recoveryCodesSaved}
                    onChange={(e) => setRecoveryCodesSaved(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Confirmo que salvei meus códigos de recuperação com segurança</span>
                </label>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-cyan-400" /> Passo 4: Termo de Sigilo de TI & NDA
                </h4>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 max-h-36 overflow-y-auto leading-relaxed">
                  <p className="font-semibold text-white mb-1">TERMO DE CONFIDENCIALIDADE E CÓDIGO-FONTE DA STARTUP GK:</p>
                  <p className="mb-2">
                    1. Todo código-fonte desenvolvido para aplicativos web, sites institucionais e páginas publicitárias de clientes da Startup GK é estritamente confidencial.
                  </p>
                  <p className="mb-2">
                    2. É vedada a divulgação não autorizada de dados de clientes, credenciais de banco de dados ou pipelines de conversão de anúncios.
                  </p>
                  <p>
                    3. O acesso a este portal de gestão é pessoal, intransferível e monitorado por logs de auditoria criptografados.
                  </p>
                </div>

                <label className="flex items-center gap-2 text-xs text-cyan-300 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={ndaAccepted}
                    onChange={(e) => setNdaAccepted(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Li e aceito os termos do Acordo de Confidencialidade da Startup GK</span>
                </label>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="inline-flex items-center gap-1 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20"
              >
                {step === 4 ? 'Concluir Cadastro & Acessar GK' : 'Próximo Passo'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
