
export const IconButton: React.FC<{ icon: React.ReactNode; text: string; onClick: () => void }> = ({ icon, text, onClick }) => (
  <button
    className="bg-blue-500 text-white py-2 px-4 rounded-lg flex flex-col items-center justify-center hover:bg-blue-600 transition duration-200"
    onClick={onClick}
  >
    {icon}
    <span className="mt-1">{text}</span>
  </button>
);