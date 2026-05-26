import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('@LeilaSalon:user');
    if (dadosSalvos) {
      setUsuario(JSON.parse(dadosSalvos));
    }
  }, []);

  const handleCliqueIcone = () => {
    if (usuario) {
      setMenuAberto(!menuAberto);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('@LeilaSalon:token');
    localStorage.removeItem('@LeilaSalon:user');
    setUsuario(null);
    setMenuAberto(false);
    navigate('/login');
  };

  return (
    <header className="w-screen h-16 bg-[#fcf9f8] text-[#63433e] flex items-center justify-between text-2xl shadow-2xl relative">
      <h1 className="ml-4 font-title font-regular cursor-pointer" onClick={() => navigate('/')}>
        Leila Cabeleleira
      </h1>

      <div className="relative mr-4 flex flex-col items-end">
        <button 
          onClick={handleCliqueIcone} 
          className="flex items-center justify-end gap-x-2 text-sm font-semibold hover:opacity-80 active:scale-95 transition-all focus:outline-none"
        >
          <svg 
            className="w-6 h-6 text-[#63433e]" 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" 
            />
          </svg>
        </button>

        {menuAberto && usuario && (
          <div className="absolute top-10 right-0 bg-white border border-gray-200 p-4 rounded-xl shadow-xl flex flex-col gap-y-3 z-50 min-w-40">
            <div className="flex flex-col text-start">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Usuário</span>
              <span className="text-sm font-bold text-gray-800 ">
                {usuario.nome || usuario.name}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg border border-red-200 active:scale-95 transition-all focus:outline-none"
            >
              Sair da Conta
            </button>
          </div>
        )}
      </div>
    </header>
  );
}