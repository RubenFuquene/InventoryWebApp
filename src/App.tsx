import './App.css'
import AppRouter from './Routers/AppRouter';
import Modal from 'react-modal';

const appElement = document.getElementById('root');

if (appElement) {
  Modal.setAppElement(appElement);
}

function App() {
  return (
    <div>
      <AppRouter />
    </div>
  );
}

export default App
