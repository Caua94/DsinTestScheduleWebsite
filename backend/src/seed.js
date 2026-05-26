// backend/src/seed.js
require('dotenv').config();
const mongoose = require('mongoose');

const Service = require('./models/Service');
const User = require('./models/User'); // Mantenha a importação apontando para o seu arquivo de usuário

const servicosDeTeste = [
  {
    nome: "Corte de Cabelo Masculino",
    descricao: "Corte moderno degradê com lavagem inclusa.",
    preco: 45.00,
    duracao: 30
  },
  {
    nome: "Escova Hidratante",
    descricao: "Lavagem com shampoo especial, hidratação profunda e escova.",
    preco: 80.00,
    duracao: 60
  },
  {
    nome: "Coloração Completa",
    descricao: "Aplicação de tinta profissional com proteção de fios.",
    preco: 150.00,
    duracao: 120
  },
  {
    nome: "Design de Sobrancelhas",
    descricao: "Modelagem de sobrancelhas feita na pinça ou linha.",
    preco: 35.00,
    duracao: 25
  }
];

const semearBanco = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // 1. Limpa e insere os Serviços
    await Service.deleteMany({});
   

    await Service.insertMany(servicosDeTeste);


    // 2. CRIAÇÃO DO USUÁRIO ADMINISTRADOR ALINHADO COM O SCHEMA
    
    
    // Como seu Schema não tem campo de 'email', vamos usar o campo 'telefone' para identificar o admin no login!
    const telefoneAdmin = "14999999999"; 
    
    // Busca pelo telefone para evitar duplicidade
    const adminExiste = await User.findOne({ telefone: telefoneAdmin });

    if (!adminExiste) {
      
      

      const novoAdmin = new User({
        nome: "Leila Cabeleleira (Admin)",
        telefone: telefoneAdmin,
        password: "admin123", 
        role: "Administrador"        
      });

      await novoAdmin.save();
      
    } else {
      console.log("Usuário administrador já existe.");
    }

    await mongoose.disconnect();
    console.log("Conexão encerrada.");
    process.exit(0);

  } catch (error) {
    console.error("Erro ao semear banco de dados:", error);
    process.exit(1);
  }
};

semearBanco();