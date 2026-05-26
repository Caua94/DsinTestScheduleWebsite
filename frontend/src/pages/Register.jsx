import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../services/api';

export default function Register() {
    const [formData, setFormData] = useState({
        nome: '',
        telefone: '',
        password: '' 
    });

    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setSucesso('');
        setCarregando(true);

        try {
            
            const response = await api.post('/users/criar', formData);
            
            setSucesso(response.data.message || 'Cadastro realizado com sucesso!');
            
            setFormData({ nome: '', telefone: '', password: '' });

            setTimeout(() => {
                navigate('/login'); 
            }, 2000);

        } catch (err) {
            console.log("ERRO DETALHADO DO BACKEND:", err.response?.data);

            if (err.response && err.response.data && err.response.data.error) {
                setErro(err.response.data.error);
            } else {
                setErro('Não foi possível conectar ao servidor. Tente novamente.');
            }
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#fcf9f8] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-y-6">
                
                <div className="text-center">
                    <h1 className="text-3xl font-bold font-title text-[#333]">Criar Conta</h1>
                    <p className="text-sm text-gray-500 mt-1">Cadastre-se para gerenciar seus agendamentos</p>
                </div>

                {/* Mensagens de Feedback */}
                {erro && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-200">{erro}</div>}
                {sucesso && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-xl border border-green-200">{sucesso}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
                    
                   
                    <div className="flex flex-col gap-y-1">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Nome Completo</label>
                        <input 
                            type="text" 
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                            placeholder="Digite seu nome"
                            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#333] transition-all"
                        />
                    </div>

                    
                    <div className="flex flex-col gap-y-1">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Telefone (WhatsApp)</label>
                        <input 
                            type="tel" 
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                            required
                            placeholder="(11) 99999-9999"
                            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#333] transition-all"
                        />
                    </div>

                  
                    <div className="flex flex-col gap-y-1">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Senha</label>
                        <input 
                            type="password" 
                            name="password" // 🎯 CORREÇÃO CRÍTICA: name alterado de 'senha' para 'password'
                            value={formData.password} // 🎯 CORREÇÃO CRÍTICA: value alterado de formData.senha para formData.password
                            onChange={handleChange}
                            required
                            placeholder="Crie uma senha segura"
                            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#333] transition-all"
                        />
                    </div>

                   
                    <button
                        type="submit"
                        disabled={carregando}
                        className={`w-full h-12 bg-[#333333] text-white font-bold rounded-xl shadow-md transition-all mt-2
                            ${carregando ? 'opacity-70 cursor-not-allowed' : 'hover:bg-zinc-800 active:scale-[0.98]'}`}
                    >
                        {carregando ? 'Cadastrando...' : 'Concluir Cadastro'}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-600 mt-2">
                    Já tem uma conta?{' '}
                    <span 
                        onClick={() => navigate('/login')} 
                        className="font-bold text-[#333] cursor-pointer hover:underline"
                    >
                        Faça login
                    </span>
                </div>

            </div>
        </div>
    );
}