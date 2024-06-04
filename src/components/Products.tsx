import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { Producto, FieldOnmodal, Categoria } from '../types';
import authStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import ProductModal from './ProductModal';

const emptyProduct: Producto = {
  nombre: '',
  precio: 0,
  categoriaId: 0,
}

const Products: React.FC = () => {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [products, setProducts] = useState<Producto[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalTitle, setModalTitle] = useState('Agregar Producto');
  const [formData, setFormData] = useState<Producto>(emptyProduct);
  const { user } = authStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = user?.token;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get('http://localhost:5114/api/productos', config);
        setProducts(response.data);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
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

    fetchProducts();
    fetchCategories();
  }, []);

  const handleOpenModal = () => {
    setModalTitle('Agregar Producto');
    setIsEditing(false);
    setFormData(emptyProduct);
    setModalIsOpen(true);
  };

  const handleEditProduct = (product: Producto) => {
    setIsEditing(true);
    setModalTitle('Editar Producto');
    setFormData(product);
    setModalIsOpen(true);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  // Agrupar los productos por categoría
  const groupedProducts: Record<number, Producto[]> = {};
  products.forEach((product) => {
      if (!groupedProducts[product.categoriaId]) {
          groupedProducts[product.categoriaId] = [];
      }
      groupedProducts[product.categoriaId].push(product);
  });

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Productos</h2>
      <button
        onClick={handleOpenModal}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
      >
        Agregar Producto
      </button>

      <ProductModal
        setProducts={setProducts}
        products={products}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        isEditing={isEditing}
        modalTitle={modalTitle}
        categories={categories}
        formData={formData}
        setFormData={setFormData} />

      <ul className="mt-4">
        {categories.map((category: Categoria) => (
          <li key={category.id} className="border-b border-gray-300 py-2">
            <details>
              <summary className="cursor-pointer text-blue-500 font-semibold">
                {category.nombre + " "}
                ({category.id && (groupedProducts[category.id]?.length ? groupedProducts[category.id]?.length : 0)} Productos)
              </summary>
              <ul className="list-none p-0 mt-2">
                {category.id && groupedProducts[category.id]?.map((product: Producto) => (
                  <li key={product.id} className="border-b border-gray-300 py-2 flex justify-between items-center">
                    <div className="text-left">
                      <div className="font-semibold">{product.nombre}</div>
                      <div className="text-gray-500">{product.descripcion}</div>
                      <div className="text-gray-500">Precio: ${product.precio}</div>
                      <div className="text-gray-500">Stock: {product.stock}</div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="bg-blue-500 text-white py-1 px-3 rounded mr-2 hover:bg-blue-600 transition duration-200"
                      >
                        Editar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </details>
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

export default Products;
