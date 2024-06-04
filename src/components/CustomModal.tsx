import React, { FormEvent } from 'react';
import Modal from 'react-modal';
import { FieldOnmodal } from '../types';

interface CustomModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title: string;
  fields: FieldOnmodal[];
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  actionButtonText: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onRequestClose,
  title,
  fields,
  handleSubmit,
  actionButtonText
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center overflow-auto"
    >
      <div className="bg-white max-w-md w-full mx-auto p-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-semibold mb-1">{field.label}:</label>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={String(field.value)}
                  onChange={field.onChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={field.disabled}
                />
              ) : field.type === 'select' ? (
                <select
                  name={field.name}
                  value={String(field.value)}
                  onChange={field.onChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={field.disabled}
                >
                  <option value="" hidden>
                    Seleccione una opción
                  </option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={String(field.value)}
                  onChange={field.onChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={field.disabled}
                />
              )}
            </div>
          ))}
          <div>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded mr-2 hover:bg-green-600 transition duration-200"
            >
              {actionButtonText}
            </button>
            <button
              type="button"
              onClick={onRequestClose}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CustomModal;
