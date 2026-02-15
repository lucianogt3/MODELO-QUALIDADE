
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronRight, ArrowLeft } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin }) => {
  const navigate = useNavigate();

  const handleLogin = (user: User) => {
    onLogin(user);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="w-full max-w-sm space-y-10">
        
        {/* Identificação Simples */}
        <div className="text-center">
          <div className="w-14 h-14 bg-moss-600 rounded-2xl flex items-center justify-center mx-auto text-white mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black text-moss-900 uppercase tracking-tighter italic">Área Administrativa</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Selecione seu acesso</p>
        </div>

        {/* Lista de Perfis - Sem decorações fixas na tela */}
        <div className="space-y-2">
          {users.filter(u => u.active).map(u => (
            <button 
              key={u.id} 
              onClick={() => handleLogin(u)}
              className="w-full flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-moss-600 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-moss-600 group-hover:bg-moss-600 group-hover:text-white transition-all">
                  {u.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 text-sm leading-none">{u.name}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{u.role}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-moss-600 transition-all" />
            </button>
          ))}
        </div>

        {/* Retorno */}
        <div className="pt-4 text-center">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-moss-600 transition-all"
          >
            <ArrowLeft className="w-3 h-3" /> Sair da Área Restrita
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;
