import ReactDOM from 'react-dom/client';
import './style.css';
import { BrowserRouter } from 'react-router-dom';

import App from './App/App';
import AppProviders from './App/AppProviders';

import 'react-loading-skeleton/dist/skeleton.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppProviders>
      <App />
    </AppProviders>
  </BrowserRouter>
);
