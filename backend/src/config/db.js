const mongoose = require('mongoose');


const conectarBanco = async () => {
  try {
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB Conectado com sucesso! Host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro crítico ao conectar ao MongoDB: ${error.message}`);
    process.exit(1); 
  }
};


module.exports = conectarBanco;