import React, { useState } from 'react';
import { initialAppointments, initialServices, initialClients } from '../../data/mockData';
import { 
  FileText, 
  User, 
  Scissors, 
  Calendar, 
  Percent, 
  ShieldCheck, 
  QrCode, 
  Printer, 
  Send, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  BadgePercent,
  Copy,
  Info
} from 'lucide-react';

export function SE01Receipt({ currentTenant }) {
  // 1. Estado para seleção de atendimento
  const [selectedAppId, setSelectedAppId] = useState(initialAppointments[0].id);
  // 2. Estado para estratégia de desconto
  const [discountType, setDiscountType] = useState('NONE'); // NONE | FIRST | VIP
  // 3. Estado para política de cobrança de sinal
  const [paymentPolicy, setPaymentPolicy] = useState('DEPOSIT_20'); // DEPOSIT_20 | FULL_100
  // 4. Estado de envio/impressão
  const [copied, setCopied] = useState(false);
  const [waSent, setWaSent] = useState(false);

  const selectedApp = initialAppointments.find(a => a.id === selectedAppId) || initialAppointments[0];
  const selectedService = initialServices.find(s => s.nomeServico === selectedApp.servico) || initialServices[0];
  const selectedClient = initialClients.find(c => c.nome === selectedApp.cliente) || initialClients[0];

  // Cálculos Derivados (Processamento Matemático de SE)
  const basePrice = selectedService.preco;
  const discountPerc = discountType === 'FIRST' ? 15 : discountType === 'VIP' ? 30 : 0;
  const discountVal = (basePrice * discountPerc) / 100;
  const netServicePrice = basePrice - discountVal;

  const depositRate = paymentPolicy === 'DEPOSIT_20' ? 0.20 : 1.0;
  const nowPaid = netServicePrice * depositRate;
  const remainingBalance = netServicePrice - nowPaid;

  const issTax = netServicePrice * 0.05; // 5% ISS municipal
  const gatewayFee = nowPaid * 0.0199; // 1.99% taxa de processamento
  const receiptHash = `REC-${selectedApp.id.replace('AGD-', '')}-2026-SHA256-${Math.abs(Math.sin(selectedApp.id.length) * 100000).toFixed(0)}`;

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(receiptHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateWhatsApp = () => {
    setWaSent(true);
    setTimeout(() => setWaSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Ficha Técnica APF */}
      <div className="glass-card p-5 rounded-tenant border border-primary/30 bg-primary/5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-text">
              SE-01
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-tenantText-muted">
              Saída Externa (IFPUG)
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-tenantText-muted">Responsável:</span>
            <span className="font-bold text-tenantText-main px-2 py-0.5 rounded bg-surface-dim border border-surface-border">
              Membro 1 (Arthur Major)
            </span>
            <span className="font-bold text-emerald-500 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
              Alta • 7 PFs
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <strong className="text-tenantText-main block mb-1">ALIs Referenciados (4 ARs):</strong>
            <ul className="text-tenantText-muted space-y-0.5 list-disc list-inside">
              <li><code className="text-primary font-mono">ALI_CLIENTES</code> (Cadastro & Contato)</li>
              <li><code className="text-primary font-mono">ALI_SERVICOS</code> (Preço & Categoria)</li>
              <li><code className="text-primary font-mono">ALI_AGENDAMENTOS</code> (Data & Status)</li>
              <li><code className="text-primary font-mono">ALI_TENANTS</code> (Regras do Negócio)</li>
            </ul>
          </div>
          <div>
            <strong className="text-tenantText-main block mb-1">Itens de Dados (14 DERs):</strong>
            <p className="text-tenantText-muted leading-relaxed">
              ID Recibo, Razão Social, Nome Cliente, Email, Nome Serviço, Profissional, Data/Hora, Preço Base, % Desconto, Valor Desconto, Valor Sinal, Saldo Devedor, ISS Retido, Hash Autenticação.
            </p>
          </div>
          <div>
            <strong className="text-tenantText-main block mb-1">Cálculo & Lógica Matemática:</strong>
            <p className="text-tenantText-muted leading-relaxed">
              Cálculo de desconto por Strategy (<code className="text-xs text-amber-400">-15% / -30%</code>), derivação de sinal (<code className="text-xs text-amber-400">20% vs 100%</code>), apuração de ISS 5% e geração de Hash criptográfico.
            </p>
          </div>
        </div>
      </div>

      {/* Interface Interativa com as 5 Funcionalidades */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna de Controles Interativos (Funcionalidades 1 a 4) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="glass-card p-5 rounded-tenant border border-surface-border space-y-4">
            <h3 className="text-base font-bold font-heading text-tenantText-main flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Parâmetros de Emissão do Comprovante
            </h3>

            {/* Funcionalidade 1: Seleção de Atendimento */}
            <div>
              <label className="text-xs font-semibold text-tenantText-muted block mb-1.5">
                1. Selecionar Agendamento Cadastrado no BD:
              </label>
              <select
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-tenant bg-surface-dim border border-surface-border text-tenantText-main focus:outline-none focus:border-primary"
              >
                {initialAppointments.map((app) => (
                  <option key={app.id} value={app.id}>
                    [{app.id}] {app.cliente} — {app.servico} ({app.dataHora.replace('T', ' ')})
                  </option>
                ))}
              </select>
            </div>

            {/* Funcionalidade 2: Aplicação Dinâmica de Estratégia de Desconto */}
            <div>
              <label className="text-xs font-semibold text-tenantText-muted block mb-1.5">
                2. Estratégia de Desconto (GoF Strategy):
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDiscountType('NONE')}
                  className={`py-2 px-3 text-xs font-semibold rounded-tenant border transition-all ${
                    discountType === 'NONE'
                      ? 'bg-primary text-primary-text border-primary'
                      : 'bg-surface-dim/40 border-surface-border text-tenantText-muted hover:text-tenantText-main'
                  }`}
                >
                  Padrão (0%)
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType('FIRST')}
                  className={`py-2 px-3 text-xs font-semibold rounded-tenant border transition-all ${
                    discountType === 'FIRST'
                      ? 'bg-primary text-primary-text border-primary'
                      : 'bg-surface-dim/40 border-surface-border text-tenantText-muted hover:text-tenantText-main'
                  }`}
                >
                  1ª Visita (-15%)
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType('VIP')}
                  className={`py-2 px-3 text-xs font-semibold rounded-tenant border transition-all ${
                    discountType === 'VIP'
                      ? 'bg-primary text-primary-text border-primary'
                      : 'bg-surface-dim/40 border-surface-border text-tenantText-muted hover:text-tenantText-main'
                  }`}
                >
                  Plano VIP (-30%)
                </button>
              </div>
            </div>

            {/* Funcionalidade 3: Alternador de Regra de Cobrança / Sinal */}
            <div>
              <label className="text-xs font-semibold text-tenantText-muted block mb-1.5">
                3. Política de Cobrança Multi-Tenant:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentPolicy('DEPOSIT_20')}
                  className={`py-2 px-3 text-xs font-semibold rounded-tenant border transition-all text-left ${
                    paymentPolicy === 'DEPOSIT_20'
                      ? 'bg-primary text-primary-text border-primary'
                      : 'bg-surface-dim/40 border-surface-border text-tenantText-muted hover:text-tenantText-main'
                  }`}
                >
                  <div className="font-bold">Sinal de 20%</div>
                  <div className="text-[10px] opacity-80">Saldo residual no balcão</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentPolicy('FULL_100')}
                  className={`py-2 px-3 text-xs font-semibold rounded-tenant border transition-all text-left ${
                    paymentPolicy === 'FULL_100'
                      ? 'bg-primary text-primary-text border-primary'
                      : 'bg-surface-dim/40 border-surface-border text-tenantText-muted hover:text-tenantText-main'
                  }`}
                >
                  <div className="font-bold">Integral 100%</div>
                  <div className="text-[10px] opacity-80">Quitação total antecipada</div>
                </button>
              </div>
            </div>

            {/* Funcionalidade 4: Apuração de Encargos Fiscais e Gateway */}
            <div className="p-3.5 rounded-tenant bg-surface-dim/60 border border-surface-border space-y-2 text-xs">
              <span className="font-bold text-tenantText-main flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                4. Memória de Cálculo Tributário e Retenção (Dados Derivados)
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-tenantText-muted">
                <div>Valor Base do Serviço: <span className="font-mono text-tenantText-main font-semibold">R$ {basePrice.toFixed(2)}</span></div>
                <div>Desconto Calculado: <span className="font-mono text-emerald-500 font-semibold">- R$ {discountVal.toFixed(2)} ({discountPerc}%)</span></div>
                <div>ISS Estimado (5%): <span className="font-mono text-tenantText-main font-semibold">R$ {issTax.toFixed(2)}</span></div>
                <div>Taxa Gateway (1.99%): <span className="font-mono text-tenantText-main font-semibold">R$ {gatewayFee.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna do Cupom / Recibo Renderizado (Funcionalidade 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-6 rounded-tenant border border-surface-border font-mono text-xs space-y-3 bg-surface-dim/90 shadow-xl relative">
            {/* Header Recibo Térmico */}
            <div className="text-center border-b border-dashed border-surface-border pb-3">
              <div className="text-sm font-bold uppercase tracking-wider text-tenantText-main">
                {currentTenant?.name || 'SaaS Multi-Tenant'}
              </div>
              <div className="text-[10px] text-tenantText-muted">COMPROVANTE DE AGENDAMENTO & RECIBO FISCAL</div>
              <div className="text-[10px] text-tenantText-muted">DOC: {receiptHash.slice(0, 18)}</div>
            </div>

            {/* Dados do Cliente e Procedimento */}
            <div className="space-y-1.5 text-[11px] border-b border-dashed border-surface-border pb-3">
              <div className="flex justify-between">
                <span className="text-tenantText-muted">CLIENTE:</span>
                <span className="font-bold text-tenantText-main">{selectedClient.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tenantText-muted">TELEFONE:</span>
                <span className="text-tenantText-main">{selectedClient.telefone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tenantText-muted">SERVIÇO:</span>
                <span className="font-bold text-tenantText-main">{selectedService.nomeServico}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tenantText-muted">DATA/HORA:</span>
                <span className="text-tenantText-main">{selectedApp.dataHora.replace('T', ' às ')}</span>
              </div>
            </div>

            {/* Breakdown de Valores */}
            <div className="space-y-1 text-[11px] border-b border-dashed border-surface-border pb-3">
              <div className="flex justify-between">
                <span className="text-tenantText-muted">VALOR TABELA:</span>
                <span className="text-tenantText-main">R$ {basePrice.toFixed(2)}</span>
              </div>
              {discountPerc > 0 && (
                <div className="flex justify-between text-emerald-500">
                  <span>DESCONTO ({discountPerc}%):</span>
                  <span>- R$ {discountVal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-tenantText-main pt-1">
                <span>VALOR FINAL DO SERVIÇO:</span>
                <span>R$ {netServicePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-primary font-bold pt-1 border-t border-surface-border">
                <span>VALOR COBRADO AGORA:</span>
                <span className="text-sm">R$ {nowPaid.toFixed(2)}</span>
              </div>
              {remainingBalance > 0 && (
                <div className="flex justify-between text-amber-500 text-[10px]">
                  <span>SALDO NO BALCÃO:</span>
                  <span>R$ {remainingBalance.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Autenticação e Protocolo Hash */}
            <div className="text-center pt-1 space-y-2">
              <div className="text-[10px] text-tenantText-muted flex items-center justify-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-primary" />
                <span>HASH DE AUTENTICAÇÃO:</span>
              </div>
              <div className="p-1.5 rounded bg-surface-dim border border-surface-border text-[9px] break-all select-all flex items-center justify-between">
                <span className="font-mono text-tenantText-main">{receiptHash}</span>
                <button onClick={handleCopyHash} className="p-1 text-primary hover:text-primary-hover">
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              {copied && <span className="text-[10px] text-emerald-500 font-sans block">Hash copiado!</span>}
            </div>

            {/* Funcionalidade 5: Ações de Exportação e Disparo */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-border font-sans">
              <button
                type="button"
                onClick={() => window.print()}
                className="py-2 px-3 rounded-tenant bg-surface-dim hover:bg-surface-border text-tenantText-main border border-surface-border font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Imprimir Cupom
              </button>
              <button
                type="button"
                onClick={handleSimulateWhatsApp}
                className="py-2 px-3 rounded-tenant bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" /> {waSent ? 'Enviado!' : 'Via WhatsApp'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
