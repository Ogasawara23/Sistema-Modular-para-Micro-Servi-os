import React, { useState } from 'react';
import { 
  Lock, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Key, 
  UserCheck, 
  LogOut, 
  RefreshCw
} from 'lucide-react';
import { mockGoogleProfile } from '../../data/mockData';

export function GoogleLoginScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [copiedToken, setCopiedToken] = useState(false);
  const [activeAccount, setActiveAccount] = useState('account1');

  const accounts = {
    account1: mockGoogleProfile,
    account2: {
      token: 'ya29.b1BgI7TNCy0a4l9rZw5Mq2p1O8x7F6s5U4v3J2p0Q9b8T7e6G5h4I3k2L1m0N9o8C7w6D5y4A3b2B1s1E0g9H8i7K6l5M4n3',
      providerId: 'google.com (98237194018274019284)',
      emailVerificado: true,
      nomeGoogle: 'Dra. Carolina Mendes Lima',
      email: 'carolina.mendes@clinicaestetica.com',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
      escopos: ['openid', 'email', 'profile'],
      expiracao: '1 hora (renovação automática)',
      ultimoLogin: '2026-09-16 21:40:00 UTC-3'
    }
  };

  const profile = accounts[activeAccount];

  const handleCopyToken = () => {
    navigator.clipboard.writeText(profile.token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const handleGoogleLogin = (acc = 'account1') => {
    setActiveAccount(acc);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // =========================================================================
  // --- [INÍCIO DO PRINT: Tela de Login Google] ---
  // =========================================================================
  return (
    <div className="crud-container">
      {/* Cabeçalho */}
      <div className="crud-header">
        <div>
          <div className="crud-title-group">
            <span className="readonly-badge">
              <Lock size={12} /> Integração de Autenticação Externa (OAuth 2.0 / OpenID Connect)
            </span>
            <h2 className="crud-title">
              <ShieldCheck className="icon-highlight" size={24} />
              Tela de Login & Perfil Google SSO
            </h2>
          </div>
          <p className="crud-subtitle">
            Componente com botões de <strong>'Entrar com Google'</strong> e perfil mockado exibindo: 
            <strong> Token, Provider ID, Email Verificado, Nome Google</strong>.
          </p>
        </div>
      </div>

      <div className="login-preview-grid">
        {/* Lado Esquerdo: Área de Botões e Autenticação */}
        <div className="login-card-left">
          <div className="login-header-box">
            <div className="google-icon-wrapper">
              <svg viewBox="0 0 24 24" width="28" height="28">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.96 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold">Google Identity Services</h3>
            <p className="text-sub-sm">Autenticação federada sem senha para clientes e equipe.</p>
          </div>

          <div className="login-actions-box">
            {/* Botão Oficial Solicitado: 'Entrar com Google' */}
            <button 
              className="btn-google-sso"
              onClick={() => handleGoogleLogin('account1')}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.96 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Entrar com Google</span>
            </button>

            {/* Alternativa para testar outra conta mockada */}
            <button 
              className="btn-google-secondary"
              onClick={() => handleGoogleLogin(activeAccount === 'account1' ? 'account2' : 'account1')}
            >
              <RefreshCw size={15} /> Simular Login com Outra Conta
            </button>

            {isAuthenticated ? (
              <button className="btn-logout-test" onClick={handleLogout}>
                <LogOut size={15} /> Simular Logout
              </button>
            ) : (
              <div className="status-logged-out">
                Estado: <span>Desconectado. Clique no botão acima para autenticar.</span>
              </div>
            )}
          </div>

          <div className="oauth-specs">
            <h4 className="oauth-title">Parâmetros OAuth Configurados</h4>
            <div className="oauth-item">
              <span>Client ID:</span>
              <code>9128374-web.apps.googleusercontent.com</code>
            </div>
            <div className="oauth-item">
              <span>Redirect URI:</span>
              <code>https://saas-agenda.app/api/auth/callback/google</code>
            </div>
            <div className="oauth-item">
              <span>Fluxo:</span>
              <code>Authorization Code Flow + PKCE</code>
            </div>
          </div>
        </div>

        {/* Lado Direito: Perfil Mockado com os Dados Recebidos */}
        <div className="login-card-right">
          <div className="profile-header-strip">
            <div className="strip-title">
              <UserCheck size={18} className="text-success" />
              <span>Dados Recebidos do Provedor (OpenID Payload)</span>
            </div>
            <span className={`status-pill ${isAuthenticated ? 'active' : 'inactive'}`}>
              {isAuthenticated ? 'Sessão Ativa' : 'Não Autenticado'}
            </span>
          </div>

          {isAuthenticated ? (
            <div className="payload-content">
              {/* Foto, Nome Google e Email */}
              <div className="user-hero-card">
                <img src={profile.avatarUrl} alt="Avatar Google" className="profile-avatar-lg" />
                <div>
                  {/* Nome Google */}
                  <div className="field-group-row">
                    <span className="field-label-tag">Nome Google:</span>
                    <h3 className="profile-name-text">{profile.nomeGoogle}</h3>
                  </div>

                  <p className="profile-email-text">{profile.email}</p>

                  {/* Email Verificado */}
                  <div className="verified-badge-row">
                    <span className="field-label-tag">Email Verificado:</span>
                    <span className="badge badge-success">
                      <CheckCircle2 size={13} /> {profile.emailVerificado ? 'true (Verificado pelo Google)' : 'false'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Provider ID */}
              <div className="field-block">
                <div className="field-block-header">
                  <span className="field-label">Provider ID (Identificador do Provedor):</span>
                  <span className="provider-badge">Federated Identity</span>
                </div>
                <div className="field-value-box font-mono">
                  {profile.providerId}
                </div>
              </div>

              {/* Token */}
              <div className="field-block">
                <div className="field-block-header">
                  <span className="field-label">Token (Access Token / Bearer):</span>
                  <button className="btn-copy-token" onClick={handleCopyToken}>
                    {copiedToken ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                    {copiedToken ? 'Copiado!' : 'Copiar Token'}
                  </button>
                </div>
                <div className="token-box font-mono">
                  {profile.token}
                </div>
                <span className="token-hint">
                  Expirará em: {profile.expiracao} • Última emissão: {profile.ultimoLogin}
                </span>
              </div>

              {/* Escopos e Metadados */}
              <div className="scopes-grid">
                <div className="scope-box">
                  <span className="scope-label">Escopos Concedidos:</span>
                  <div className="scope-pills">
                    {profile.escopos.map(s => (
                      <span key={s} className="scope-pill">
                        <Key size={11} /> {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="scope-box">
                  <span className="scope-label">Integração Externa:</span>
                  <span className="scope-val">Google Cloud Identity Platform</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-profile-state">
              <Lock size={48} className="text-sub" />
              <h3>Nenhum perfil carregado</h3>
              <p>Clique em <strong>'Entrar com Google'</strong> ao lado para simular o recebimento do token e dos dados do usuário.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  // =========================================================================
  // --- [FIM DO PRINT] ---
  // =========================================================================
}
