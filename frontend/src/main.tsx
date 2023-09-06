import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from "react-router-dom";
import Main from './Mainn.tsx';
import App from './Menu/App.tsx'
import './index.css'
import Navbar from './navbar/Navbar.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <React.StrictMode>
      <ChakraProvider toastOptions={{ defaultOptions: { position: 'top' } }}>
        <Navbar />
        <Main />
      </ChakraProvider>
    </React.StrictMode>
  </BrowserRouter>
)
