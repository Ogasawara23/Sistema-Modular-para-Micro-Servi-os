import React, { useState } from 'react';
import { 
  Sparkles, 
  User, 
  Calendar, 
  Tag, 
  CreditCard, 
  CheckCircle2, 
  Send, 
  Clock, 
  Star, 
  Zap, 
  Gift, 
  ShieldCheck 
} from 'lucide-react';

// Template Methods (Padrões 3, 4 e 5)
import { BarberBookingProcessor, ClinicBookingProcessor } from '../patterns/templates/BookingProcessor';
import { SimpleReceiptGenerator, DetailedClinicalReceiptGenerator } from '../patterns/templates/ReceiptGenerator';
import { WhatsAppNotificationPipeline } from '../patterns/templates/NotificationPipeline';

// Strategies (Padrões 6, 7 e 8)
import { ProfessionalSelectionContext, ManualProfessionalStrategy, RoundRobinStrategy, FastestAvailableStrategy } from '../patterns/strategies/ProfessionalSelectionStrategy';
import { DiscountContext, NoDiscountStrategy, FirstVisitDiscountStrategy, VipSubscriptionDiscountStrategy } from '../patterns/strategies/DiscountStrategy';
import { PaymentContext, PixPaymentStrategy, CreditCardPaymentStrategy, DepositAdvancePaymentStrategy } from '../patterns/strategies/PaymentStrategy';

export function BookingFlow({ currentTenant, currentUser }) {
  // Estados da interface de agendamento
  const [selectedService, setSelectedService] = useState(currentTenant.services[0]);
  const [selectedDate, setSelectedDate] = useState('2026-09-18');
  const [selectedTime, setSelectedTime] = useState('14:30');

  // Estados dos Padrões Strategy
  const [professionalStrategyType, setProfessionalStrategyType] = useState('MANUAL');
  const [manualProfessional, setManualProfessional] = useState(currentTenant.professionals[0]);
  
  const [discountStrategyType, setDiscountStrategyType] = useState('NONE');
  const [paymentStrategyType, setPaymentStrategyType] = useState('PIX');

  // Estado do Modal de Confirmação
  const [bookingResult, setBookingResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleConfirmBooking = () => {
    // 1. Strategy 1 (Seleção de Profissional)
    let profStrat;
    if (professionalStrategyType === 'MANUAL') profStrat = new ManualProfessionalStrategy(manualProfessional);
    else if (professionalStrategyType === 'ROUND_ROBIN') profStrat = new RoundRobinStrategy();
    else profStrat = new FastestAvailableStrategy();
    const professionalContext = new ProfessionalSelectionContext(profStrat);
    const profResult = professionalContext.execute(currentTenant.professionals);

    // 2. Strategy 2 (Cálculo de Desconto)
    let discStrat;
    if (discountStrategyType === 'FIRST') discStrat = new FirstVisitDiscountStrategy();
    else if (discountStrategyType === 'VIP') discStrat = new VipSubscriptionDiscountStrategy();
    else discStrat = new NoDiscountStrategy();
    const discountContext = new DiscountContext(discStrat);

    // 3. Template Method 1 (Processamento do Agendamento)
    const bookingProcessor = currentTenant.type === 'BARBER' 
      ? new BarberBookingProcessor() 
      : new ClinicBookingProcessor();
    const bookingOutput = bookingProcessor.processBooking({
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      isPromoDay: false,
      hasInsurance: currentTenant.type === 'CLINIC'
    });

    const discountOutput = discountContext.apply(bookingOutput.finalPrice);

    // 4. Strategy 3 (Processamento de Pagamento)
    let payStrat;
    if (paymentStrategyType === 'PIX') payStrat = new PixPaymentStrategy();
    else if (paymentStrategyType === 'CARD') payStrat = new CreditCardPaymentStrategy();
    else payStrat = new DepositAdvancePaymentStrategy();
    const paymentContext = new PaymentContext(payStrat);
    const paymentOutput = paymentContext.execute(discountOutput.finalPrice);

    // 5. Template Method 2 (Geração de Recibo)
    const receiptGenerator = currentTenant.type === 'BARBER'
      ? new SimpleReceiptGenerator()
      : new DetailedClinicalReceiptGenerator();
    const receiptOutput = receiptGenerator.generate({
      tenantName: currentTenant.name,
      clientName: currentUser.name,
      serviceName: selectedService.name,
      professional: profResult.name,
      date: selectedDate,
      time: selectedTime,
      totalPrice: discountOutput.finalPrice,
      confirmationCode: bookingOutput.confirmationCode
    });

    // 6. Template Method 3 (Pipeline de Notificação)
    const notificationPipeline = new WhatsAppNotificationPipeline();
    const notificationOutput = notificationPipeline.send(currentUser, {
      serviceName: selectedService.name,
      date: selectedDate,
      time: selectedTime,
      confirmationCode: bookingOutput.confirmationCode
    });

    setBookingResult({
      confirmationCode: bookingOutput.confirmationCode,
      professional: profResult,
      discount: discountOutput,
      payment: paymentOutput,
      receipt: receiptOutput,
      notification: notificationOutput
    });
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Stepper Progress Visual */}
      <div className="stepper-container">
        <div className="stepper">
          <div className="step-item active">
            <div className="step-number">1</div>
            <span>Serviço</span>
          </div>
          <div className="step-item active">
            <div className="step-number">2</div>
            <span>Profissional & Data</span>
          </div>
          <div className="step-item active">
            <div className="step-number">3</div>
            <span>Pagamento</span>
          </div>
          <div className="step-item">
            <div className="step-number">4</div>
            <span>Confirmação</span>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="main-layout">
        <div>
          {/* Seção 1: Escolha do Serviço */}
          <div className="section-header">
            <h2 className="section-title">
              <Sparkles size={20} style={{ color: currentTenant.primaryColor }} />
              Selecione o Serviço
            </h2>
            <p className="section-subtitle">Escolha o atendimento desejado do catálogo ativo.</p>
          </div>
          <div className="services-grid">
            {currentTenant.services.map((srv) => (
              <div 
                key={srv.id} 
                className={`service-card ${selectedService?.id === srv.id ? 'selected' : ''}`}
                onClick={() => setSelectedService(srv)}
              >
                <div className="service-header">
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{srv.name}</h3>
                  <span className="service-price">R$ {srv.price}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                  <Clock size={13} /> {srv.duration}
                </div>
              </div>
            ))}
          </div>

          {/* Seção 2: Seleção de Profissional (Strategy 1) */}
          <div className="section-header">
            <h2 className="section-title">
              <User size={20} style={{ color: currentTenant.primaryColor }} />
              Alocação do Profissional
            </h2>
            <p className="section-subtitle">Defina o algoritmo de escolha do atendente/especialista.</p>
          </div>
          <div className="option-selector">
            <button 
              className={`option-btn ${professionalStrategyType === 'MANUAL' ? 'active' : ''}`}
              onClick={() => setProfessionalStrategyType('MANUAL')}
            >
              <User size={15} /> Escolha Manual
            </button>
            <button 
              className={`option-btn ${professionalStrategyType === 'ROUND_ROBIN' ? 'active' : ''}`}
              onClick={() => setProfessionalStrategyType('ROUND_ROBIN')}
            >
              <Zap size={15} /> Fila Equilibrada (Automático)
            </button>
            <button 
              className={`option-btn ${professionalStrategyType === 'FASTEST' ? 'active' : ''}`}
              onClick={() => setProfessionalStrategyType('FASTEST')}
            >
              <Clock size={15} /> Mais Rápido Disponível
            </button>
          </div>

          {professionalStrategyType === 'MANUAL' && (
            <div className="pro-grid">
              {currentTenant.professionals.map(p => (
                <div 
                  key={p} 
                  className={`pro-card ${manualProfessional === p ? 'selected' : ''}`}
                  onClick={() => setManualProfessional(p)}
                >
                  <div className="pro-avatar" style={{ background: currentTenant.primaryColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {p.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{p}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', color: '#fbbf24' }}>
                      <Star size={12} fill="#fbbf24" /> 4.9 (Disponível)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Seção 3: Data e Horário */}
          <div className="section-header">
            <h2 className="section-title">
              <Calendar size={20} style={{ color: currentTenant.primaryColor }} />
              Data & Horário do Atendimento
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={e => setSelectedDate(e.target.value)}
              style={{
                padding: '0.85rem 1rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'white',
                borderRadius: '14px',
                fontSize: '0.9rem'
              }}
            />
            <input 
              type="time" 
              value={selectedTime} 
              onChange={e => setSelectedTime(e.target.value)}
              style={{
                padding: '0.85rem 1rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'white',
                borderRadius: '14px',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Seção 4: Desconto (Strategy 2) */}
          <div className="section-header">
            <h2 className="section-title">
              <Tag size={20} style={{ color: currentTenant.primaryColor }} />
              Cupom & Benefícios
            </h2>
          </div>
          <div className="option-selector">
            <button 
              className={`option-btn ${discountStrategyType === 'NONE' ? 'active' : ''}`}
              onClick={() => setDiscountStrategyType('NONE')}
            >
              Sem Cupom
            </button>
            <button 
              className={`option-btn ${discountStrategyType === 'FIRST' ? 'active' : ''}`}
              onClick={() => setDiscountStrategyType('FIRST')}
            >
              <Gift size={15} /> Primeira Visita (-15%)
            </button>
            <button 
              className={`option-btn ${discountStrategyType === 'VIP' ? 'active' : ''}`}
              onClick={() => setDiscountStrategyType('VIP')}
            >
              <ShieldCheck size={15} /> Assinatura VIP (-30%)
            </button>
          </div>

          {/* Seção 5: Pagamento (Strategy 3) */}
          <div className="section-header">
            <h2 className="section-title">
              <CreditCard size={20} style={{ color: currentTenant.primaryColor }} />
              Forma de Pagamento
            </h2>
          </div>
          <div className="option-selector">
            <button 
              className={`option-btn ${paymentStrategyType === 'PIX' ? 'active' : ''}`}
              onClick={() => setPaymentStrategyType('PIX')}
            >
              Pix Instantâneo
            </button>
            <button 
              className={`option-btn ${paymentStrategyType === 'CARD' ? 'active' : ''}`}
              onClick={() => setPaymentStrategyType('CARD')}
            >
              Cartão de Crédito
            </button>
            <button 
              className={`option-btn ${paymentStrategyType === 'DEPOSIT' ? 'active' : ''}`}
              onClick={() => setPaymentStrategyType('DEPOSIT')}
            >
              Sinal Antecipado (30%)
            </button>
          </div>
        </div>

        {/* Sidebar Resumo do Checkout */}
        <aside>
          <div className="checkout-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Resumo da Reserva
            </h3>
            
            <div className="summary-row">
              <span>Estabelecimento</span>
              <strong style={{ color: 'white' }}>{currentTenant.name}</strong>
            </div>
            <div className="summary-row">
              <span>Serviço</span>
              <strong style={{ color: 'white' }}>{selectedService?.name}</strong>
            </div>
            <div className="summary-row">
              <span>Data e Hora</span>
              <strong style={{ color: 'white' }}>{selectedDate} às {selectedTime}</strong>
            </div>

            <div className="summary-row total">
              <span>Valor Total</span>
              <span>R$ {selectedService ? Number(selectedService.price).toFixed(2) : '0.00'}</span>
            </div>

            <button className="btn-primary" onClick={handleConfirmBooking}>
              <CheckCircle2 size={20} />
              Confirmar Reserva
            </button>
          </div>
        </aside>
      </div>

      {/* Modal de Sucesso com o Recibo Gerado */}
      {isModalOpen && bookingResult && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <CheckCircle2 size={52} style={{ color: 'var(--success)', margin: '0 auto 0.5rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Reserva Confirmada!</h2>
              <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem' }}>Código da Reserva: {bookingResult.confirmationCode}</p>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)', background: 'var(--bg-main)', padding: '1rem', borderRadius: '14px', marginBottom: '1rem' }}>
              <p style={{ marginBottom: '0.3rem' }}><strong style={{ color: 'white' }}>Profissional:</strong> {bookingResult.professional.name} ({bookingResult.professional.method})</p>
              <p style={{ marginBottom: '0.3rem' }}><strong style={{ color: 'white' }}>Desconto:</strong> {bookingResult.discount.label}</p>
              <p><strong style={{ color: 'white' }}>Pagamento:</strong> {bookingResult.payment.method} ({bookingResult.payment.details})</p>
            </div>

            {/* Recibo gerado pelo Template Method 2 */}
            <div className="receipt-paper">
              {bookingResult.receipt.fullText}
            </div>

            {/* Notificação enviada pelo Template Method 3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#38bdf8', marginBottom: '1.5rem' }}>
              <Send size={15} />
              <span>{bookingResult.notification.status}</span>
            </div>

            <button className="btn-primary" style={{ margin: 0 }} onClick={() => setIsModalOpen(false)}>
              Concluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
