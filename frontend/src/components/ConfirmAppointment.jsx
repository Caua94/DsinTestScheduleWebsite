import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AppointmentsCards({ service, date, hour }) {
    const [carregando, setCarregando] = useState(false);
    const [erroMensagem, setErroMensagem] = useState('');
    const [sucessoMensagem, setSucessoMensagem] = useState('');
    const navigate = useNavigate();

    const temServicoSelecionado = Array.isArray(service) ? service.length > 0 : !!service;

    useEffect(() => {
        setErroMensagem('');
    }, [date, hour, service]);

    if (!temServicoSelecionado || !date || !hour) return null;

    const handleConfirmar = async () => {
        const token = localStorage.getItem('@LeilaSalon:token');
        const userStorage = localStorage.getItem('@LeilaSalon:user');

        if (!token || !userStorage) {
            setErroMensagem('Autenticação necessária para realizar o agendamento.');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        const user = JSON.parse(userStorage);
        setCarregando(true);
        setErroMensagem('');

        try {
            await api.post(`/appointments`, {
                clienteId: user.id || user._id,
                servicos: Array.isArray(service) ? service.map(s => s._id) : [service._id], 
                data: date,                
                horario: `${hour}:00`      
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setSucessoMensagem('Agendamento realizado com sucesso.');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
        catch (err) {
            const mensagemServidor = err.response?.data?.error || 'Erro ao confirmar agendamento.';
            setErroMensagem(mensagemServidor);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="fixed bottom-24 left-0 w-full flex flex-col items-center px-4 z-50 gap-y-2">
            
            {erroMensagem && (
                <div className="w-full max-w-md bg-[#8E6D67] text-red-500 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg text-center border border-red-500">
                    {erroMensagem}
                </div>
            )}

            {sucessoMensagem && (
                <div className="w-full max-w-md bg-[#8E6D67] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg text-center border border-green-500">
                    {sucessoMensagem}
                </div>
            )}

            <div className="w-full max-w-md bg-[#FAF7F5] text-[#1E2D4A] p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-zinc-700">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-gray-700">Resumo</span>
                    <h3 className="text-sm font-bold truncate max-w-45 sm:max-w-37.5">
                        {Array.isArray(service) ? service.map(s => s.nome).join(', ') : service?.nome}
                    </h3>
                    <p className="text-xs text-[#1E2D4A]">
                        {date} às {hour}:00
                    </p>
                    <p className="text-xs text-[#1E2D4A]">
                        Preço: R$ {Array.isArray(service) ? service.reduce((total, s) => total + (s.preco || 0), 0).toFixed(2) : (service?.preco || 0).toFixed(2)}
                    </p>
                </div>

                <button
                    onClick={handleConfirmar}
                    disabled={carregando}
                    className={`bg-[#8E6D67] text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all
                        ${carregando ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#7a5a52]'}`}
                >
                    {carregando ? 'Processando...' : 'Confirmar'}
                </button>
            </div>
        </div>
    );
}