import { useState, useEffect } from 'react';
import api from '../services/api';

function ServiceCard({ onServiceSelect }) {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedServices, setSelectedServices] = useState([]); 

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/services');
                if (response.data && response.data.servicos) {
                    setServices(response.data.servicos);
                }
            } catch (error) {
                console.error('Erro ao buscar serviços:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleSelect = (service) => {
        let updatedServices;

        if (selectedServices.includes(service._id)) {
            updatedServices = selectedServices.filter(id => id !== service._id);
        } else {
            updatedServices = [...selectedServices, service._id];
        }

        setSelectedServices(updatedServices);

        if (onServiceSelect) {
            const fullSelectedServices = services.filter(s => updatedServices.includes(s._id));
            onServiceSelect(fullSelectedServices); 
        }
    };

    if (loading) return <p className="text-sm text-gray-500 pl-4">Carregando os serviços...</p>;

    return (
        <div className="grid grid-cols-2 gap-4 p-4 w-full">
            {services.map((service) => {
                const isSelected = selectedServices.includes(service._id);

                return (
                    <div
                        key={service._id}
                        onClick={() => handleSelect(service)}
                        className={`w-full h-30 rounded-2xl shadow-xl flex flex-col items-start justify-center p-4 gap-y-1 cursor-pointer transition-all duration-200
                            ${isSelected
                                ? 'bg-[#8E6D67] text-white scale-105'
                                : 'bg-[#ffffff] text-gray-800 hover:bg-gray-50'
                            }`}
                    >
                        <div className={`rounded-3xl w-8 h-8 flex items-center justify-center ${isSelected ? 'bg-zinc-700' : 'bg-slate-200'}`}>
                            <svg className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-800'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z" />
                            </svg>
                        </div>

                        <h2 className="text-sm font-semibold text-truncate w-full mt-1">{service.nome}</h2>
                        <p className={`text-sm ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>R$ {service.preco?.toFixed(2)}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default ServiceCard;