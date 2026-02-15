
import React, { useState } from 'react';
import { User, Sector, Role } from '../types';
import { Users, LayoutGrid, Plus, Trash2, Shield, UserCircle, Save, X, ToggleLeft, ToggleRight, Key, 
  // Add missing Check icon
  Check 
} from 'lucide-react';

interface AdminSettingsProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  sectors: Sector[];
  setSectors: React.Dispatch<React.SetStateAction<Sector[]>>;
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ users, setUsers, sectors, setSectors, roles, setRoles }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'sectors' | 'roles'>('users');
  const [showModal, setShowModal] = useState(false);
  
  // Creation States
  const [newUser, setNewUser] = useState<Partial<User>>({ active: true, sectors: [], role: 'Gestor' });
  const [newSector, setNewSector] = useState('');
  const [newRole, setNewRole] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    const u: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role || 'Gestor',
      sectors: newUser.sectors || [],
      active: true
    };
    setUsers([...users, u]);
    setShowModal(false);
    setNewUser({ active: true, sectors: [], role: 'Gestor' });
  };

  const handleAddSector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSector) return;
    setSectors([...sectors, { id: Math.random().toString(36).substr(2, 9), name: newSector, active: true }]);
    setNewSector('');
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole) return;
    setRoles([...roles, { id: Math.random().toString(36).substr(2, 9), name: newRole, permissions: [] }]);
    setNewRole('');
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const toggleSectorStatus = (id: string) => {
    setSectors(sectors.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <div className="p-10 space-y-12 max-w-7xl mx-auto pb-24 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-moss-50 rounded-bl-full opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-black text-moss-900 tracking-tighter italic leading-none">Configuração Master</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mt-3">Infraestrutura de Dados e Segurança do Sistema</p>
        </div>
        <div className="flex bg-moss-50 p-3 rounded-[2.5rem] relative z-10">
          {[
            { id: 'users', label: 'Usuários', icon: <UserCircle className="w-5 h-5"/> },
            { id: 'sectors', label: 'Setores', icon: <LayoutGrid className="w-5 h-5"/> },
            { id: 'roles', label: 'Funções', icon: <Shield className="w-5 h-5"/> },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-moss-700 text-white shadow-xl' : 'text-slate-400 hover:text-moss-600'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content Areas */}
      <div className="bg-white rounded-[4rem] border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Users Section */}
        {activeTab === 'users' && (
          <div className="p-12 space-y-12">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black text-moss-900 flex items-center gap-4"><Users className="w-8 h-8 text-moss-600"/> Gestão de Acessos</h3>
              <button onClick={() => setShowModal(true)} className="flex items-center gap-3 px-10 py-5 bg-moss-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-moss-700 shadow-xl shadow-moss-900/10 active:scale-95 transition-all">
                <Plus className="w-5 h-5" /> Adicionar Usuário
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {users.map(u => (
                <div key={u.id} className={`p-10 rounded-[3rem] border transition-all flex flex-col justify-between group h-full relative ${u.active ? 'bg-white border-slate-200 hover:border-moss-600 hover:shadow-2xl hover:shadow-moss-900/10' : 'bg-slate-50 border-slate-100 opacity-60 grayscale'}`}>
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm ${u.active ? 'bg-moss-50 text-moss-600' : 'bg-slate-200 text-slate-400'}`}>
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-moss-900 text-xl tracking-tight leading-none">{u.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">{u.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                       <Shield className="w-4 h-4 text-moss-300" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{u.role}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {u.sectors.map(s => (
                         <span key={s} className="px-3 py-1 bg-moss-50 text-moss-600 text-[9px] font-black uppercase rounded-lg border border-moss-100">{s}</span>
                       ))}
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <button onClick={() => toggleUserStatus(u.id)} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${u.active ? 'text-moss-600 hover:text-red-500' : 'text-slate-400 hover:text-moss-600'}`}>
                        {u.active ? <><ToggleRight className="w-5 h-5"/> Ativo</> : <><ToggleLeft className="w-5 h-5"/> Inativo</>}
                      </button>
                      <button className="text-slate-300 hover:text-moss-600 transition-all group-hover:opacity-100 opacity-0 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Key className="w-4 h-4"/> Reset Senha</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sectors Section */}
        {activeTab === 'sectors' && (
          <div className="p-12 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
               <h3 className="text-3xl font-black text-moss-900 flex items-center gap-4"><LayoutGrid className="w-8 h-8 text-moss-600"/> Cadastro de Setores</h3>
               <form onSubmit={handleAddSector} className="flex gap-4 w-full md:w-auto">
                 <input 
                  type="text" placeholder="Nome do novo setor..." 
                  className="px-8 py-5 bg-moss-50/50 border border-slate-200 rounded-[2rem] font-bold text-sm w-full md:w-80 outline-none focus:ring-4 focus:ring-moss-100"
                  value={newSector} onChange={e => setNewSector(e.target.value)}
                 />
                 <button className="p-5 bg-moss-600 text-white rounded-full hover:bg-moss-700 shadow-lg shadow-moss-900/10 active:scale-95 transition-all"><Plus/></button>
               </form>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
               {sectors.map(s => (
                 <div key={s.id} className={`p-8 rounded-[2.5rem] border transition-all flex flex-col justify-between ${s.active ? 'bg-white border-slate-200 hover:border-moss-600 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-50 grayscale'}`}>
                    <p className="font-black text-moss-900 uppercase text-[10px] tracking-widest line-clamp-2 leading-relaxed mb-4">{s.name}</p>
                    <div className="flex items-center justify-between">
                       <button onClick={() => toggleSectorStatus(s.id)} className={`text-[9px] font-black uppercase tracking-widest ${s.active ? 'text-moss-500' : 'text-slate-400'}`}>
                          {s.active ? 'Ativo' : 'Inativo'}
                       </button>
                       <button className="text-slate-200 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4"/></button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Roles Section */}
        {activeTab === 'roles' && (
          <div className="p-12 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
               <h3 className="text-3xl font-black text-moss-900 flex items-center gap-4"><Shield className="w-8 h-8 text-moss-600"/> Matriz de Funções</h3>
               <form onSubmit={handleAddRole} className="flex gap-4 w-full md:w-auto">
                 <input 
                  type="text" placeholder="Nova Função (Ex: Supervisor)..." 
                  className="px-8 py-5 bg-moss-50/50 border border-slate-200 rounded-[2rem] font-bold text-sm w-full md:w-80 outline-none focus:ring-4 focus:ring-moss-100"
                  value={newRole} onChange={e => setNewRole(e.target.value)}
                 />
                 <button className="p-5 bg-moss-600 text-white rounded-full hover:bg-moss-700 shadow-lg shadow-moss-900/10 active:scale-95 transition-all"><Plus/></button>
               </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {roles.map(r => (
                 <div key={r.id} className="p-10 bg-moss-50/20 border border-slate-200 rounded-[3rem] space-y-6 hover:bg-white hover:border-moss-600 hover:shadow-2xl transition-all group">
                    <div className="flex items-center justify-between">
                       <h4 className="text-xl font-black text-moss-900">{r.name}</h4>
                       <Shield className="w-6 h-6 text-moss-300 group-hover:text-moss-600 transition-all"/>
                    </div>
                    <div className="space-y-3">
                       <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase">
                          <span>Permissões</span>
                          <span>{r.permissions.length} ativas</span>
                       </div>
                       <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-white text-[9px] font-black text-moss-400 border border-slate-200 rounded-lg">Leitura</span>
                          <span className="px-3 py-1 bg-white text-[9px] font-black text-moss-400 border border-slate-200 rounded-lg">Análise</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

      </div>

      {/* User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-12 bg-moss-900/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl p-16 relative animate-in zoom-in-95 duration-500">
              <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 p-4 bg-moss-50 text-moss-600 rounded-full hover:bg-red-50 hover:text-red-600 transition-all"><X/></button>
              <h3 className="text-3xl font-black text-moss-900 mb-10 tracking-tight leading-none">Configurar Novo Usuário</h3>
              <form onSubmit={handleAddUser} className="space-y-8">
                 <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                       <input type="text" required className="w-full p-5 bg-moss-50 border border-slate-200 rounded-[1.5rem] font-bold outline-none focus:ring-4 focus:ring-moss-100" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})}/>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                       <input type="email" required className="w-full p-5 bg-moss-50 border border-slate-200 rounded-[1.5rem] font-bold outline-none focus:ring-4 focus:ring-moss-100" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Função</label>
                          <select className="w-full p-5 bg-moss-50 border border-slate-200 rounded-[1.5rem] font-black text-sm" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                             {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                          </select>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Setores Vinculados</label>
                          <div className="max-h-40 overflow-y-auto p-4 bg-moss-50 border border-slate-200 rounded-[1.5rem] space-y-2">
                             {sectors.filter(s => s.active).map(s => (
                               <button 
                                key={s.id} type="button" 
                                onClick={() => {
                                  const current = newUser.sectors || [];
                                  const updated = current.includes(s.name) ? current.filter(x => x !== s.name) : [...current, s.name];
                                  setNewUser({...newUser, sectors: updated});
                                }}
                                className={`w-full text-left px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all flex items-center justify-between ${newUser.sectors?.includes(s.name) ? 'bg-moss-600 text-white' : 'bg-white text-slate-400 hover:border-moss-200 border border-slate-100'}`}
                               >
                                 {s.name}
                                 {/* Fix missing icon error */}
                                 {newUser.sectors?.includes(s.name) && <Check className="w-4 h-4"/>}
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
                 <button type="submit" className="w-full py-6 bg-moss-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-moss-900/10 hover:bg-moss-700 transition-all flex items-center justify-center gap-3 mt-10"><Save className="w-5 h-5"/> SALVAR NOVO USUÁRIO</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;