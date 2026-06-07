import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../index.css'; 

function Navbar({ cantidadCarrito, token, setToken }) {
    const navigate = useNavigate();
    
    // Obtenemos el rol y el nombre del usuario para decidir qué botones mostrar
    const rol = localStorage.getItem('rol');
    const nombreUsuario = localStorage.getItem('nombreUsuario'); 

    const cerrarSesion = () => {
        localStorage.clear(); // Borra token, rol y datos de sesión
        setToken(null);                    
        toast.success("Sesión cerrada exitosamente");
        navigate('/');                     
    };

    // Estilos constantes para mantener la consistencia profesional
    const btnStyle = {
        padding: '8px 16px',
        borderRadius: '8px',
        textDecoration: 'none',
        color: 'white',
        fontSize: '0.85rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    };

    return (
        <nav className="navbar-container" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '15px 30px', 
            backgroundColor: '#1a252f', 
            color: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{ margin: 0 }}>
                <Link to="/" className="navbar-logo" style={{ textDecoration: 'none', color: '#27ae60', fontSize: '1.5rem', fontWeight: '800' }}>ConectaLocal</Link>
            </h2>
            
            <div className="navbar-acciones" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {/* El carrito siempre es visible */}
                <Link to="/carrito" className="carrito-texto" style={{ color: 'white', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    🛒 Carrito: <strong>{cantidadCarrito}</strong>
                </Link>

                {/* --- SECCIÓN DE USUARIO LOGUEADO --- */}
                {token ? (
                    <>
                        {/* 1. BOTONES EXCLUSIVOS PARA PRODUCTORES */}
                        {rol === 'productor' && (
                            <>
                                <Link to="/mis-productos" style={{ ...btnStyle, backgroundColor: '#27ae60' }}>📁 Mis Productos</Link>
                                <Link to="/mis-ventas" style={{ ...btnStyle, backgroundColor: '#2980b9' }}>📦 Mis Ventas</Link>
                                <Link to="/publicar" style={{ ...btnStyle, backgroundColor: '#f39c12' }}>+ Publicar</Link>
                            </>
                        )}

                        {/* 2. BOTÓN EXCLUSIVO PARA CONSUMIDORES */}
                        {rol === 'consumidor' && (
                            <Link to="/mis-compras" style={{ ...btnStyle, backgroundColor: '#8e44ad' }}>🛍️ Mis Compras</Link>
                        )}

                        {/* 3. BOTÓN EXCLUSIVO PARA ADMINISTRADORES */}
                        {(rol === 'admin' || rol === 'administrador') && (
                            <Link to="/admin/usuarios" style={{ ...btnStyle, backgroundColor: '#e74c3c' }}>🛡️ Panel Admin</Link>
                        )}

                        {/* --- ENLACE A MI PERFIL --- */}
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
                                color: 'white',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}
                        >
                            👤 {nombreUsuario || 'Mi Perfil'}
                        </Link>

                        {/* Botón de salir */}
                        <button onClick={cerrarSesion} style={{ ...btnStyle, backgroundColor: 'transparent', border: '1px solid #7f8c8d', color: '#ecf0f1', cursor: 'pointer' }}>
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    /* --- SECCIÓN PARA VISITANTES --- */
                    <>
                        <Link to="/registro" style={{ ...btnStyle, backgroundColor: 'transparent', border: '1px solid #27ae60', color: '#27ae60' }}>
                            Registrarse
                        </Link>
                        <Link to="/login" style={{ ...btnStyle, backgroundColor: '#27ae60' }}>
                            Iniciar Sesión
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;