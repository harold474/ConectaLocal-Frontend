import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import toast from 'react-hot-toast'; 

// Importación de Componentes y Páginas
import Navbar from './components/Navbar';
import Catalogo from './pages/Catalogo';
import Registro from './pages/Registro';
import Login from './pages/Login';
import Carrito from './pages/Carrito';
import Publicar from './pages/Publicar';
import MisVentas from './pages/MisVentas';
import MisCompras from './pages/MisCompras';
import MisProductos from './pages/MisProductos';
import MiPerfil from './pages/MiPerfil'; // <-- 1. NUEVA IMPORTACIÓN DEL PERFIL
import RutaProtegida from './components/RutaProtegida'; // <-- El guardián de rutas

function App() {
  const [carrito, setCarrito] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token')); 

  const agregarAlCarrito = (productoConCantidad) => {
    setCarrito([...carrito, productoConCantidad]);
    toast.success(`Agregado: ${productoConCantidad.cantidad}x ${productoConCantidad.nombre}`, {
      icon: '🛒',
      style: { borderRadius: '10px', background: '#333', color: '#fff' },
    }); 
  };

  return (
    <Router>
      <Toaster 
        position="bottom-right" 
        reverseOrder={false} 
        toastOptions={{ className: 'react-hot-toast', duration: 3000 }}
      />
      
      <Navbar cantidadCarrito={carrito.length} token={token} setToken={setToken} />
      
      <div className="container" style={{ padding: '20px' }}>
        <Routes>
          {/* --- RUTAS PÚBLICAS (Cualquiera entra) --- */}
          <Route path="/" element={<Catalogo agregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          
          {/* --- RUTAS PROTEGIDAS GENERALES (Cualquier usuario logueado) --- */}
          <Route path="/carrito" element={
            <RutaProtegida> 
              <Carrito carrito={carrito} setCarrito={setCarrito} token={token} />
            </RutaProtegida>
          } />

          {/* <-- 2. NUEVA RUTA DE PERFIL --> */}
          <Route path="/perfil" element={
            <RutaProtegida>
              <MiPerfil token={token} />
            </RutaProtegida>
          } />

          {/* --- RUTAS SÓLO PARA CONSUMIDORES --- */}
          <Route path="/mis-compras" element={
            <RutaProtegida rolPermitido="consumidor">
              <MisCompras token={token} />
            </RutaProtegida>
          } />
          
          {/* --- RUTAS SÓLO PARA PRODUCTORES (Blindadas) --- */}
          <Route path="/publicar" element={
            <RutaProtegida rolPermitido="productor">
              <Publicar token={token} />
            </RutaProtegida>
          } />
          
          <Route path="/mis-ventas" element={
            <RutaProtegida rolPermitido="productor">
              <MisVentas token={token} />
            </RutaProtegida>
          } />
          
          <Route path="/mis-productos" element={
            <RutaProtegida rolPermitido="productor">
              <MisProductos token={token} />
            </RutaProtegida>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;