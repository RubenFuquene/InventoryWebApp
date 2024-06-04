import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { Categoria, FieldOnmodal } from '../types';
import authStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import CustomModal from './CustomModal';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalTitle, setModalTitle] = useState('Agregar Categoría');
  const [formData, setFormData] = useState<Categoria>({
    nombre: '',
    descripcion: '',
  });
  const { user } = authStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Función para obtener las categorías
    const fetchCategories = async () => {
      try {
        const token = user?.token // Obtener el token de la tienda
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Adjuntar el token al encabezado de autorización
          },
        };
        const response = await axios.get('http://localhost:5114/api/categorias', config);
        setCategories(response.data);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleOpenModal = () => {
    setModalTitle('Agregar Categoría');
    setIsEditing(false);
    setFormData({ nombre: '', descripcion: '' });
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    // Limpiar el formulario
    setFormData({ 
      nombre: '',
      descripcion: '',
    });

    setModalIsOpen(false);
  };

  const handleEditCategory = (category: Categoria) => {
    setIsEditing(true);
    setModalTitle('Editar Categoría');
    setFormData(category);
    setModalIsOpen(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = user?.token // Obtener el token de la tienda
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Adjuntar el token al encabezado de autorización
          },
        };

      const response = await axios.post('http://localhost:5114/api/categorias', formData, config);
      const createdCategory:Categoria = response.data; // Obtener la categoría creada del cuerpo de la respuesta

      // Actualizar la lista de categorías después de agregar una nueva
      setCategories([...categories, createdCategory]);

      // Limpiar el formulario después de enviar
      setFormData({ 
        nombre: '',
        descripcion: '',
      });

      // Cerrar el modal
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error al agregar la categoría:', error);
    }
  };

  // Función para enviar la categoría editada a la API
  const handleUpdateCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = user?.token; // Obtener el token de la tienda
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Adjuntar el token al encabezado de autorización
        },
      };
      // Realizar la solicitud PUT a la API con el formData de edición
      await axios.put(`http://localhost:5114/api/categorias/${formData.id}`, formData, config);

      // Actualizar la lista de categorías con la categoría editada
      const updatedCategories = categories.map((category) =>
        category.id === formData.id ? formData : category
      );
      setCategories(updatedCategories);

      // Limpiar el formData de edición
      setFormData({
        nombre: '',
        descripcion: '',
      });

      // Cerrar el modal de edición
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error al editar la categoría:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const fields: FieldOnmodal[] = [
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      value: formData.nombre,
      onChange: handleChange,
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      value: formData.descripcion || '',
      onChange: handleChange,
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Categorías</h2>
      <button
        onClick={handleOpenModal}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
      >
        Agregar Categoría
      </button>

      <CustomModal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        title={modalTitle}
        fields={fields}
        handleSubmit={isEditing ? handleUpdateCategory : handleSubmit}
        actionButtonText={isEditing ? 'Editar' : 'Guardar'}
      />

      <ul className="mt-4">
        {categories.map((category: Categoria) => (
          <li key={category.id} className="border-b border-gray-300 py-2 flex justify-between items-center">
            <div className="text-left">
              <div className="font-semibold">{category.nombre}</div>
              <div className="text-gray-500">{category.descripcion}</div>
            </div>
            <div>
              <button
                onClick={() => handleEditCategory(category)}
                className="bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600 transition duration-200"
              >
                Editar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={handleGoBack}
        className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
      >
        Volver
      </button>
    </div>
  );
};

export default Categories;