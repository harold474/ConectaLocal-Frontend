import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../index.css'; 

function Navbar({ cantidadCarrito, token, setToken }) {
    const navigate = useNavigate();
    
    // Obtenemos el rol y el nombre del usuario para decidir qué botones mostrar
    const rol = localStorage.getItem('rol');
    const nombreUsuario = localStorage.getItem('nombreUsuario'); // <-- NUEVO: Obtenemos el nombre

    const cerrarSesion = () => {
        localStorage.clear(); // Borra token, rol y datos de sesión
        setToken(null);                   
        toast.success("Sesión cerrada exitosamente");
        navigate('/');                    
    };

    return (
        <nav className="navbar-container">
            <h2 style={{ margin: 0 }}>
                <Link to="/" className="navbar-logo">ConectaLocal</Link>
            </h2>
            
            <div className="navbar-acciones">
                {/* El carrito siempre es visible */}
                <Link to="/carrito" className="carrito-texto" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
                    🛒 Carrito: <strong>{cantidadCarrito}</strong>
                </Link>

                {/* --- SECCIÓN DE USUARIO LOGUEADO --- */}
                {token ? (
                    <>
                        {/* 1. BOTONES EXCLUSIVOS PARA PRODUCTORES */}
                        {rol === 'productor' && (
                            <>
                                {/* NUEVO BOTÓN: MIS PRODUCTOS */}
                                <Link to="/mis-productos" className="btn-nav" style={{ backgroundColor: '#27ae60', marginRight: '10px' }}>
                                    📁 Mis Productos
                                </Link>

                                <Link to="/mis-ventas" className="btn-nav" style={{ backgroundColor: '#2980b9', marginRight: '10px' }}>
                                    📦 Mis Ventas
                                </Link>

                                <Link to="/publicar" className="btn-nav" style={{ backgroundColor: '#f39c12', marginRight: '10px' }}>
                                    + Publicar
                                </Link>
                            </>
                        )}

                        {/* 2. BOTÓN EXCLUSIVO PARA CONSUMIDORES */}
                        {rol === 'consumidor' && (
                            <Link to="/mis-compras" className="btn-nav" style={{ backgroundColor: '#8e44ad', marginRight: '10px' }}>
                                🛍️ Mis Compras
                            </Link>
                        )}

                        {/* --- NUEVO: ENLACE A MI PERFIL (Visible para todos los logueados) --- */}
                        <Link 
                            to="/perfil" 
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                background: 'rgba(255,255,255,0.1)', 
                                padding: '8px 15px', 
                                borderRadius: '20px',
                                textDecoration: 'none',
                                marginRight: '10px'
                            }}
                        >
                            👤 <span style={{ color: 'white', fontWeight: 'bold' }}>{nombreUsuario || 'Mi Perfil'}</span>
                        </Link>

                        {/* Botón de salir visible para todos */}
                        <button onClick={cerrarSesion} className="btn-nav btn-login">
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    /* --- SECCIÓN PARA VISITANTES (SIN LOGUEAR) --- */
                    <>
                        <Link to="/registro" className="btn-nav btn-registro">
                            Registrarse
                        </Link>
                        <Link to="/login" className="btn-nav btn-login">
                            Iniciar Sesión
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;