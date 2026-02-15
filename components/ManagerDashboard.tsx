
import React, { useState } from 'react';
import { 
  ArrowLeft, ChevronRight, Clock, CheckCircle2, Save, FileSpreadsheet, TrendingUp, UserCircle, X, Check, BarChart3, HelpCircle, Info, LayoutList, AlertCircle,
  // Added missing icons to fix JSX component errors where 'History' and 'Layers' were resolving to global types instead of components
  History, Layers
} from 'lucide-react';
import { Notification, NotificationStatus, User, IshikawaData, ActionPlan } from '../types';
import { ISHIKAWA_CATEGORIES } from '../constants';

interface ManagerDashboardProps {
  user: User;
  notifications: Notification[];
  updateNotification: (id: string, updates: Partial<Notification>) => void;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ user, notifications, updateNotification }) => {
  const [activeSector, setActiveSector] = useState(user.sectors[0] || '');
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'archived'>('pending');
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  
  const [ishikawa, setIshikawa] = useState<IshikawaData>({
    maoDeObra: { cause: '', details: '' },
    maquinas: { cause: '', details: '' },
    materiais: { cause: '', details: '' },
    metodos: { cause: '', details: '' },
    ambiente: { cause: '', details: '' },
    medida: { cause: '', details: '' }
  });
  const [actionPlan, setActionPlan] = useState<ActionPlan>({
    what: '', how: '', why: '', who: '', where: '', when: '', cost: '', objective: ''
  });
  const [protocolLondon, setProtocolLondon] = useState(false);
  const [showLondonGuide, setShowLondonGuide] = useState(false);

  const filteredNotifs = notifications.filter(n => {
    const isOurSector = n.notifiedSector === activeSector;
    const matchesTab = 
      (activeTab === 'pending' && n.status !== NotificationStatus.COMPLETED && n.status !== NotificationStatus.ARCHIVED) ||
      (activeTab === 'completed' && n.status === NotificationStatus.COMPLETED) ||
      (activeTab === 'archived' && n.status === NotificationStatus.ARCHIVED);
    return isOurSector && n.isSentToArea && matchesTab;
  });

  const handleStartAnalysis = (n: Notification) => {
    setSelectedNotif(n);
    if (n.ishikawa) setIshikawa(n.ishikawa);
    if (n.actionPlan) setActionPlan(n.actionPlan);
    if (n.protocolLondonRequired) setProtocolLondon(n.protocolLondonRequired);
  };

  const handleSaveAnalysis = (isComplete: boolean) => {
    if (!selectedNotif) return;
    updateNotification(selectedNotif.id, {
      ishikawa,
      actionPlan,
      protocolLondonRequired: protocolLondon,
      status: isComplete ? NotificationStatus.COMPLETED : NotificationStatus.ANALYZING
    });
    setSelectedNotif(null);
  };

  const getSLA = (n: Notification) => {
    if (!n.deadline) return null;
    const diff = new Date(n.deadline).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  if (selectedNotif) {
    return (
      <div className="p-10 max-w-full mx-auto space-y-12 animate-in fade-in duration-500 pb-32">
        <header className="flex items-center justify-between bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl sticky top-8 z-30">
          <div className="flex items-center gap-6">
            <button onClick={() => setSelectedNotif(null)} className="p-4 bg-moss-50 text-moss-700 rounded-full hover:bg-moss-100 transition-all">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-3xl font-black text-moss-900 tracking-tighter italic">Análise de Causa Raiz</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preencha todos os campos para encerrar o evento</p>
            </div>
          </div>
          <div className="flex gap-6">
            <button onClick={() => handleSaveAnalysis(false)} className="px-12 py-5 bg-white border-2 border-slate-200 rounded-[2rem] font-black text-sm uppercase tracking-widest text-slate-500 hover:border-slate-400 transition-all">Salvar Rascunho</button>
            <button onClick={() => handleSaveAnalysis(true)} className="px-12 py-5 bg-moss-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-moss-900/20 hover:bg-moss-700 transition-all active:scale-95">Finalizar Investigação</button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          {/* Main Analysis Area */}
          <div className="xl:col-span-8 space-y-12">
            {/* Expanded Header Info */}
            <section className="bg-white p-14 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-moss-50 rounded-bl-full opacity-30 -z-0"></div>
               <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <span className="px-6 py-2 bg-moss-600 text-white text-[10px] font-black uppercase rounded-full shadow-lg">Notificação #{selectedNotif.notificationNumber}</span>
                    <span className="px-6 py-2 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-full border border-slate-200">Data: {selectedNotif.incidentDate}</span>
                    {selectedNotif.priorityRequested && <span className="px-6 py-2 bg-red-100 text-red-600 text-[10px] font-black uppercase rounded-full animate-pulse border border-red-200">PRIORIDADE SOLICITADA</span>}
                  </div>
                  <h2 className="text-5xl font-black text-moss-900 leading-tight tracking-tighter">{selectedNotif.incidentType}</h2>
                  <div className="p-12 bg-moss-50/50 rounded-[3rem] border border-moss-100 text-moss-800 text-2xl leading-relaxed font-medium shadow-inner italic">
                    "{selectedNotif.description}"
                  </div>
               </div>
            </section>

            {/* Large Ishikawa Grid */}
            <section className="bg-white p-14 rounded-[4rem] border border-slate-200 shadow-sm space-y-14">
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-4xl font-black text-moss-900 flex items-center gap-5">
                    <FileSpreadsheet className="w-10 h-10 text-moss-600" /> Metodologia Ishikawa (6M)
                  </h3>
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-3">Identifique as causas em cada categoria assistencial</p>
                </div>

                {/* Protocolo de Londres Section */}
                <div className="flex items-center gap-6 p-6 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
                   <div className="flex items-center gap-4">
                     <div className="space-y-1">
                       <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest block">Investigação Avançada</span>
                       <span className="text-xs font-bold text-indigo-700">Protocolo de Londres?</span>
                     </div>
                     <button 
                      onClick={() => setProtocolLondon(!protocolLondon)}
                      className={`w-16 h-9 rounded-full p-1 transition-all shadow-inner ${protocolLondon ? 'bg-indigo-600' : 'bg-slate-200'}`}
                     >
                      <div className={`w-7 h-7 bg-white rounded-full shadow-lg transition-all ${protocolLondon ? 'translate-x-7' : 'translate-x-0'}`} />
                     </button>
                   </div>
                   <button 
                    onClick={() => setShowLondonGuide(!showLondonGuide)}
                    className="p-3 bg-white text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-all shadow-md"
                   >
                     <HelpCircle className="w-5 h-5" />
                   </button>
                </div>
              </header>

              {showLondonGuide && (
                <div className="p-10 bg-indigo-600 rounded-[2.5rem] text-white animate-in slide-in-from-top duration-300">
                  <h4 className="text-xl font-black mb-4 flex items-center gap-3"><Info className="w-6 h-6"/> Por que usar o Protocolo de Londres?</h4>
                  <p className="text-base leading-relaxed mb-6 opacity-80">
                    Diferente do Ishikawa tradicional que foca em processos industriais, o Protocolo de Londres é específico para a saúde. Ao ativá-lo, você deve considerar os Fatores Contribuintes: Paciente, Equipe, Indivíduo, Tarefa, Ambiente, Organização e Contexto Institucional.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-200" />
                      <span className="text-xs font-bold uppercase tracking-widest">Foco em Fatores Humanos</span>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-200" />
                      <span className="text-xs font-bold uppercase tracking-widest">Barreiras de Segurança</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {ISHIKAWA_CATEGORIES.map(cat => (
                  <div key={cat.id} className="space-y-6 p-10 bg-moss-50/20 rounded-[3rem] border border-moss-100/50 group hover:bg-white hover:border-moss-600 transition-all hover:shadow-2xl">
                    <div className="flex items-center gap-5 font-black text-moss-900 uppercase text-sm tracking-widest mb-6">
                      <div className="p-5 bg-white rounded-3xl shadow-md text-moss-600 group-hover:bg-moss-600 group-hover:text-white transition-all">{cat.icon}</div>
                      {cat.label}
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Causa Selecionada</label>
                      <select 
                        className="w-full p-6 bg-white border border-slate-200 rounded-[1.5rem] font-bold text-base outline-none focus:ring-4 focus:ring-moss-100"
                        value={(ishikawa as any)[cat.id].cause}
                        onChange={e => setIshikawa({...ishikawa, [cat.id]: {...(ishikawa as any)[cat.id], cause: e.target.value}})}
                      >
                        <option value="">Selecione a Causa Principal...</option>
                        {cat.causes.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição do Fator e Evidência</label>
                      <textarea 
                        placeholder="Descreva detalhadamente como este fator contribuiu para o evento..."
                        className="w-full p-8 bg-white border border-slate-200 rounded-[2rem] font-medium text-lg outline-none focus:ring-4 focus:ring-moss-100 h-56 resize-none leading-relaxed shadow-inner"
                        value={(ishikawa as any)[cat.id].details}
                        onChange={e => setIshikawa({...ishikawa, [cat.id]: {...(ishikawa as any)[cat.id], details: e.target.value}})}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Expanded 5W2H Sidebar Area */}
          <div className="xl:col-span-4 space-y-12">
             <section className="bg-moss-700 p-14 rounded-[4rem] text-white shadow-2xl space-y-12 sticky top-32 border border-moss-600">
                <header className="flex items-center gap-6">
                   <div className="p-6 bg-white rounded-[1.5rem] text-moss-700 shadow-xl"><TrendingUp className="w-10 h-10"/></div>
                   <div>
                      <h3 className="text-3xl font-black italic">Plano 5W2H</h3>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-2">Ações de Melhoria</p>
                   </div>
                </header>

                <div className="space-y-10">
                  {[
                    { label: 'WHAT (O que será feito?)', id: 'what', p: 'Ação estratégica...' },
                    { label: 'WHY (Por que é necessário?)', id: 'why', p: 'Justificativa...' },
                    { label: 'HOW (Como será executado?)', id: 'how', p: 'Passo a passo da execução...' },
                    { label: 'WHO (Quem é o responsável?)', id: 'who', p: 'Gestor ou profissional...' },
                    { label: 'WHERE (Onde será aplicado?)', id: 'where', p: 'Setor ou unidade...' },
                    { label: 'WHEN (Data limite?)', id: 'when', type: 'date' },
                    { label: 'COST (Custo previsto?)', id: 'cost', p: 'Recurso financeiro...' },
                    { label: 'GOAL (Objetivo final?)', id: 'objective', p: 'Resultado esperado...' },
                  ].map(field => (
                    <div key={field.id} className="space-y-3 group">
                      <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-2 group-focus-within:text-white transition-all">{field.label}</label>
                      <input 
                        type={field.type || 'text'}
                        placeholder={field.p}
                        className="w-full p-6 bg-white/10 border-2 border-white/5 rounded-[2rem] text-lg text-white placeholder:text-white/20 outline-none focus:border-white focus:bg-white/5 transition-all shadow-inner"
                        value={(actionPlan as any)[field.id]}
                        onChange={e => setActionPlan({...actionPlan, [field.id]: e.target.value})}
                      />
                    </div>
                  ))}
                </div>
             </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-12 max-w-[1600px] mx-auto pb-24">
      {/* Sector Header */}
      <header className="flex flex-col xl:flex-row items-center justify-between gap-10 bg-white p-14 rounded-[4rem] shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-moss-50 rounded-bl-full opacity-30 -z-0"></div>
        <div className="flex items-center gap-10 relative z-10">
          <div className="w-28 h-28 bg-moss-600 rounded-[3rem] flex items-center justify-center text-white shadow-2xl ring-8 ring-moss-50">
            <UserCircle className="w-16 h-16" />
          </div>
          <div>
             <p className="text-[10px] font-black text-moss-400 uppercase tracking-[0.4em] mb-4">Painel de Gestão</p>
             <h1 className="text-5xl font-black text-moss-900 tracking-tighter italic leading-none">{user.name}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 relative z-10">
           <span className="text-[10px] font-black text-slate-400 uppercase mr-2 tracking-widest">Meus Setores:</span>
           {user.sectors.map(s => (
             <button 
              key={s} 
              onClick={() => setActiveSector(s)}
              className={`px-12 py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all border-2 ${activeSector === s ? 'bg-moss-700 text-white border-moss-700 shadow-2xl' : 'bg-white text-slate-400 border-slate-100 hover:border-moss-200'}`}
             >
              {s}
             </button>
           ))}
        </div>
      </header>

      {/* Tabs and Stats */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex bg-white p-4 rounded-[3.5rem] border border-slate-200 shadow-sm w-fit">
          {[
            { id: 'pending', label: 'Investigações Pendentes', icon: <History className="w-5 h-5"/>, color: 'amber' },
            { id: 'completed', label: 'Histórico Concluído', icon: <CheckCircle2 className="w-5 h-5"/>, color: 'emerald' },
            { id: 'archived', label: 'Arquivo Administrativo', icon: <Layers className="w-5 h-5"/>, color: 'slate' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-4 px-12 py-6 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === tab.id ? `bg-moss-700 text-white shadow-xl` : 'text-slate-400 hover:bg-moss-50 hover:text-moss-600'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white px-12 py-8 rounded-[3rem] border border-slate-200 shadow-sm flex items-center gap-8">
           <div className="w-16 h-16 bg-moss-50 rounded-[1.5rem] flex items-center justify-center text-moss-600 shadow-inner ring-4 ring-white">
             <BarChart3 className="w-8 h-8" />
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Carga de Trabalho</p>
             <p className="text-4xl font-black text-moss-900 leading-none mt-2 tracking-tighter">{filteredNotifs.length} Casos</p>
           </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white border border-slate-200 rounded-[4.5rem] shadow-sm overflow-hidden min-h-[600px]">
        {filteredNotifs.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-moss-50/50 border-b border-slate-100">
                <th className="px-14 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificador</th>
                <th className="px-14 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Evento Notificado</th>
                <th className="px-14 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">SLA Restante</th>
                <th className="px-14 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status Interno</th>
                <th className="px-14 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredNotifs.map(n => {
                const sla = getSLA(n);
                return (
                  <tr key={n.id} className="group hover:bg-moss-50/30 transition-all duration-300">
                    <td className="px-14 py-10">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white border border-slate-200 rounded-[1.5rem] flex items-center justify-center font-black text-xl text-slate-300 group-hover:bg-moss-700 group-hover:text-white transition-all shadow-sm">
                            #{n.notificationNumber.toString().slice(-2)}
                          </div>
                          <div>
                            <span className="block font-black text-moss-900 text-xl tracking-tighter">#{n.notificationNumber}</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{n.incidentDate}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-14 py-10">
                      <div className="max-w-md">
                        <span className="block text-xl font-black text-moss-900 leading-tight truncate tracking-tighter">{n.incidentType}</span>
                        <div className="flex items-center gap-3 mt-3">
                          <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${n.damageGrade === 'Grave' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>Dano: {n.damageGrade}</span>
                          {n.priorityRequested && <span className="px-4 py-1 bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-widest border border-amber-200 rounded-full animate-pulse">Alta Prioridade</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-14 py-10 text-center">
                       {sla !== null ? (
                         <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest border-2 ${sla <= 2 ? 'bg-red-50 text-red-600 border-red-100 animate-bounce' : 'bg-moss-50 text-moss-600 border-moss-100'}`}>
                           <Clock className="w-4 h-4"/> {sla <= 0 ? 'Expirado' : `${sla} Dias`}
                         </div>
                       ) : <span className="text-slate-200 font-bold italic">Aguardando Triagem</span>}
                    </td>
                    <td className="px-14 py-10 text-center">
                      <span className={`px-6 py-2 rounded-[1.5rem] text-[9px] font-black uppercase border tracking-[0.2em] shadow-sm inline-block ${n.status === NotificationStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                        {n.status}
                      </span>
                    </td>
                    <td className="px-14 py-10">
                      <button 
                        onClick={() => handleStartAnalysis(n)}
                        className="w-full flex items-center justify-center gap-4 px-10 py-5 bg-white border-2 border-moss-700 text-moss-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-[2rem] hover:bg-moss-700 hover:text-white transition-all shadow-2xl"
                      >
                        {activeTab === 'completed' ? 'Ver Relatório' : 'Iniciar Análise'} <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-48 text-center flex flex-col items-center">
            <LayoutList className="w-40 h-40 text-moss-50 mb-10" />
            <h3 className="text-4xl font-black text-slate-200 italic tracking-tighter">Nenhum evento registrado no setor {activeSector}.</h3>
            <p className="text-slate-200 font-black uppercase tracking-[0.4em] mt-4">Qualidade e Segurança garantidas.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
