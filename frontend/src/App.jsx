import { useState } from "react";
import Header from "./components/Header";
import ServiceCard from "./components/ServiceSelectCard";
import DataCard from "./components/DataSelectCard";
import HourCard from "./components/HourSelectCard";
import Navbar from "./components/BottomNavbar";
import ConfirmaAppointment from "./components/ConfirmAppointment";

export default function App() {
  
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  console.log("ESTADOS ATUAIS:", { 
    servico: selectedService ? "OK" : "null", 
    data: selectedDate ? "OK" : "null", 
    hora: selectedHour ? "OK" : "null"
  });
  return (
    
    <div className="w-full min-h-screen bg-[#FAF7F5] flex flex-col justify-center pb-32 font-sans">

      <Header />

      <img src="src/assets/imgs/salonWeb.jpg" alt="Salon" className="w-full h-48 object-cover shadow-lg" />

      <main className="w-full">

        <h1 className="text-2xl font-bold  text-start mt-4 ml-8 text-[#1E2D4A]">Nossos Serviços</h1>
        <div className="w-full h-auto flex flex-wrap items-start justify-start p-4 gap-2">
          
          <ServiceCard onServiceSelect={(service) => setSelectedService(service)} />
        </div>

        <h1 className="text-2xl font-bold  text-start mt-4 ml-8 text-[#1E2D4A]">Agende seu horário</h1>

        <h2 className="text-lg font-semibold text-start ml-8 text-[#1E2D4A]">Data</h2>
        <div className="w-full h-auto flex flex-row overflow-auto items-start justify-start p-4 gap-2">
         
          <DataCard onDateSelect={(date) => setSelectedDate(date)} />
        </div>

        <h2 className="text-lg font-semibold text-start ml-8 text-[#1E2D4A]">Horário</h2>
        <div className="w-full h-auto flex flex-wrap items-start justify-start p-4 gap-2">
          
          <HourCard onHourSelect={(hour) => setSelectedHour(hour)} />
        </div>

      </main>
     
      <ConfirmaAppointment 
        service={selectedService} 
        date={selectedDate} 
        hour={selectedHour} 
      />

      

      <Navbar />
    </div>
  );
}