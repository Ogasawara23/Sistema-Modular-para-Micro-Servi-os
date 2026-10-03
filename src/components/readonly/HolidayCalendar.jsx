import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Lock, 
  ChevronLeft, 
  ChevronRight, 
  AlertOctagon, 
  Globe, 
  Filter,
  Tag
} from 'lucide-react';
import { mockHolidays } from '../../data/mockData';

export function HolidayCalendar() {
  // Controle do mês exibido: padrão Setembro 2026 (ou navegação)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 8 = Setembro (0-indexed)
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeekLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Filtragem dos feriados externos
  const filteredHolidays = mockHolidays.filter(h => {
    if (typeFilter === 'ALL') return true;
    return h.tipoFeriado.toLowerCase().includes(typeFilter.toLowerCase());
  });

  // Mapeia feriados para consulta rápida por data YYYY-MM-DD
  const holidaysMap = {};
  filteredHolidays.forEach(h => {
    holidaysMap[h.dataFeriado] = h;
  });

  // Cálculo da grade do calendário do mês corrente
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarCells = [];
  // Espaços vazios antes do dia 1
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push({ empty: true, id: `empty-${i}` });
  }

  // Dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    const holiday = holidaysMap[dateStr];

    calendarCells.push({
      empty: false,
      day,
      dateStr,
      isHoliday: Boolean(holiday),
      holidayInfo: holiday
    });
  }

  // =========================================================================
  // --- [INÍCIO DO PRINT: Calendário de Feriados] ---
  // =========================================================================
  return (
    <div className="crud-container">
      {/* Cabeçalho */}
      <div className="crud-header">
        <div>
          <div className="crud-title-group">
            <span className="readonly-badge">
              <Lock size={12} /> Integração Externa de Feriados (API Febraban / BrasilAPI)
            </span>
            <h2 className="crud-title">
              <CalendarIcon className="icon-highlight" size={24} />
              Calendário de Feriados & Bloqueio de Agenda
            </h2>
          </div>
          <p className="crud-subtitle">
            Visualização de dados externos com: 
            <strong> Data do Feriado, Nome do Feriado, Tipo de Feriado</strong>. Dias com feriado são destacados como indisponíveis.
          </p>
        </div>

        <div className="gateway-pill calendar-sync">
          <Globe size={14} /> BrasilAPI Feriados Nacionais Sincronizados
        </div>
      </div>

      <div className="holiday-grid-layout">
        {/* Lado Esquerdo: Visualização do Calendário Mensal com Dias Indisponíveis Destacados */}
        <div className="calendar-card">
          <div className="calendar-nav-bar">
            <div>
              <h3 className="calendar-month-title">
                {monthNames[currentMonth]} <span className="text-sub">{currentYear}</span>
              </h3>
              <span className="text-sub-xs">Dias em vermelho representam feriados com atendimento suspenso</span>
            </div>

            <div className="calendar-nav-btns">
              <button className="btn-icon-subtle" onClick={handlePrevMonth} title="Mês Anterior">
                <ChevronLeft size={18} />
              </button>
              <button 
                className="btn-icon-subtle today-btn" 
                onClick={() => { setCurrentMonth(8); setCurrentYear(2026); }}
                title="Ir para Setembro 2026"
              >
                Hoje
              </button>
              <button className="btn-icon-subtle" onClick={handleNextMonth} title="Próximo Mês">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Cabeçalho dos Dias da Semana */}
          <div className="calendar-weekdays">
            {daysOfWeekLabels.map(d => (
              <div key={d} className="calendar-weekday-cell">{d}</div>
            ))}
          </div>

          {/* Grid dos Dias do Mês */}
          <div className="calendar-cells-grid">
            {calendarCells.map((cell, idx) => {
              if (cell.empty) {
                return <div key={`empty-${idx}`} className="calendar-day-cell empty" />;
              }

              return (
                <div 
                  key={cell.dateStr}
                  className={`calendar-day-cell ${cell.isHoliday ? 'holiday-unavailable' : 'available'}`}
                  onClick={() => cell.isHoliday && setSelectedHoliday(cell.holidayInfo)}
                  title={cell.isHoliday ? `${cell.holidayInfo.nomeFeriado} (${cell.holidayInfo.tipoFeriado}) - DIA INDISPONÍVEL` : `Dia ${cell.day} disponível`}
                >
                  <div className="day-number-row">
                    <span className="day-number">{cell.day}</span>
                    {cell.isHoliday && (
                      <span className="unavailable-indicator">
                        <AlertOctagon size={11} /> INDISPONÍVEL
                      </span>
                    )}
                  </div>

                  {cell.isHoliday ? (
                    <div className="holiday-cell-tag">
                      <span className="holiday-title-snippet">{cell.holidayInfo.nomeFeriado}</span>
                      <span className="holiday-type-snippet">{cell.holidayInfo.tipoFeriado}</span>
                    </div>
                  ) : (
                    <span className="day-available-hint">Disponível</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-box available-box" />
              <span>Dia Comercial / Agendamento Liberado</span>
            </div>
            <div className="legend-item">
              <div className="legend-box unavailable-box" />
              <span>Feriado Externo / Dia Indisponível (Sem agendamentos)</span>
            </div>
          </div>
        </div>

        {/* Lado Direito: Lista de Dados Externos de Feriados (Data, Nome, Tipo) */}
        <div className="holiday-list-card">
          <div className="holiday-list-header">
            <div>
              <h3 className="font-bold text-main flex items-center gap-2">
                <Globe size={18} className="text-primary" />
                Dados Externos de Feriados
              </h3>
              <p className="text-sub-xs">Lista completa puxada do serviço de calendário oficial</p>
            </div>

            <div className="holiday-filter-wrap">
              <Filter size={13} className="cell-icon" />
              <select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
                className="form-select-sm"
              >
                <option value="ALL">Todos os Tipos</option>
                <option value="Nacional">Nacional</option>
                <option value="Ponto Facultativo">Ponto Facultativo</option>
                <option value="Estadual">Estadual</option>
              </select>
            </div>
          </div>

          <div className="holiday-items-scroll">
            {filteredHolidays.map((h) => {
              const isCurrentSelected = selectedHoliday?.dataFeriado === h.dataFeriado;
              const isMonthMatch = h.dataFeriado.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`);

              return (
                <div 
                  key={h.dataFeriado}
                  className={`holiday-feed-item ${isCurrentSelected ? 'selected-feed' : ''} ${isMonthMatch ? 'highlight-month' : ''}`}
                  onClick={() => setSelectedHoliday(h)}
                >
                  <div className="holiday-feed-top">
                    <span className="holiday-date-badge font-mono">
                      {h.dataFeriado.split('-').reverse().join('/')}
                    </span>
                    <span className={`holiday-type-pill ${h.tipoFeriado.includes('Nacional') ? 'nacional' : h.tipoFeriado.includes('Facultativo') ? 'ponto-facultativo' : 'estadual'}`}>
                      <Tag size={10} /> {h.tipoFeriado}
                    </span>
                  </div>

                  <h4 className="holiday-name-text">{h.nomeFeriado}</h4>

                  <div className="holiday-status-row">
                    <span className="badge-blocked">
                      <AlertOctagon size={12} /> Dia Bloqueado na Agenda
                    </span>
                    {isMonthMatch && <span className="this-month-pill">Neste Mês</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
  // =========================================================================
  // --- [FIM DO PRINT] ---
  // =========================================================================
}
