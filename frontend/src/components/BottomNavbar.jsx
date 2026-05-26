import { useState, useEffect } from 'react';

export default function BottomNavbar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {

    const dadosSalvos = localStorage.getItem('@LeilaSalon:user');
    
    if (dadosSalvos) {
      const usuario = JSON.parse(dadosSalvos);
      
  
      console.log("=== USUÁRIO ATUAL NO NAVBAR ===", usuario);


      const roleUsuario = usuario.role?.toLowerCase() || usuario.cargo?.toLowerCase() || '';

      if (roleUsuario.includes('admin') || roleUsuario.includes('administrador') || usuario.isAdmin === true) {
        setIsAdmin(true);
      }
    }
  }, []);

  return (
    <nav className="w-full h-16 bg-[#fcf9f8] text-[#63433e] flex items-center justify-around border-t border-gray-100 shadow-2xl fixed bottom-0 left-0 right-0 z-50">
      
      <button 
        onClick={() => window.location.href = '/'} 
        className="flex flex-col items-center justify-center text-xs font-medium w-16 h-14 cursor-pointer"
      >
        Home
      </button>

      <button 
        onClick={() => window.location.href = '/Appointments'} 
        className="flex flex-col items-center justify-center text-xs font-semibold text-amber-900 w-16 h-14 cursor-pointer"
      >
        Agendados
      </button>

    
      {isAdmin && (
        <button 
          onClick={() => window.location.href = '/Admin'} 
          className="flex flex-col items-center justify-center text-xs font-medium w-16 h-14 cursor-pointer animate-fade-in bg-amber-50 rounded-xl"
        >
          Admin
        </button>
      )}

    </nav>
  );
}