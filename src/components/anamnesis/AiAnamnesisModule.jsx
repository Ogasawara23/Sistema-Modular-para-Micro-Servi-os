import React, { useState } from 'react';
import { Sparkles, Brain, Cpu, FileCheck, RefreshCw, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SimulatedAPI } from '../../mocks/SimulatedAPI';

/**
 * AiAnamnesisModule Component
 * Dynamic AI-driven Health / Pre-assessment questionnaire generator.
 * Designed to be lazily imported via React.lazy() and mounted only when hasAiAnamnesis: true.
 */
export default function AiAnamnesisModule() {
  const [patientName, setPatientName] = useState('Ana Clara Souza');
  const [symptoms, setSymptoms] = useState('Queixa recorrente de insônia, ansiedade no trabalho e dores tensionais na nuca.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReport, setAiReport] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!patientName || !symptoms) return;

    setIsGenerating(true);
    try {
      const result = await SimulatedAPI.generateAiAnamnesis(patientName, symptoms);
      setAiReport(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-card p-6 rounded-tenant border border-surface-border bg-gradient-to-r from-primary-light/50 to-transparent">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-tenant bg-primary text-primary-text shadow-tenant">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-tenantText-main flex items-center gap-2">
              Anamnese Inteligente por IA Generativa
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-semibold border border-emerald-500/30">
                GPT-4o Medical Assist
              </span>
            </h2>
            <p className="text-xs text-tenantText-muted">
              Gere questionários preditivos e resumos analíticos automatizados antes de cada consulta.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5 glass-card p-6 rounded-tenant border border-surface-border space-y-4">
          <h3 className="font-bold font-heading text-base text-tenantText-main flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" /> Parâmetros de Entrada
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-tenantText-muted mb-1">
                Nome do Paciente / Cliente
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-tenant bg-surface-dim/40 border border-surface-border text-tenantText-main focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans"
                placeholder="Ex: Ana Clara Souza"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-tenantText-muted mb-1">
                Sintomas, Queixas ou Histórico Inicial
              </label>
              <textarea
                rows={4}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full p-3.5 rounded-tenant bg-surface-dim/40 border border-surface-border text-tenantText-main focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans"
                placeholder="Descreva brevemente o motivo do atendimento..."
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 rounded-tenant bg-primary text-primary-text font-bold hover:bg-primary-hover transition-colors shadow-tenant text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processando via LLM...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Gerar Anamnese com IA
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Output Column */}
        <div className="lg:col-span-7 glass-card p-6 rounded-tenant border border-surface-border space-y-4">
          <h3 className="font-bold font-heading text-base text-tenantText-main flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-500" /> Relatório Preditivo de Anamnese
            </span>
            {aiReport && (
              <span className="text-xs text-tenantText-muted font-normal">
                Gerado em {new Date(aiReport.timestamp).toLocaleTimeString()}
              </span>
            )}
          </h3>

          {!aiReport && !isGenerating && (
            <div className="text-center py-12 border-2 border-dashed border-surface-border rounded-tenant">
              <Sparkles className="w-10 h-10 text-tenantText-muted mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-tenantText-main">Nenhum relatório gerado ainda</p>
              <p className="text-xs text-tenantText-muted mt-1">Preencha os parâmetros e clique em 'Gerar Anamnese com IA'</p>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-12 space-y-3">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium text-tenantText-main">Analisando histórico de saúde e sintomas...</p>
            </div>
          )}

          {aiReport && !isGenerating && (
            <div className="space-y-4 text-sm animate-fadeIn">
              <div className="p-3.5 rounded-tenant bg-primary-light/40 border border-primary/20 flex items-center justify-between">
                <div>
                  <span className="text-xs text-tenantText-muted block">Nível de Risco Identificado</span>
                  <span className="font-bold text-primary text-base">{aiReport.riskLevel}</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-500">
                  Análise Concluída
                </span>
              </div>

              <div>
                <h4 className="font-semibold text-tenantText-main mb-1 text-xs uppercase tracking-wider">
                  Resumo Preditivo
                </h4>
                <p className="text-tenantText-muted text-xs leading-relaxed p-3 bg-surface-dim/30 rounded-tenant border border-surface-border">
                  {aiReport.summary}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-tenantText-main mb-2 text-xs uppercase tracking-wider">
                  Perguntas Sugeridas para a Consulta
                </h4>
                <ul className="space-y-2">
                  {aiReport.aiQuestionsGenerated?.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-tenantText-main p-2 rounded bg-surface-dim/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
