
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle2, User, Activity, FileText, ChevronRight, ChevronLeft, Calendar, Info, Lock } from 'lucide-react';
import { INCIDENT_TYPES, MONTHS } from '../constants';
import { IncidentClassification, Sector } from '../types';

interface PublicFormProps {
  sectors: Sector[];
  onSubmit: (data: any) => void;
}

const PublicForm: React.FC<PublicFormProps> = ({ sectors, onSubmit }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    origin: 'Portal' as const,
    incidentDate: new Date().toISOString().split('T')[0],
    notificationDate: new Date().toISOString().split('T')[0],
    period: 'Durante o dia (07h às 19h)' as any,
    reportingSector: '',
    notifiedSector: '',
    incidentType: INCIDENT_TYPES[0],
    classification: IncidentClassification.RISK_CIRCUMSTANCE,
    damageGrade: 'Nenhum' as any,
    identificationMethod: 'Identificação Espontânea',
    description: '',
    carePhase: 'Durante a prestação de cuidados',
    patientRA: '',
    patientName: '',
    patientDOB: '',
    month: MONTHS[new Date().getMonth()],
    year: new Date().getFullYear(),
    professionalCategory: '',
    notivisaNotified: 'Não' as any,
    onaNotified: 'Não' as any,
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-[3rem] shadow-xl p-12 max-w-lg w-full text-center space-y-8 border border-slate-100">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 text-emerald-600 mb-4">
            <CheckCircle2 className="w-14 h-14" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight italic">Relato Enviado</h2>
            <p className="text-slate-500 mt-4 text-base">Obrigado por contribuir com a segurança do paciente. Seu registro será analisado pela equipe da Qualidade.</p>
          </div>
          <button 
            onClick={() => { setStep(1); setSubmitted(false); }} 
            className="w-full py-5 bg-moss-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-moss-700 transition-all shadow-lg"
          >
            Nova Notificação
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6 flex flex-col items-center">
      {/* Botão de Login Discreto */}
      <div className="w-full max-w-5xl flex justify-end mb-4">
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-moss-600 transition-all"
        >
          <Lock className="w-3 h-3" /> Área Restrita
        </button>
      </div>

      <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px] border border-slate-100">
        
        {/* Lado Esquerdo - Info */}
        <div className="w-full md:w-80 bg-moss-700 p-10 text-white flex flex-col justify-between">
          <div className="space-y-10">
            <div className="flex items-center gap-3">
              <Activity className="w-10 h-10 text-white" />
              <h1 className="text-xl font-black italic uppercase leading-tight">QualiHealth<br/><span className="text-white/40">Portal</span></h1>
            </div>
            
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className={`flex items-center gap-4 transition-all ${step === i ? 'opacity-100 scale-105' : 'opacity-30'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${step === i ? 'bg-white text-moss-700' : 'bg-white/10 text-white'}`}>
                    {i}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{i === 1 ? 'Local e Data' : i === 2 ? 'Envolvidos' : 'O Evento'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[10px] text-white/40 font-bold italic leading-relaxed">
            "A cultura de segurança começa com a sua notificação."
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="flex-1 p-10 md:p-16">
          <form onSubmit={handleSubmit} className="h-full flex flex-col justify-between">
            <div className="space-y-10">
              {step === 1 && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                  <h2 className="text-3xl font-black text-slate-800 italic">Identificação</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Setor Notificado</label>
                      <select required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-moss-600" value={formData.notifiedSector} onChange={e => setFormData({...formData, notifiedSector: e.target.value})}>
                        <option value="">Selecione...</option>
                        {sectors.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data do Fato</label>
                      <input type="date" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" value={formData.incidentDate} onChange={e => setFormData({...formData, incidentDate: e.target.value})} />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                  <h2 className="text-3xl font-black text-slate-800 italic">Participantes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Paciente</label>
                      <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sua Categoria</label>
                      <input type="text" required placeholder="Ex: Enfermagem" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" value={formData.professionalCategory} onChange={e => setFormData({...formData, professionalCategory: e.target.value})} />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                  <h2 className="text-3xl font-black text-slate-800 italic">Relato do Evento</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de Ocorrência</label>
                      <select required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" value={formData.incidentType} onChange={e => setFormData({...formData, incidentType: e.target.value})}>
                        {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição</label>
                      <textarea required rows={6} className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-sm outline-none focus:border-moss-600 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
              {step > 1 ? (
                <button type="button" onClick={prevStep} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-moss-600">Voltar</button>
              ) : <div />}

              {step < 3 ? (
                <button type="button" onClick={nextStep} className="px-10 py-4 bg-moss-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-moss-700 shadow-lg">Próximo</button>
              ) : (
                <button type="submit" className="px-12 py-5 bg-moss-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-moss-700 shadow-xl flex items-center gap-3 group">
                  <Send className="w-4 h-4 group-hover:translate-x-1" /> Enviar Relato
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublicForm;
