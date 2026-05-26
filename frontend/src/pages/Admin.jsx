import { useState, useEffect } from 'react';
import api from '../services/api';
import BottomNavbar from '../components/BottomNavbar';

export default function AdminPanel() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para o sistema de feedback e alertas com Tailwind
    const [mensagemStatus, setMensagemStatus] = useState({ texto: '', tipo: '' }); // tipo: 'sucesso' ou 'erro'
    const [modalConfirma, setModalConfirma] = useState({ aberto: false, id: null });

    const carregarPainelAdmin = async () => {
        try {
            const response = await api.get('/appointments/admin');
            if (response.data && response.data.agendamentos) {
                setAgendamentos(response.data.agendamentos);
            }
        } catch (error) {
            console.error('Erro ao carregar dados do admin:', error);
            mostrarAviso('Erro ao carregar dados do painel administrativo.', 'erro');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarPainelAdmin();
    }, []);

    // Função para gerenciar o tempo de exibição do aviso em tela
    const mostrarAviso = (texto, tipo) => {
        setMensagemStatus({ texto, tipo });
        setTimeout(() => {
            setMensagemStatus({ texto: '', tipo: '' });
        }, 4000);
    };

    const abrirConfirmacao = (id) => {
        setModalConfirma({ aberto: true, id });
    };

    const fecharConfirmacao = () => {
        setModalConfirma({ aberto: false, id: null });
    };

    const handleCancelarAdmin = async () => {
        const id = modalConfirma.id;
        fecharConfirmacao();

        try {
            await api.put(`/appointments/cancelar/${id}`);
            mostrarAviso('Agendamento cancelado com sucesso.', 'sucesso');

            setAgendamentos(prev => prev.map(ag => ag._id === id ? { ...ag, status: 'Cancelado' } : ag));
        } catch (error) {
            const erroMsg = error.response?.data?.error || 'Erro ao cancelar agendamento.';
            mostrarAviso(erroMsg, 'erro');
        }
    };

    if (loading) return <p className="text-center p-8 text-sm text-gray-500">Abrindo o painel administrativo...</p>;

    return (
        <div className="w-full max-w-4xl mx-auto p-4 pb-24 relative">

            {/* SISTEMA DE AVISO EM TAILWIND (TOAST NOTIFICATION) */}
            {mensagemStatus.texto && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
                    <div className={`w-full p-3 rounded-xl text-sm font-semibold text-center shadow-xl border transition-all duration-300
                        ${mensagemStatus.tipo === 'sucesso'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                    >
                        {mensagemStatus.texto}
                    </div>
                </div>
            )}

           
            {modalConfirma.aberto && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-fade-in">
                        <h2 className="text-base font-bold text-gray-800 text-start">Confirmar Cancelamento</h2>
                        <p className="text-xs text-gray-500 text-start mt-2">
                            Tem certeza que deseja cancelar o agendamento deste cliente? Esta ação atualizará o status no banco de dados.
                        </p>
                        <div className="flex items-center justify-end gap-x-3 mt-6">
                            <button
                                onClick={fecharConfirmacao}
                                className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-4 py-2 rounded-xl transition-all"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleCancelarAdmin}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all active:scale-95"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-y-1 text-start mb-6 border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-bold text-[#333]">Painel Administrativo</h1>
                <p className="text-xs text-gray-500">Gerencie todos os horários e solicitações feitas no salão</p>
            </div>

            {agendamentos.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-12">Nenhum agendamento registrado no sistema até o momento.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agendamentos.map((ag) => {
                        const dataBr = ag.data.split('-').reverse().join('/');

                        return (
                            <div
                                key={ag._id}
                                className={`bg-white border rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-y-4 transition-all
                                    ${ag.status === 'Cancelado' ? 'opacity-60 border-gray-200' : 'border-gray-100 hover:shadow-md'}`}
                            >
                               
                                <div className="flex items-start justify-between">
                                    <div className="text-start">
                                        <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Cliente</span>
                                        <h3 className="text-base font-bold text-gray-800 mt-1">{ag.clienteId?.nome || 'Não identificado'}</h3>
                                        <p className="text-xs text-gray-400">{ag.clienteId?.email || ''}</p>
                                    </div>

                                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider
                                        ${ag.status === 'Confirmado' ? 'bg-green-100 text-green-700' : ''}
                                        ${ag.status === 'Pendente' ? 'bg-amber-100 text-amber-700' : ''}
                                        ${ag.status === 'Cancelado' ? 'bg-red-100 text-red-700' : ''}
                                    `}>
                                        {ag.status}
                                    </span>
                                </div>

                           
                                <div className="bg-gray-50 rounded-xl p-3 text-start flex flex-col gap-y-2">
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                                        <span>Data: {dataBr}</span>
                                        <span>Horário: {ag.horario}</span>
                                    </div>
                                    <div className="border-t border-gray-200/60 pt-1.5">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Serviços escolhidos:</span>
                                        <p className="text-xs font-semibold text-[#63433e] mt-0.5">
                                            {ag.serviçoId && ag.serviçoId.length > 0
                                                ? ag.serviçoId.map(s => `${s.nome} (R$ ${s.preco?.toFixed(2)})`).join(', ')
                                                : 'Nenhum serviço mapeado'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end border-t border-gray-50 pt-2">
                                    {ag.status !== 'Cancelado' ? (
                                        <button
                                            onClick={() => abrirConfirmacao(ag._id)}
                                            className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 focus:outline-none"
                                        >
                                            Cancelar Agendamento
                                        </button>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic font-medium">Agendamento Cancelado</span>
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