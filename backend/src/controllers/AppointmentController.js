const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Service = require('../models/Service');

const HORARIOS_SALAO = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const obterHorariosDisponiveis = async (req, res) => {
    try {
        const { data } = req.query; 
        if (!data) {
            return res.status(400).json({ error: 'A data é obrigatória' });
        }

        const agendamentosExistentes = await Appointment.find({
            data: data,
            status: { $in: ['Pendente', 'Confirmado'] } 
        });

        const horariosOcupados = agendamentosExistentes.map(agendamento => agendamento.horario);
        const resultado = HORARIOS_SALAO.filter(horario => !horariosOcupados.includes(horario));

        return res.status(200).json(resultado);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao obter horários disponíveis' });
    }
};

const criarAgendamento = async (req, res) => {
    try {
        const { clienteId, servicos, data, horario } = req.body;
        
        if (!clienteId || !servicos || !data || !horario) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const horarioOcupado = await Appointment.findOne({ 
            data: data, 
            horario: horario, 
            status: { $in: ['Pendente', 'Confirmado'] } 
        });
        
        if (horarioOcupado) {
            return res.status(400).json({ error: 'O horário selecionado já está ocupado' });
        }

        const novoAgendamento = new Appointment({
            clienteId,
            serviçoId: servicos,
            data,
            horario
        });

        await novoAgendamento.save();

        return res.status(201).json({ message: 'Agendamento criado com sucesso', agendamento: novoAgendamento });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao criar agendamento' });
    }
};

const listarAgendamentos = async (req, res) => {
    try {
        const { clienteId } = req.query;

        if (!clienteId) {
            return res.status(400).json({ error: 'O parâmetro clienteId é obrigatório.' });
        }

        const agendamentosBrutos = await Appointment.find({ clienteId: clienteId });

        const agendamentos = await Promise.all(agendamentosBrutos.map(async (agendamento) => {
            if (agendamento.status === 'Pendente') {
                const dataAtendimentoObj = new Date(`${agendamento.data}T${agendamento.horario}:00`);
                const dataAtual = new Date();
                const diferencialMilissegundos = dataAtendimentoObj.getTime() - dataAtual.getTime();
                const doisDiasEmMs = 172800000;

                if (diferencialMilissegundos < doisDiasEmMs) {
                    agendamento.status = 'Confirmado';
                    await agendamento.save(); 
                }
            }
            
            const dadosCliente = await User.findById(agendamento.clienteId, 'nome email');

            let servicosPreenchidos = [];
            if (agendamento.serviçoId && agendamento.serviçoId.length > 0) {
                const idsParaBuscar = agendamento.serviçoId.map(id => id.toString());
                servicosPreenchidos = await Service.find({
                    _id: { $in: idsParaBuscar }
                }, 'nome preco');
            }

            const agendamentoObjeto = agendamento.toObject();

            return {
                ...agendamentoObjeto,
                status: agendamento.status,
                clienteId: dadosCliente ? { _id: dadosCliente._id, nome: dadosCliente.nome, email: dadosCliente.email } : agendamento.clienteId,
                serviçoId: servicosPreenchidos 
            };
        }));

        return res.status(200).json({ agendamentos });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno ao listar agendamentos' });
    }
};

const listarTodosAgendamentosAdmin = async (req, res) => {
    try {
        const agendamentosBrutos = await Appointment.find().sort({ createdAt: -1 });

        const agendamentos = await Promise.all(agendamentosBrutos.map(async (agendamento) => {
            const dadosCliente = await User.findById(agendamento.clienteId, 'nome email');

            let servicosPreenchidos = [];
            if (agendamento.serviçoId && agendamento.serviçoId.length > 0) {
                const idsParaBuscar = agendamento.serviçoId.map(id => id.toString());
                servicosPreenchidos = await Service.find({
                    _id: { $in: idsParaBuscar }
                }, 'nome preco');
            }

            const agendamentoObjeto = agendamento.toObject();

            return {
                ...agendamentoObjeto,
                clienteId: dadosCliente ? { _id: dadosCliente._id, nome: dadosCliente.nome, email: dadosCliente.email } : { nome: "Cliente Não Encontrado" },
                serviçoId: servicosPreenchidos
            };
        }));

        return res.status(200).json({ agendamentos });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno ao carregar painel de admin.' });
    }
};

const atualizarStatusAgendamento = async (req, res) => {
    try {
        const { id } = req.params;
        const agendamento = await Appointment.findById(id);
        
        if (!agendamento) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }

        agendamento.status = 'Cancelado';
        await agendamento.save();

        return res.status(200).json({ message: 'Agendamento cancelado com sucesso', agendamento });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao cancelar agendamento' });
    }
};

const verificarSugestaoSemana = async (req, res) => {
    try {
        const { clienteId, data } = req.query;

        if (!clienteId || !data) {
            return res.status(400).json({ error: 'Parâmetros clienteId e data são obrigatórios.' });
        }

        const dataAlvo = new Date(`${data}T12:00:00`);
        const diaDaSemana = dataAlvo.getDay();
        
        const primeiroDiaSemana = new Date(dataAlvo);
        primeiroDiaSemana.setDate(dataAlvo.getDate() - diaDaSemana);
        
        const ultimoDiaSemana = new Date(dataAlvo);
        ultimoDiaSemana.setDate(dataAlvo.getDate() + (6 - diaDaSemana));

        const anoInicio = primeiroDiaSemana.getFullYear();
        const mesInicio = String(primeiroDiaSemana.getMonth() + 1).padStart(2, '0');
        const diaInicio = String(primeiroDiaSemana.getDate()).padStart(2, '0');
        const inicioIso = `${anoInicio}-${mesInicio}-${diaInicio}`;

        const anoFim = ultimoDiaSemana.getFullYear();
        const mesFim = String(ultimoDiaSemana.getMonth() + 1).padStart(2, '0');
        const diaFim = String(ultimoDiaSemana.getDate()).padStart(2, '0');
        const fimIso = `${anoFim}-${mesFim}-${diaFim}`;

        const agendamentoExistente = await Appointment.findOne({
            clienteId,
            data: { $gte: inicioIso, $lte: fimIso },
            status: { $in: ['Pendente', 'Confirmado'] }
        });

        if (agendamentoExistente && agendamentoExistente.data !== data) {
            const dadosServico = await Service.find({ _id: { $in: agendamentoExistente.serviçoId } }, 'nome');
            const nomesServicos = dadosServico.map(s => s.nome).join(', ');
            const dataFormatada = agendamentoExistente.data.split('-').reverse().join('/');

            return res.status(200).json({
                sugerir: true,
                dataSugerida: agendamentoExistente.data,
                dataSugeridaBr: dataFormatada,
                servicosExistentes: nomesServicos
            });
        }

        return res.status(200).json({ sugerir: false });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno ao processar sugestão.' });
    }
};

module.exports = {
    obterHorariosDisponiveis,
    criarAgendamento,
    listarAgendamentos,
    listarTodosAgendamentosAdmin,
    atualizarStatusAgendamento,
    verificarSugestaoSemana,
};