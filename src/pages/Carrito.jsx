import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Carrito({ carrito, setCarrito, token }) {
    const navigate = useNavigate();
    const [procesando, setProcesando] = useState(false);
    
    // Estado para guardar los datos de envío del cliente
    const [datosEnvio, setDatosEnvio] = useState({
        tipo_entrega: 'domicilio',
        direccion: '',
        barrio: '',
        telefono: ''
    });

    const total = carrito.reduce((sum, item) => sum + (Number(item.precio) * item.cantidad), 0);

    const eliminarDelCarrito = (indexToRemove) => {
        const nuevoCarrito = carrito.filter((_, index) => index !== indexToRemove);
        setCarrito(nuevoCarrito);
        toast.success("Producto retirado del carrito");
    };

    const manejarCambio = (e) => {
        setDatosEnvio({ ...datosEnvio, [e.target.name]: e.target.value });
    };

    const confirmarPedido = async (e) => {
        e.preventDefault();
        
        if (!token) {
            toast.error("Debes iniciar sesión para comprar");
            navigate('/login');
            return;
        }

        if (datosEnvio.tipo_entrega === 'domicilio' && (!datosEnvio.direccion || !datosEnvio.barrio)) {
            toast.error("Por favor completa tu dirección y barrio para el envío.");
            return;
        }

        if (!datosEnvio.telefono) {
            toast.error("El teléfono de contacto es obligatorio.");
            return;
        }

        setProcesando(true);

        try {
            const res = await fetch('/api/pedidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    total,
                    carrito,
                    ...datosEnvio
                })
            });

            if (res.ok) {
                toast.success("¡Pedido realizado con éxito! 🎉", { duration: 4000 });
                setCarrito([]); // Vaciamos el carrito
                navigate('/mis-compras'); // Lo enviamos a ver su compra
            } else {
                const data = await res.json();
                toast.error(data.error || "No se pudo procesar el pedido.");
            }
        } catch (error) {
            toast.error("Error de conexión con el servidor.");
        } finally {
            setProcesando(false);
        }
    };

    // ==========================================
    // VISTA 1: CARRITO VACÍO (Diseño Centrado)
    // ==========================================
    if (carrito.length === 0) {
        return (
            <div className="carrito-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="carrito-lista" style={{ textAlign: 'center', padding: '60px 40px', maxWidth: '500px', width: '100%' }}>
                    <span style={{ fontSize: '5rem', display: 'block', marginBottom: '20px', opacity: '0.8' }}>🛒</span>
                    <h2 style={{ color: '#2c3e50', margin: '0 0 15px 0' }}>Tu carrito está vacío</h2>
                    <p style={{ color: '#7f8c8d', marginBottom: '30px', fontSize: '1.1rem' }}>
                        ¡Parece que aún no has descubierto los increíbles productos de tu comunidad!
                    </p>
                    <Link to="/" className="btn-submit" style={{ textDecoration: 'none', display: 'inline-block', padding: '12px 30px', borderRadius: '25px' }}>
                        Explorar Catálogo Local
                    </Link>
                </div>
            </div>
        );
    }

    // ==========================================
    // VISTA 2: CARRITO CON PRODUCTOS (Dos Columnas)
    // ==========================================
    return (
        <div className="carrito-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h2 className="titulo-pagina" style={{ marginBottom: '30px', color: '#2c3e50' }}>🛒 Finalizar Compra</h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'flex-start' }}>
                
                {/* COLUMNA IZQUIERDA: LISTA DE PRODUCTOS */}
                <div className="carrito-lista" style={{ flex: '2', minWidth: '350px', padding: '30px' }}>
                    <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '15px', marginTop: 0 }}>Resumen de Artículos</h3>
                    
                    {carrito.map((item, index) => (
                        <div key={index} className="carrito-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                            <div className="item-info">
                                <h4 className="item-nombre" style={{ margin: '0 0 5px 0', color: '#333' }}>{item.nombre}</h4>
                                <p className="item-precio" style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>
                                    🏪 {item.nombre_productor} | ${Number(item.precio).toLocaleString()} c/u
                                </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <span style={{ fontWeight: 'bold', background: '#f8f9fa', padding: '5px 15px', borderRadius: '5px' }}>
                                    Cant: {item.cantidad}
                                </span>
                                <span className="item-subtotal" style={{ fontWeight: 'bold', color: '#27ae60', minWidth: '80px', textAlign: 'right' }}>
                                    ${(item.precio * item.cantidad).toLocaleString()}
                                </span>
                                <button 
                                    onClick={() => eliminarDelCarrito(index)}
                                    style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '1.2rem' }}
                                    title="Quitar producto"
                                >
                                    ✖
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* COLUMNA DERECHA: DATOS DE ENVÍO Y PAGO */}
                <div className="carrito-lista" style={{ flex: '1', minWidth: '300px', padding: '30px', background: '#f8f9fa', border: '2px solid #eee' }}>
                    <h3 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
                        Logística de Entrega
                    </h3>
                    
                    <form onSubmit={confirmarPedido}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Método de entrega:</label>
                            <select 
                                name="tipo_entrega" 
                                value={datosEnvio.tipo_entrega} 
                                onChange={manejarCambio}
                                className="form-input"
                                style={{ width: '100%', padding: '10px' }}
                            >
                                <option value="domicilio">🛵 Envío a Domicilio</option>
                                <option value="recogida">🏢 Recoger en el Local</option>
                            </select>
                        </div>

                        {/* Campos condicionales: Solo se muestran si es a Domicilio */}
                        {datosEnvio.tipo_entrega === 'domicilio' && (
                            <>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#7f8c8d', marginBottom: '5px' }}>Dirección de Entrega</label>
                                    <input type="text" name="direccion" value={datosEnvio.direccion} onChange={manejarCambio} className="form-input" placeholder="Ej: Calle 123 # 45-67" required />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#7f8c8d', marginBottom: '5px' }}>Barrio</label>
                                    <input type="text" name="barrio" value={datosEnvio.barrio} onChange={manejarCambio} className="form-input" required />
                                </div>
                            </>
                        )}

                        {/* Teléfono siempre es obligatorio para que el vendedor lo contacte */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#7f8c8d', marginBottom: '5px' }}>Teléfono de Contacto</label>
                            <input type="text" name="telefono" value={datosEnvio.telefono} onChange={manejarCambio} className="form-input" placeholder="Para coordinar la entrega" required />
                        </div>

                        <div className="carrito-resumen" style={{ borderTop: '2px dashed #ccc', paddingTop: '20px', textAlign: 'center' }}>
                            <p style={{ margin: '0 0 10px 0', color: '#7f8c8d' }}>Total a Pagar</p>
                            <h2 className="carrito-total" style={{ margin: '0 0 20px 0', fontSize: '2.5rem', color: '#27ae60' }}>
                                ${total.toLocaleString()}
                            </h2>
                            <button type="submit" className="btn-submit" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }} disabled={procesando}>
                                {procesando ? 'Procesando...' : 'Confirmar Pedido ✅'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default Carrito;