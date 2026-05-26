
import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import Register from './pages/Register.jsx'; // Ajuste o caminho se o Register estiver em outra pasta
import Login from './pages/Login.jsx'; // Ajuste o caminho se o Login estiver em outra pasta
import Appointments from './pages/Appointments.jsx'; // Ajuste o caminho se o Appointments estiver em outra pasta
import AdminPanel from './pages/Admin.jsx';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/cadastro",
    element: <Register />,
  },
  
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/Appointments",
    element: <Appointments />,
  },
  {
    path: "/Admin",
    element: <AdminPanel />,
  },

  
]);