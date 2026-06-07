import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import QASection from '../components/QASection'; // Ajusta la ruta si es necesario

function MisProductos({ token }) {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modalPreguntas, setModalPreguntas] = useState(null);

    const rol = localStorage.getItem('rol');

    useEffect(() => {
        if (token) obtenerMisProductos();
    }, [token]);

    const obtenerMisProductos = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/mis-productos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await res.json();

            if (res.ok) {
                setProductos(data);
            } else {
                toast.error("Error al cargar tu inventario");
            }
        } catch (error) {
            toast.error("Error al cargar tu inventario");
        } finally {
            setCargando(false);
        }
    };

    // --- FUNCIÓN PARA GUARDAR CAMBIOS RÁPIDOS (STOCK/PRECIO) ---
    const actualizarProducto = async (id, nuevoStock, nuevoPrecio) => {
        try {
            const res = await fetch(`http://localhost:3000/api/productos/${id}/gestion`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    stock: nuevoStock,
                    precio: nuevoPrecio
                })
            });

            if (res.ok) {
                toast.success("¡Inventario actualizado!");
                obtenerMisProductos();
            } else {
                toast.error("Error al actualizar el producto");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    // --- FUNCIÓN PARA ELIMINAR UN PRODUCTO ---
    const eliminarProducto = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto permanentemente? Esta acción no se puede deshacer.")) return;

        try {
            const res = await fetch(`http://localhost:3000/api/productos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                toast.success("Producto eliminado exitosamente");
                obtenerMisProductos();
            } else {
                toast.error("Error al eliminar el producto");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    // Actualiza el estado local mientras el usuario escribe en el input
    const manejarCambioInput = (id, campo, valor) => {
        setProductos(productos.map(p =>
            p.id === id ? { ...p, [campo]: valor } : p
        ));
    };

    if (cargando) {
        return (
            <p className="text-center" style={{ marginTop: '50px' }}>
                Cargando tu inventario...
            </p>
        );
    }

    // ==========================================
    // VISTA 1: INVENTARIO VACÍO
    // ==========================================
    if (productos.length === 0) {
        return (
            <div
                className="carrito-page"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh'
                }}
            >
                <div
                    className="carrito-lista"
                    style={{
                        textAlign: 'center',
                        padding: '60px 40px',
                        maxWidth: '500px',
                        width: '100%'
                    }}
                >
                    <span
                        style={{
                            fontSize: '5rem',
                            display: 'block',
                            marginBottom: '20px',
                            opacity: '0.8'
                        }}
                    >
                        📦
                    </span>

                    <h2 style={{ color: '#2c3e50', margin: '0 0 15px 0' }}>
                        Tu inventario está vacío
                    </h2>

                    <p
                        style={{
                            color: '#7f8c8d',
                            marginBottom: '30px',
                            fontSize: '1.1rem'
                        }}
                    >
                        Aún no tienes productos publicados. ¡Empieza a ofrecerle tus mejores artículos a la comunidad!
                    </p>

                    <Link
                        to="/publicar"
                        className="btn-submit"
                        style={{
                            textDecoration: 'none',
                            display: 'inline-block',
                            padding: '12px 30px',
                            borderRadius: '25px'
                        }}
                    >
                        + Publicar mi primer producto
                    </Link>
                </div>
            </div>
        );
    }

    // ==========================================
    // VISTA 2: INVENTARIO LLENO
    // ==========================================
    return (
        <div
            className="catalogo-container"
            style={{
                padding: '20px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}
        >

            {/* Cabecera con botón de acceso rápido */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: '30px',
                    flexWrap: 'wrap',
                    gap: '15px'
                }}
            >
                <h2
                    className="titulo-pagina"
                    style={{
                        margin: 0,
                        color: '#2c3e50'
                    }}
                >
                    📦 Gestión de Inventario
                </h2>

                <Link
                    to="/publicar"
                    className="btn-submit"
                    style={{
                        textDecoration: 'none',
                        margin: 0,
                        borderRadius: '8px',
                        backgroundColor: '#f39c12'
                    }}
                >
                    + Nuevo Producto
                </Link>
            </div>

            {/* Grid de productos */}
            <div className="grid-productos" style={{ width: '100%' }}>
                {productos.map(producto => {
                    const preguntasPendientes = Number(producto.preguntas_pendientes || 0);

                    return (
                        <div
                            key={producto.id}
                            className="tarjeta-producto"
                            style={{
                                borderTopColor: '#f39c12',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >

                            {/* Imagen miniatura */}
                            <div
                                style={{
                                    height: '160px',
                                    overflow: 'hidden',
                                    borderRadius: '8px',
                                    marginBottom: '15px',
                                    border: '1px solid #eee'
                                }}
                            >
                                {producto.imagenes && producto.imagenes[0] ? (
                                    <img
                                        src={`http://localhost:3000${producto.imagenes[0]}`}
                                        alt={producto.nombre}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            background: '#f8f9fa',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '2.5rem'
                                        }}
                                    >
                                        📷
                                    </div>
                                )}
                            </div>

                            {/* Info básica */}
                            <h3
                                style={{
                                    margin: '0 0 5px 0',
                                    color: '#2c3e50',
                                    fontSize: '1.1rem'
                                }}
                            >
                                {producto.nombre}
                            </h3>

                            <span
                                className="badge-categoria"
                                style={{
                                    background: '#f39c12',
                                    display: 'inline-block',
                                    alignSelf: 'flex-start',
                                    marginBottom: '15px'
                                }}
                            >
                                {producto.categoria || 'Sin categoría'}
                            </span>

                            {/* Panel de Edición Rápida */}
                            <div
                                style={{
                                    background: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    marginBottom: '15px',
                                    border: '1px solid #eee',
                                    marginTop: 'auto'
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '10px',
                                        marginBottom: '10px'
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <label
                                            style={{
                                                display: 'block',
                                                fontSize: '0.8rem',
                                                color: '#7f8c8d',
                                                fontWeight: 'bold',
                                                marginBottom: '5px'
                                            }}
                                        >
                                            Precio ($)
                                        </label>

                                        <input
                                            type="number"
                                            value={producto.precio}
                                            onChange={(e) =>
                                                manejarCambioInput(producto.id, 'precio', e.target.value)
                                            }
                                            className="form-input"
                                            style={{
                                                padding: '8px',
                                                fontSize: '0.9rem'
                                            }}
                                        />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <label
                                            style={{
                                                display: 'block',
                                                fontSize: '0.8rem',
                                                color: '#7f8c8d',
                                                fontWeight: 'bold',
                                                marginBottom: '5px'
                                            }}
                                        >
                                            Stock (Cant)
                                        </label>

                                        <input
                                            type="number"
                                            value={producto.stock}
                                            onChange={(e) =>
                                                manejarCambioInput(producto.id, 'stock', e.target.value)
                                            }
                                            className="form-input"
                                            style={{
                                                padding: '8px',
                                                fontSize: '0.9rem'
                                            }}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() =>
                                        actualizarProducto(producto.id, producto.stock, producto.precio)
                                    }
                                    className="btn-submit"
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        fontSize: '0.9rem',
                                        background: '#2980b9'
                                    }}
                                >
                                    💾 Actualizar
                                </button>
                            </div>

                            {/* Botón para responder preguntas con contador */}
                            <button
                                onClick={() => setModalPreguntas(producto)}
                                style={{
                                    marginBottom: '10px',
                                    width: '100%',
                                    padding: '8px',
                                    background: preguntasPendientes > 0 ? '#e67e22' : '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <span>💬 Responder Preguntas</span>

                                {preguntasPendientes > 0 && (
                                    <span
                                        style={{
                                            background: '#e74c3c',
                                            color: 'white',
                                            borderRadius: '50%',
                                            minWidth: '22px',
                                            height: '22px',
                                            padding: '0 6px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            lineHeight: 1
                                        }}
                                    >
                                        {preguntasPendientes}
                                    </span>
                                )}
                            </button>

                            {/* Botón de peligro */}
                            <button
                                onClick={() => eliminarProducto(producto.id)}
                                style={{
                                    background: 'none',
                                    border: '1px solid #e74c3c',
                                    color: '#e74c3c',
                                    width: '100%',
                                    padding: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    borderRadius: '5px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.background = '#e74c3c';
                                    e.target.style.color = 'white';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.background = 'none';
                                    e.target.style.color = '#e74c3c';
                                }}
                            >
                                🗑️ Eliminar Producto
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Modal de preguntas */}
            {modalPreguntas && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}
                >
                    <div
                        style={{
                            background: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            width: '600px',
                            maxWidth: '100%',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            position: 'relative'
                        }}
                    >
                        <button
                            onClick={() => {
                                setModalPreguntas(null);
                                obtenerMisProductos();
                            }}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '6px 10px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Cerrar
                        </button>

                        <h3
                            style={{
                                marginTop: 0,
                                paddingRight: '80px',
                                color: '#2c3e50'
                            }}
                        >
                            Preguntas sobre: {modalPreguntas.nombre}
                        </h3>

                        <QASection
                            itemId={modalPreguntas.id}
                            userRole={rol}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default MisProductos;