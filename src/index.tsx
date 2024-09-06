import ReactDOM from 'react-dom/client';
import './styles.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App/App';
import AppProviders from './App/AppProviders';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <AppProviders>
      {/* <React.StrictMode> */}
      <App />
      {/* </React.StrictMode> */}
    </AppProviders>
  </BrowserRouter>
);
