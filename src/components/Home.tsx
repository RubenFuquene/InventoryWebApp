import React from 'react';
import { FiLayers, FiBox, FiRefreshCcw, FiList } from 'react-icons/fi';
import authStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { IconButton } from './IconButton';

const Home: React.FC = () => {
  const { user, logout } = authStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Minisistema de Inventarios</h1>
        <div>
          <p className="mb-4">Bienvenido, {user?.user}</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <IconButton icon={<FiLayers />} text="Categorías" onClick={() => navigate('/categories')} />
            <IconButton icon={<FiBox />} text="Productos" onClick={() => navigate('/products')} />
            <IconButton icon={<FiRefreshCcw  />} text="Registrar Movimiento de Producto" onClick={() => navigate('/add-movement')} />
            <IconButton icon={<FiList />} text="Ver Inventarios" onClick={() => navigate('/inventories')} />
          </div>
          <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 mt-4 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Cerrar Sesión
            </button>
        </div>
      </div>
    </div>
  );
};

export default Home;