import { useState, useEffect } from 'react';
import api from '../services/api';

export default function SugestaoCard({ dataSelecionada, onAplicarSugestao }) {
    const [sugestao, setSugestao] = useState(null);

    useEffect(() => {
        const checarSugestao = async () => {
            console.log("=== PROP dataSelecionada RECEBIDA ===", dataSelecionada);
            
            if (!dataSelecionada) {
                console.log("Aviso: Nenhuma data selecionada ainda.");
                setSugestao(null);
                return;
            }

            try {
                const userStorage = localStorage.getItem('@LeilaSalon:user');
                if (!userStorage) {
                    console.log("Aviso: @LeilaSalon:user não foi encontrado no localStorage.");
                    return;
                }

                const user = JSON.parse(userStorage);
                const clienteId = user.id || user._id;
                console.log("ID do Cliente logado capturado:", clienteId);

                let dataFormatadaIso = dataSelecionada;

                if (typeof dataSelecionada === 'string' && !dataSelecionada.includes('-')) {
                    const hoje = new Date();
                    const ano = hoje.getFullYear();
                    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
                    const dia = String(dataSelecionada).padStart(2, '0');
                    dataFormatadaIso = `${ano}-${mes}-${dia}`;
                } else if (typeof dataSelecionada === 'number' || (typeof dataSelecionada === 'object' && dataSelecionada.dia)) {
                    const hoje = new Date();
                    const ano = hoje.getFullYear();
                    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
                    const dia = String(dataSelecionada.dia || dataSelecionada).padStart(2, '0');
                    dataFormatadaIso = `${ano}-${mes}-${dia}`;
                }

                console.log("Data convertida enviada para a API:", dataFormatadaIso);

                const response = await api.get(`/appointments/sugestao?clienteId=${clienteId}&data=${dataFormatadaIso}`);
                console.log("=== RESPOSTA DO SERVIDOR ===", response.data);
                
                if (response.data && response.data.sugerir) {
                    console.log("Sugestão confirmada pelo banco! Atualizando estado.");
                    setSugestao(response.data);
                } else {
                    console.log("O servidor respondeu sugerir: false (Nenhum outro agendamento localizado nesta mesma semana).");
                    setSugestao(null);
                }
            } catch (error) {
                console.error("Erro na requisição de sugestão de semana:", error);
                setSugestao(null);
            }
        };

        checarSugestao();
    }, [dataSelecionada]);

    if (!sugestao) {
        return null;
    }

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div className="w-full bg-[#FFF8F1] border border-dashed border-[#F6D3B6] p-4 rounded-2xl flex flex-col items-start text-start gap-y-1">
                <div className="flex items-center gap-x-2">
                    <svg className="w-5 h-5 text-[#8E6D67]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-xs font-bold text-[#8E6D67] uppercase tracking-wider">
                        Sugestão Inteligente
                    </span>
                </div>
                
                <p className="text-xs font-medium text-[#6E737E] leading-relaxed mt-1">
                    Notei que você já tem um agendamento de <span className="font-bold text-gray-800">{sugestao.servicosExistentes}</span> para esta mesma semana ({sugestao.dataSugeridaBr}). Gostaria de agrupar estes serviços para economizar tempo?
                </p>

                <button 
                    onClick={() => onAplicarSugestao(sugestao.dataSugerida)}
                    className="text-xs font-bold text-[#8E6D67] underline mt-1 hover:text-[#765550] transition-all focus:outline-none"
                >
                    Mudar para {sugestao.dataSugeridaBr}
                </button>
            </div>
        </div>
    );
}