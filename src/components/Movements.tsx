import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { MovimientoInventario, FieldOnmodal, Producto, Categoria } from '../types';
import authStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import CustomModal from './CustomModal';

const emptyMovement: MovimientoInventario = {
  productoId: 0,
  tipoMovimiento: 'entrada',
  cantidad: 0,
  descripcion: '',
};

const Movements: React.FC = () => {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [movements, setMovements] = useState<MovimientoInventario[]>([]);
  const [products, setProducts] = useState<Producto[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalTitle, setModalTitle] = useState('Registrar Movimiento');
  const [formData, setFormData] = useState<MovimientoInventario>(emptyMovement);
  const { user } = authStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const token = user?.token;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get('http://localhost:5114/api/MovimientosInventario', config);
        setMovements(response.data);
      } catch (error) {
        console.error('Error al obtener los movimientos:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const token = user?.token;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get('http://localhost:5114/api/categorias', config);
        setCategories(response.data);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchMovements();
    fetchCategories();
  }, [user]);

  useEffect(() => {
    if (formData.categoriaId !== 0) {
      const fetchProducts = async () => {
        try {
          const token = user?.token;
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get(`http://localhost:5114/api/productos/categoria/${formData.categoriaId}`, config);
          setProducts(response.data);
        } catch (error) {
          console.error('Error al obtener los productos:', error);
        }
      };

      fetchProducts();
    }
  }, [formData.categoriaId, user]);

  const handleOpenModal = () => {
    setModalTitle('Registrar Movimiento');
    setIsEditing(false);
    setFormData(emptyMovement);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setFormData(emptyMovement);
    setModalIsOpen(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = user?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post('http://localhost:5114/api/MovimientosInventario/registrarMovimiento', formData, config);
      const createdMovement: MovimientoInventario = response.data;

      setMovements([...movements, createdMovement]);
      setFormData(emptyMovement);
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error al registrar el movimiento:', error);
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
      name: 'categoriaId',
      label: 'Categoría',
      type: 'select',
      value: '' + formData.categoriaId,
      onChange: handleChange,
      options: categories.map((category) => ({ value: '' + category.id, label: category.nombre })),
    },
    {
      name: 'productoId',
      label: 'Producto',
      type: 'select',
      value: formData.productoId,
      onChange: handleChange,
      options: products.map((product) => ({ value: '' + product.id, label: product.nombre })),
      disabled: !formData.categoriaId
    },
    {
      name: 'tipoMovimiento',
      label: 'Tipo de Movimiento',
      type: 'select',
      value: formData.tipoMovimiento,
      onChange: handleChange,
      options: [
        { value: 'entrada', label: 'Entrada' },
        { value: 'salida', label: 'Salida' }
      ]
    },
    {
      name: 'cantidad',
      label: 'Cantidad',
      type: 'number',
      value: formData.cantidad,
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
      <h2 className="text-2xl font-bold mb-4">Registrar Movimiento de Inventario</h2>
      <button
        onClick={handleOpenModal}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
      >
        Registrar Movimiento
      </button>

      <CustomModal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        title={modalTitle}
        fields={fields}
        handleSubmit={handleSubmit}
        actionButtonText="Guardar"
      />

      <ul className="mt-4">
        {movements.map((movement: MovimientoInventario) => (
          <li key={movement.id} className="border-b border-gray-300 py-2 flex justify-between items-center">
            <div className="text-left">
              <div className="font-semibold">Producto ID: {movement.productoId}</div>
              <div className="text-gray-500">Tipo de Movimiento: {movement.tipoMovimiento}</div>
              <div className="text-gray-500">Cantidad: {movement.cantidad}</div>
              <div className="text-gray-500">Descripción: {movement.descripcion}</div>
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

export default Movements;
