import { useState } from "react";
import authStore from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login: React.FC = () => {
  const [userField, setUserField] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { setUser, login } = authStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Realizar la solicitud POST al endpoint de inicio de sesión
      const response = await axios.post('http://localhost:5114/api/auth/login', {
        username: userField,
        password,
      });

      // Verificar si la solicitud fue exitosa y obtener los datos del usuario y el token
      const { data } = response;
      const { token } = data;

      // Establecer el usuario y el token en el estado de autenticación
      setUser({ id: 1, user: userField, token: token });
      login();

      // Redirigir al usuario a la página principal
      navigate('/');
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setError('El usuario o la contraseña son incorrectos.'); // Mostrar un mensaje de error al usuario
      } else {
        setError('Se produjo un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="user" className="block text-gray-700">Usuario</label>
            <input
              id="user"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Usuario"
              value={userField}
              onChange={(e) => setUserField(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;