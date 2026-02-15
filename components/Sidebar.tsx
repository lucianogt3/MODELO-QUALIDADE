
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus, LogOut, ShieldCheck, Settings, Users, ArrowLeftRight } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  return (
    <aside className="w-80 bg-moss-700 text-white flex flex-col h-screen sticky top-0 border-r border-moss-800 shadow-2xl">
      <div className="p-10 border-b border-moss-600/50">
        <div className="flex items-center gap-4 mb-2">
          <ShieldCheck className="w-10 h-10 text-white" />
          <h1 className="text-xl font-black tracking-tighter uppercase leading-none italic">QualiHealth</h1>
        </div>
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Painel Central</p>
      </div>

      <nav className="flex-1 p-8 space-y-4">
        <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 ml-4">Navegação</div>
        
        <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-4 px-6 py-5 rounded-[2rem] font-black text-sm transition-all ${isActive ? 'bg-white text-moss-700 shadow-xl' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
          <LayoutDashboard className="w-6 h-6" />
          Dashboard
        </NavLink>

        <NavLink to="/notificar" className="flex items-center gap-4 px-6 py-5 rounded-[2rem] text-white/60 hover:bg-white/5 hover:text-white font-black text-sm transition-all">
          <FilePlus className="w-6 h-6" />
          Registrar Evento
        </NavLink>

        {user.role === 'Administrador' && (
          <>
            <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-10 mb-4 ml-4">Geral</div>
            <NavLink to="/admin" className={({isActive}) => `flex items-center gap-4 px-6 py-5 rounded-[2rem] font-black text-sm transition-all ${isActive ? 'bg-white text-moss-700 shadow-xl' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
              <Settings className="w-6 h-6" />
              Configurações
            </NavLink>
          </>
        )}
      </nav>

      <div className="p-8 border-t border-moss-600/50">
        <div className="bg-moss-800 p-5 rounded-[2rem] border border-moss-500/30 flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white text-moss-700 flex items-center justify-center font-black text-lg shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black truncate">{user.name}</p>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{user.role}</p>
          </div>
        </div>
        <button 
          onClick={onLogout} 
          className="w-full flex items-center gap-4 px-6 py-4 text-white/40 hover:text-red-400 font-bold transition-all rounded-[1.5rem] hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5" />
          Encerrar Sessão
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
