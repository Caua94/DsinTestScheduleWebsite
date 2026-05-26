import { useState } from 'react';

export default function DataSelectCard({ onDateSelect }) {
    const [selectedDate, setSelectedDate] = useState(null);

  
    const gerarProximos30Dias = () => {
        const listaDatas = [];
        const hoje = new Date();

        for (let i = 0; i < 30; i++) {
            const dataFutura = new Date(hoje);
            dataFutura.setDate(hoje.getDate() + i);

            let diaSemana = dataFutura.toLocaleDateString('pt-BR', { weekday: 'short' });
            diaSemana = diaSemana.replace('.', '');
            diaSemana = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

            const numeroDia = dataFutura.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            const ano = dataFutura.getFullYear();
            const mes = String(dataFutura.getMonth() + 1).padStart(2, '0'); 
            const dia = String(dataFutura.getDate()).padStart(2, '0');
            const idUnico = `${ano}-${mes}-${dia}`;

            listaDatas.push({ id: idUnico, day: diaSemana, number: numeroDia });
        }
        return listaDatas;
    };

    const proximos30Dias = gerarProximos30Dias();

    const handleSelect = (id) => {
        setSelectedDate(id);
        if (onDateSelect) onDateSelect(id);
    };


    return (
        <div className="w-full h-auto flex flex-row overflow-x-auto items-start justify-start p-4 gap-2 scrollbar-none">
            {proximos30Dias.map((item) => {
                const isSelected = selectedDate === item.id;

                return (
                    <div
                        key={item.id}
                        onClick={() => handleSelect(item.id)}
                        className={`w-20 h-20 rounded-2xl shadow-lg flex flex-col items-center justify-center p-4 gap-y-1 cursor-pointer transition-all duration-200 shrink-0
                            ${isSelected
                                ? 'bg-[#8E6D67] text-white scale-105' 
                                : 'bg-[#ffffff] text-gray-800 hover:bg-gray-50' 
                            }`}
                    >
                        <h2 className={`text-xs font-semibold ${isSelected ? 'text-gray-200' : 'text-gray-400'}`}>
                            {item.day}
                        </h2>

                        <p className="text-sm font-bold font-sans">
                            {item.number}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}