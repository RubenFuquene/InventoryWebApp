import { FormEvent } from "react";
import CustomModal from "./CustomModal";
import { Categoria, FieldOnmodal, Producto } from "../types";
import authStore from "../stores/authStore";
import axios from "axios";

const emptyProduct: Producto = {
  nombre: '',
  precio: 0,
  categoriaId: 0,
}

interface ProductModalProps {
  setProducts: React.Dispatch<React.SetStateAction<Producto[]>>;
  products: Producto[];
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
  modalTitle: string;
  categories: Categoria[];
  formData: Producto;
  setFormData: React.Dispatch<React.SetStateAction<Producto>>;
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  setProducts, 
  products,
  modalIsOpen,
  setModalIsOpen,
  isEditing,
  modalTitle,
  categories,
  formData,
  setFormData
}) => {
  
  const { user } = authStore();

  const handleCloseModal = () => {
    setFormData(emptyProduct);
    setModalIsOpen(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      const response = await axios.post('http://localhost:5114/api/productos', formData, config);
      const createdProduct: Producto = response.data;

      setProducts([...products, createdProduct]);
      setFormData(emptyProduct);
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  };

  const handleUpdateProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = user?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Añadir la fecha de actualización al formData
      const updatedProductData = {
        ...formData,
        fechaActualizacion: new Date().toISOString(),
    };

      await axios.put(`http://localhost:5114/api/productos/${formData.id}`, updatedProductData, config);

      const updatedProducts = products.map((product: Producto) =>
        product.id === formData.id ? updatedProductData : product
      );
      setProducts(updatedProducts);

      setFormData(emptyProduct);
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error al editar el producto:', error);
    }
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
    {
      name: 'precio',
      label: 'Precio',
      type: 'number',
      value: formData.precio,
      onChange: handleChange,
    },
    {
      name: 'categoriaId',
      label: 'Categoría',
      type: 'select',
      value: '' + formData.categoriaId,
      onChange: handleChange,
      options: categories.map((category) => ({ value: '' + category.id, label: category.nombre }))
    },
  ];
  
  return(
    <CustomModal
      isOpen={modalIsOpen}
      onRequestClose={handleCloseModal}
      title={modalTitle}
      fields={fields}
      handleSubmit={isEditing ? handleUpdateProduct : handleSubmit}
      actionButtonText={isEditing ? 'Editar' : 'Guardar'}
    />
  )
}

export default ProductModal;