import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { UserContextProvider } from './context/UserContext';
import { DemoProvider } from './context/DemoContext';

const root = createRoot(document.getElementById('root'));
root.render(
  <UserContextProvider>
    <DemoProvider>
      <App />
    </DemoProvider>
  </UserContextProvider>
);
