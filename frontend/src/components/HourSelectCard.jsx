import { useState } from "react";


export default function HourSelectCard({ onHourSelect, horariosOcupados = [] }) {
    const [selectedHour, setSelectedHour] = useState(null);

    const gerarHoras = () => {
        const horas = [];
        for (let i = 9; i <= 18; i++) {
            if (i === 12 || i === 13) continue;
            horas.push(i);
        }
        return horas;
    };

    const horasDisponiveis = gerarHoras();

    const handleSelect = (hour) => {
        setSelectedHour(hour);
        if (onHourSelect) onHourSelect(hour); 
    };

    return (
        
        <div className="grid grid-cols-4 gap-3 p-4 w-full">
            {horasDisponiveis.map((hour) => {
                const isSelected = selectedHour === hour;

               
                const isOcupado = horariosOcupados.includes(hour) || horariosOcupados.includes(`${hour}:00`);

                return (
                    <button
                        key={hour}
                        disabled={isOcupado} 
                        onClick={() => handleSelect(hour)}
                        className={`h-11 rounded-xl shadow-md flex items-center justify-center font-semibold text-sm transition-all duration-200
                            ${isOcupado
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed line-through shadow-none' 
                                : isSelected
                                    ? 'bg-[#8E6D67] text-white scale-105' 
                                    : 'bg-[#ffffff] text-gray-800 hover:bg-gray-50' 
                            }`}
                    >
                        {hour}:00
                    </button>
                );
            })}
        </div>
    );
}