require('dotenv').config();


const porta = process.env.PORT;
const urlDoBanco = process.env.MONGO_URI;


const express = require('express');
const cors = require('cors');
const conectarBanco = require('./config/db');


const serviceRoutes = require('./routes/ServiceRoute');
const userRoutes = require('./routes/UserRoute');
const appointmentRoutes = require('./routes/AppointmentRoute');



const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);


app.get('/', (req, res) => {
    res.send('BackEnd on!');
});

app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});

conectarBanco();