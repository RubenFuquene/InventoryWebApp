import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Producto, Categoria } from '../types';
import authStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import ProductModal from './ProductModal';

const emptyProduct: Producto = {
  nombre: '',
  precio: 0,
  categoriaId: 0,
}

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Producto[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [modalProductIsOpen, setModalProductIsOpen] = useState(false);
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
  }, [user]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const filteredProducts = products
    .filter(product =>
      product.nombre.toLowerCase().includes(filter.toLowerCase()) &&
      (selectedCategory ? product.categoriaId === parseInt(selectedCategory) : true)
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.nombre.localeCompare(b.nombre);
      }
      return b.nombre.localeCompare(a.nombre);
    });

  const handleGoBack = () => {
    navigate('/');
  };

  const countProductsOnStock = () => {
    return filteredProducts.reduce((total, product) => total + (product.stock ? product.stock : 0), 0);
  };

  const getRowClassName = (stock: number) => {
    if (stock === 0) {
      return 'bg-red-100';
    } else if (stock > 0 && stock <= 10) {
      return 'bg-yellow-100';
    } else {
      return 'bg-green-100';
    }
  };

  const handleEditProduct = (product: Producto) => {
    setFormData(product);
    setModalProductIsOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Inventario</h2>

      <ProductModal
        setProducts={setProducts}
        products={products}
        modalIsOpen={modalProductIsOpen}
        setModalIsOpen={setModalProductIsOpen}
        isEditing={true}
        modalTitle={'Editar Producto'}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
      />

      <div className="flex flex-col md:flex-row mb-4">
        <input
          type="text"
          placeholder="Buscar producto"
          value={filter}
          onChange={handleFilterChange}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded mb-4 md:mb-0 md:mr-4"
        />
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded mb-4 md:mb-0 md:mr-4"
        >
          <option value="">Todas las categorías</option>
          {categories.map(category => (
            <option key={category.id} value={'' + category.id}>
              {category.nombre}
            </option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
        >
          <option value="asc">Ordenar por Nombre (A-Z)</option>
          <option value="desc">Ordenar por Nombre (Z-A)</option>
        </select>
      </div>

      <div className="hidden md:block">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-300">Nombre</th>
              <th className="py-2 px-4 border-b border-gray-300">Categoría</th>
              <th className="py-2 px-4 border-b border-gray-300">Stock</th>
              <th className="py-2 px-4 border-b border-gray-300">Precio</th>
              <th className="py-2 px-4 border-b border-gray-300">Descripción</th>
              <th className="py-2 px-4 border-b border-gray-300">Última Actualización</th>
              <th className="py-2 px-4 border-b border-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className={getRowClassName(product.stock ? product.stock : 0)}>
                <td className="py-2 px-4 border-b border-gray-300">{product.nombre}</td>
                <td className="py-2 px-4 border-b border-gray-300">{categories.find(cat => cat.id === product.categoriaId)?.nombre}</td>
                <td className="py-2 px-4 border-b border-gray-300">{product.stock}</td>
                <td className="py-2 px-4 border-b border-gray-300">{product.precio}</td>
                <td className="py-2 px-4 border-b border-gray-300">{product.descripcion}</td>
                <td className="py-2 px-4 border-b border-gray-300">{new Date(product.fechaActualizacion!).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b border-gray-300">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-blue-500 text-white py-1 px-2 rounded mr-2 hover:bg-blue-600 transition duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEditProduct}
                    className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 transition duration-200"
                  >
                    Movimiento
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="block md:hidden">
        {filteredProducts.map(product => (
          <div key={product.id} className={`bg-white p-4 mb-4 rounded-lg shadow-md ${getRowClassName(product.stock ? product.stock : 0)}`}>
            <div className="flex justify-between mb-2">
              <h3 className="text-xl font-bold">{product.nombre}</h3>
              <button
                onClick={() => handleEditProduct(product)}
                className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Editar
              </button>
            </div>
            <div className="text-gray-700">
              <p><span className="font-semibold">Categoría:</span> {categories.find(cat => cat.id === product.categoriaId)?.nombre}</p>
              <p><span className="font-semibold">Stock:</span> {product.stock}</p>
              <p><span className="font-semibold">Precio:</span> {product.precio}</p>
              <p><span className="font-semibold">Descripción:</span> {product.descripcion}</p>
              <p><span className="font-semibold">Última Actualización:</span> {new Date(product.fechaActualizacion!).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-end mt-2">
              <button
                onClick={() => navigate(`/add-movement/${product.id}`)}
                className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 transition duration-200"
              >
                Movimiento
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-lg">Total de productos en inventario: {filteredProducts.length}</p>
        <p className="text-lg">Cantidad total de productos en stock: {countProductsOnStock()}</p>
        <p className="text-lg">Valor total del inventario: ${filteredProducts.reduce((total, product) => total + product.precio * (product.stock ? product.stock : 0), 0)}</p>
      </div>

      <button
        onClick={handleGoBack}
        className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
      >
        Volver
      </button>
    </div>
  );
};

export default Inventory;
