
import React, { useState, useMemo } from 'react';
import { 
  Search, Clock, CheckCircle, AlertTriangle, Send, Calendar, Layers, FileText, User, Filter, Download, X, ExternalLink, ChevronRight, BarChart3, TrendingUp, AlertCircle, Zap, Ban
} from 'lucide-react';
import { Notification, NotificationStatus, IncidentClassification } from '../types';
import { MONTHS } from '../constants';

interface QualityDashboardProps {
  notifications: Notification[];
  updateNotification: (id: string, updates: Partial<Notification>) => void;
}

const QualityDashboard: React.FC<QualityDashboardProps> = ({ notifications, updateNotification }) => {
  const [filter, setFilter] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Todos');
  const [activeTab, setActiveTab] = useState<'pending' | 'analyzing' | 'completed'>('pending');
  const [viewingNotif, setViewingNotif] = useState<Notification | null>(null);
  const [indicatorFilter, setIndicatorFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      const matchesFilter = 
        n.description.toLowerCase().includes(filter.toLowerCase()) || 
        n.notifiedSector.toLowerCase().includes(filter.toLowerCase()) ||
        n.notificationNumber.toString().includes(filter) ||
        n.patientName.toLowerCase().includes(filter.toLowerCase());
      const matchesMonth = selectedMonth === 'Todos' || n.month === selectedMonth;
      
      const matchesTab = 
        (activeTab === 'pending' && n.status === NotificationStatus.PENDING) ||
        (activeTab === 'analyzing' && [NotificationStatus.SENT_TO_AREA, NotificationStatus.ANALYZING, NotificationStatus.OVERDUE].includes(n.status)) ||
        (activeTab === 'completed' && n.status === NotificationStatus.COMPLETED);

      let matchesIndicator = true;
      if (indicatorFilter === 'grave') matchesIndicator = n.damageGrade === 'Grave';
      if (indicatorFilter === 'near_miss') matchesIndicator = n.classification === IncidentClassification.NEAR_MISS;
      if (indicatorFilter === 'overdue') matchesIndicator = n.status === NotificationStatus.OVERDUE;

      return matchesFilter && matchesMonth && matchesTab && matchesIndicator;
    });
  }, [notifications, filter, selectedMonth, activeTab, indicatorFilter]);

  const getStatusStyle = (status: NotificationStatus) => {
    switch (status) {
      case NotificationStatus.PENDING: return 'bg-amber-100 text-amber-700 border-amber-200';
      case NotificationStatus.COMPLETED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case NotificationStatus.OVERDUE: return 'bg-red-100 text-red-700 border-red-200 animate-pulse';
      case NotificationStatus.SENT_TO_AREA: return 'bg-moss-100 text-moss-700 border-moss-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const topSectors = useMemo(() => {
    const counts: Record<string, number> = {};
    notifications.forEach(n => {
      counts[n.notifiedSector] = (counts[n.notifiedSector] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [notifications]);

  const stats = [
    { id: 'total', label: 'Total de Eventos', value: notifications.length, icon: <Layers className="w-5 h-5"/>, color: 'moss' },
    { id: 'grave', label: 'Eventos Graves', value: notifications.filter(n => n.damageGrade === 'Grave').length, icon: <AlertTriangle className="w-5 h-5"/>, color: 'red' },
    { id: 'near_miss', label: 'Near Miss (Quase Erro)', value: notifications.filter(n => n.classification === IncidentClassification.NEAR_MISS).length, icon: <Zap className="w-5 h-5"/>, color: 'indigo' },
    { id: 'overdue', label: 'Vencidos (SLA)', value: notifications.filter(n => n.status === NotificationStatus.OVERDUE).length, icon: <Clock className="w-5 h-5"/>, color: 'amber' },
  ];

  const handleManagementAction = (id: string, action: 'priority' | 'close_lack_analysis') => {
    if (action === 'priority') {
      updateNotification(id, { priorityRequested: true });
      alert("Prioridade solicitada ao gestor com sucesso!");
    } else {
      if (confirm("Deseja encerrar este evento por falta de análise?")) {
        updateNotification(id, { status: NotificationStatus.ARCHIVED, closedWithoutAction: true });
        setViewingNotif(null);
      }
    }
  };

  return (
    <div className="p-10 space-y-12 max-w-[1600px] mx-auto pb-24">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-moss-50 rounded-bl-full opacity-30 -z-0"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-black text-moss-900 tracking-tighter italic">Qualidade & Segurança</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mt-3">Dashboards Assistenciais e Gestão de Fluxos</p>
        </div>
        <div className="flex flex-wrap gap-4 relative z-10">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-moss-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar registros..." 
              className="pl-14 pr-10 py-5 bg-moss-50/50 border border-slate-200 rounded-[2rem] w-80 font-bold text-sm focus:ring-4 focus:ring-moss-100 outline-none transition-all"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
          </div>
          <select 
            className="p-5 bg-moss-50/50 border border-slate-200 rounded-[2rem] font-black text-sm text-moss-700 outline-none cursor-pointer"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          >
            <option>Todos os Meses</option>
            {MONTHS.map(m => <option key={m}>{m}</option>)}
          </select>
          <button className="flex items-center gap-3 px-8 py-5 bg-moss-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-moss-700 transition-all shadow-xl active:scale-95">
            <Download className="w-5 h-5" /> EXPORTAR
          </button>
        </div>
      </header>

      {/* Dynamic Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s) => (
          <button 
            key={s.id} 
            onClick={() => setIndicatorFilter(indicatorFilter === s.id ? null : s.id)}
            className={`bg-white p-10 rounded-[3rem] border transition-all duration-500 text-left relative overflow-hidden group ${indicatorFilter === s.id ? 'border-moss-600 ring-4 ring-moss-50 shadow-2xl scale-105' : 'border-slate-200 shadow-sm hover:shadow-xl'}`}
          >
            <div className={`p-5 rounded-2xl w-fit mb-6 ${indicatorFilter === s.id ? 'bg-moss-600 text-white' : `bg-${s.color}-50 text-${s.color}-600`}`}>
              {s.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.label}</p>
            <h3 className="text-5xl font-black text-moss-900">{s.value}</h3>
            {indicatorFilter === s.id && <div className="absolute top-8 right-8 text-moss-600"><CheckCircle className="w-6 h-6"/></div>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Tabs */}
          <div className="flex bg-white p-3 rounded-[3rem] border border-slate-200 shadow-sm w-fit">
            {[
              { id: 'pending', label: 'Triagem Pendente', icon: <Filter className="w-4 h-4"/>, color: 'amber' },
              { id: 'analyzing', label: 'Em Análise', icon: <Clock className="w-4 h-4"/>, color: 'blue' },
              { id: 'completed', label: 'Concluídos', icon: <CheckCircle className="w-4 h-4"/>, color: 'emerald' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setIndicatorFilter(null); }}
                className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.id ? `bg-moss-700 text-white shadow-xl` : 'text-slate-400 hover:bg-moss-50'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Records Table */}
          <div className="bg-white border border-slate-200 rounded-[4rem] shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-moss-50/50 border-b border-slate-100">
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Evento / Setor</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gestão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(n => (
                  <tr key={n.id} className="group hover:bg-moss-50/20 transition-colors">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-moss-600 group-hover:text-white transition-all shadow-sm">
                          #{n.notificationNumber.toString().slice(-2)}
                        </div>
                        <div>
                          <span className="block font-black text-moss-900 text-lg">#{n.notificationNumber}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{n.incidentDate}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="max-w-xs">
                        <span className="block text-sm font-black text-moss-900 leading-tight truncate">{n.incidentType}</span>
                        <span className="text-[10px] font-black text-slate-400 mt-1 block uppercase tracking-tighter italic">{n.notifiedSector}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className={`px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase border tracking-widest shadow-sm inline-block ${getStatusStyle(n.status)}`}>
                        {n.status}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <button 
                        onClick={() => setViewingNotif(n)}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-moss-700 text-moss-700 text-[10px] font-black uppercase rounded-[1.5rem] hover:bg-moss-700 hover:text-white transition-all shadow-lg shadow-slate-200"
                      >
                        Abrir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-32 text-center text-slate-200 italic font-black text-xl uppercase tracking-widest">
                Nenhum registro encontrado com os filtros atuais.
              </div>
            )}
          </div>
        </div>

        {/* Top Sectors Side Card */}
        <div className="space-y-8">
           <div className="bg-moss-700 p-10 rounded-[3rem] text-white shadow-2xl">
              <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-white/40" /> Maiores Notificantes
              </h3>
              <div className="space-y-6">
                {topSectors.map(([name, count], idx) => (
                  <div key={name} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
                      <span className="text-xs font-black uppercase tracking-tight">{name}</span>
                    </div>
                    <span className="text-lg font-black text-white/40">{count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/5 italic text-[10px] text-white/30 leading-relaxed">
                Dados baseados em notificações triadas e pendentes nos últimos 30 dias.
              </div>
           </div>
        </div>
      </div>

      {/* Details Modal */}
      {viewingNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-12 bg-moss-900/90 backdrop-blur-lg animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-6xl max-h-full rounded-[4rem] shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-500">
            <button onClick={() => setViewingNotif(null)} className="absolute top-10 right-10 p-4 bg-moss-50 text-moss-600 rounded-full hover:bg-red-50 hover:text-red-600 transition-all z-10"><X className="w-6 h-6" /></button>
            <div className="p-16 overflow-y-auto space-y-12">
               <header>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-4 py-1.5 bg-moss-50 text-moss-600 text-[10px] font-black uppercase rounded-lg border border-moss-100">Evento #{viewingNotif.notificationNumber}</span>
                    <span className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg border ${getStatusStyle(viewingNotif.status)}`}>{viewingNotif.status}</span>
                    {viewingNotif.priorityRequested && <span className="px-4 py-1.5 bg-red-100 text-red-600 text-[10px] font-black uppercase rounded-lg animate-bounce">PRIORIDADE SOLICITADA</span>}
                  </div>
                  <h2 className="text-5xl font-black text-moss-900 leading-tight tracking-tighter">{viewingNotif.incidentType}</h2>
               </header>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-10">
                     <section className="bg-moss-50/50 p-10 rounded-[3rem] border border-moss-100 shadow-inner">
                        <h4 className="text-[10px] font-black text-moss-400 uppercase tracking-widest mb-6 flex items-center gap-3"><FileText className="w-4 h-4"/> Relato Original</h4>
                        <p className="text-moss-900 text-xl leading-relaxed italic font-medium">"{viewingNotif.description}"</p>
                     </section>

                     <div className="grid grid-cols-2 gap-8">
                        <div className="p-8 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                           <h5 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Informações Assistenciais</h5>
                           <p className="font-black text-moss-900 text-lg">{viewingNotif.patientName || 'N/A'}</p>
                           <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest italic">RA: {viewingNotif.patientRA || 'Sem Registro'}</p>
                        </div>
                        <div className="p-8 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                           <h5 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Origem do Relato</h5>
                           <p className="font-black text-moss-900 text-lg">{viewingNotif.reportingSector}</p>
                           <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest italic">Por: {viewingNotif.professionalCategory}</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="bg-moss-700 p-10 rounded-[3rem] text-white shadow-2xl">
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-8">Gestão de Fluxo</h4>
                        <div className="space-y-6">
                           {viewingNotif.status === NotificationStatus.PENDING && (
                             <button 
                               onClick={() => {
                                 updateNotification(viewingNotif.id, { status: NotificationStatus.SENT_TO_AREA, isSentToArea: true, deadline: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0] });
                                 setViewingNotif(null);
                               }}
                               className="w-full py-6 bg-white text-moss-700 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                             >
                               <Send className="w-5 h-5" /> Enviar para Área
                             </button>
                           )}

                           {viewingNotif.status === NotificationStatus.OVERDUE && (
                             <div className="space-y-4">
                                <button 
                                  disabled={viewingNotif.priorityRequested}
                                  onClick={() => handleManagementAction(viewingNotif.id, 'priority')}
                                  className={`w-full py-6 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${viewingNotif.priorityRequested ? 'bg-slate-500 text-slate-300' : 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95'}`}
                                >
                                  <AlertCircle className="w-5 h-5" /> {viewingNotif.priorityRequested ? 'PRIORIDADE JÁ SOLICITADA' : 'SOLICITAR PRIORIDADE'}
                                </button>
                                <button 
                                  onClick={() => handleManagementAction(viewingNotif.id, 'close_lack_analysis')}
                                  className="w-full py-6 bg-red-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                  <Ban className="w-5 h-5" /> ENCERRAR SEM AÇÃO
                                </button>
                             </div>
                           )}

                           <div className="p-6 bg-white/5 rounded-[1.5rem] border border-white/10 text-xs text-white/30 italic leading-relaxed">
                             Notificações em atraso geram alerta automático para as diretorias responsáveis.
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityDashboard;
