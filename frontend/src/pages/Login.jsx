import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
    const [formData, setFormData] = useState({
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
           
            const response = await api.post('/users/login', formData);
            
            setSucesso('Login realizado com sucesso! Redirecionando...');
            
            
            if (response.data.token) {
                localStorage.setItem('@LeilaSalon:token', response.data.token);
                localStorage.setItem('@LeilaSalon:user', JSON.stringify(response.data.user));
            }

            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setErro(err.response.data.error);
            } else {
                setErro('Telefone  ou senha incorretos. Tente novamente.');
            }
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#fcf9f8] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-y-6">
                
                <div className="text-center">
                    <h1 className="text-3xl font-bold font-title text-[#333]">Acessar Conta</h1>
                    <p className="text-sm text-gray-500 mt-1">Entre para realizar e gerenciar seus agendamentos</p>
                </div>

     
                {erro && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-200">{erro}</div>}
                {sucesso && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-xl border border-green-200">{sucesso}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      
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
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Digite sua senha"
                            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#333] transition-all"
                        />
                    </div>

                   
                    <button
                        type="submit"
                        disabled={carregando}
                        className={`w-full h-12 bg-[#333333] text-white font-bold rounded-xl shadow-md transition-all mt-2
                            ${carregando ? 'opacity-70 cursor-not-allowed' : 'hover:bg-zinc-800 active:scale-[0.98]'}`}
                    >
                        {carregando ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-600 mt-2">
                    Ainda não tem uma conta?{' '}
                    <span 
                        onClick={() => navigate('/cadastro')} 
                        className="font-bold text-[#333] cursor-pointer hover:underline"
                    >
                        Cadastre-se aqui
                    </span>
                </div>

            </div>
        </div>
    );
}