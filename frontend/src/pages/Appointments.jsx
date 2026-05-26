import { useState, useEffect } from 'react';
import api from '../services/api';
import BottomNavbar from '../components/BottomNavbar';

export default function HistoricoAppointments() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroDias, setFiltroDias] = useState('todos');

    // Estados para o sistema de feedback e alertas com Tailwind
    const [mensagemStatus, setMensagemStatus] = useState({ texto: '', tipo: '' }); // 'sucesso' ou 'erro'
    const [modalConfirma, setModalConfirma] = useState({ aberto: false, id: null });

    useEffect(() => {
        const buscarHistorico = async () => {
            try {
                const userStorage = localStorage.getItem('@LeilaSalon:user');
                if (!userStorage) return;

                const user = JSON.parse(userStorage);
                const clienteId = user.id || user._id;

                const response = await api.get(`/appointments?clienteId=${clienteId}`);

                if (response.data && response.data.agendamentos) {
                    setAgendamentos(response.data.agendamentos);
                }
            } catch (error) {
                console.error('Erro ao buscar histórico:', error);
                mostrarAviso('Erro ao carregar o histórico de agendamentos.', 'erro');
            } finally {
                setLoading(false);
            }
        };

        buscarHistorico();
    }, []);

    const mostrarAviso = (texto, tipo) => {
        setMensagemStatus({ texto, tipo });
        setTimeout(() => {
            setMensagemStatus({ texto: '', tipo: '' });
        }, 4000);
    };

    const podeAlterarPeloSistema = (dataAgendada, horarioAgendado) => {
        try {
            const dataDoAgendamento = new Date(`${dataAgendada}T${horarioAgendado}`);
            const dataAtual = new Date();

            const diferencaTempo = dataDoAgendamento.getTime() - dataAtual.getTime();
            const diferencaDias = diferencaTempo / (1000 * 60 * 60 * 24);

            return diferencaDias >= 2;
        } catch (e) {
            return false;
        }
    };

    const abrirConfirmacao = (id) => {
        setModalConfirma({ aberto: true, id });
    };

    const fecharConfirmacao = () => {
        setModalConfirma({ aberto: false, id: null });
    };

    const handleCancelar = async () => {
        const id = modalConfirma.id;
        fecharConfirmacao();

        try {
            const token = localStorage.getItem('@LeilaSalon:token');
            await api.put(`/appointments/cancelar/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            mostrarAviso('Agendamento cancelado com sucesso.', 'sucesso');
            setAgendamentos(prev => prev.map(ag => ag._id === id ? { ...ag, status: 'Cancelado' } : ag));
        } catch (error) {
            const erroMsg = error.response?.data?.error || 'Erro ao cancelar agendamento.';
            mostrarAviso(erroMsg, 'erro');
        }
    };

    if (loading) return <p className="text-center p-8 text-gray-500 text-sm">Carregando seu histórico...</p>;

    return (
        <div className="w-full mx-auto p-4 pb-32 relative bg-[#FAF7F5] min-h-screen rounded-2xl shadow-xl font-sans">

            {/* SISTEMA DE AVISO EM TAILWIND (TOAST NOTIFICATION) */}
            {mensagemStatus.texto && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4">
                    <div className={`w-full p-3 rounded-xl text-sm font-semibold text-center shadow-xl border transition-all duration-300
                        ${mensagemStatus.tipo === 'sucesso'
                            ? 'bg-[#8E6D67] text-white border-[#8E6D67]'
                            : 'bg-[#8E6D67] text-red-500 border-[#8E6D67]'
                        }`}
                    >
                        {mensagemStatus.texto}
                    </div>
                </div>
            )}

         
            {modalConfirma.aberto && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#FAF7F5] rounded-2xl max-w-xs w-full p-6 shadow-2xl border border-gray-100">
                        <h2 className="text-base font-bold text-[#1E2D4A] text-start">Confirmar Cancelamento</h2>
                        <p className="text-xs text-[#1E2D4A] text-start mt-2">
                            Tem certeza que deseja cancelar este agendamento? Esta ação não poderá ser desfeita.
                        </p>
                        <div className="flex items-center justify-end gap-x-3 mt-6">
                            <button
                                onClick={fecharConfirmacao}
                                className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-4 py-2 rounded-xl transition-all"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleCancelar}
                                className="bg-[#8E6D67] hover:bg-[#7a5a52] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all active:scale-95"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1E2D4A] font-title">Meus Agendamentos</h2>

                <select
                    value={filtroDias}
                    onChange={(e) => setFiltroDias(e.target.value)}
                    className="text-xs bg-white border border-gray-200 rounded-xl px-2 py-1 text-gray-600 focus:outline-none"
                >
                    <option value="todos">Todos os períodos</option>
                    <option value="30">Últimos 30 dias</option>
                    <option value="60">Últimos 60 dias</option>
                </select>
            </div>

            {agendamentos.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-12">Você não possui nenhum agendamento marcado.</p>
            ) : (
                <div className="flex flex-col gap-y-4">
                    {agendamentos.map((agendamento) => {
                        const liberadoParaAlterar = podeAlterarPeloSistema(agendamento.data, agendamento.horario);
                        const dataBr = agendamento.data.split('-').reverse().join('/');

                        return (
                            <div
                                key={agendamento._id}
                                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-md flex flex-col gap-y-3 transition-all"
                            >
                                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                                    <span className="text-sm font-bold text-gray-700">{dataBr} às {agendamento.horario}</span>
                                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider
                                        ${agendamento.status === 'Confirmado' ? 'bg-green-50 text-green-600' : ''}
                                        ${agendamento.status === 'Pendente' ? 'bg-amber-50 text-amber-600' : ''}
                                        ${agendamento.status === 'Cancelado' ? 'bg-red-50 text-red-600' : ''}
                                        ${agendamento.status === 'Concluído' ? 'bg-blue-50 text-blue-600' : ''}
                                    `}>
                                        {agendamento.status}
                                    </span>
                                </div>

                                <div className="text-start">
                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Serviços solicitados</span>
                                    <p className="text-sm font-semibold text-[#1E2D4A] mt-0.5">
                                        {agendamento.serviçoId && agendamento.serviçoId.length > 0 ? (
                                            agendamento.serviçoId.map(s => s.nome).join(', ')
                                        ) : (
                                            'Nenhum serviço mapeado'
                                        )}
                                    </p>
                                </div>

                                <div className="pt-1 flex items-center justify-end">
                                    {agendamento.status !== 'Cancelado' && agendamento.status !== 'Concluído' && (
                                        liberadoParaAlterar ? (
                                            <button
                                                onClick={() => abrirConfirmacao(agendamento._id)}
                                                className="text-xs font-bold text-[#8E6D67] hover:text-[#7a5a52] active:scale-95 transition-all focus:outline-none"
                                            >
                                                Cancelar Agendamento
                                            </button>
                                        ) : (
                                            <span className="text-[11px] text-gray-400 font-medium italic text-right w-full bg-gray-50 p-2 rounded-xl border border-gray-100">
                                                Alterações e cancelamentos apenas por telefone para prazos menores que 2 dias.
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <BottomNavbar />
        </div>
    );
}