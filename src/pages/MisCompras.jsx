import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import '../index.css';

function MisCompras({ token }) {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (token) obtenerPedidos();
    }, [token]);

    const obtenerPedidos = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/mis-pedidos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const datos = await res.json();
            if (res.ok) setPedidos(datos);
        } catch (error) {
            toast.error("Error al cargar historial");
        } finally {
            setCargando(false);
        }
    };

    const cancelarPedido = async (id) => {
        if (!window.confirm("¿Seguro que deseas cancelar este pedido? Solo tienes 20 minutos tras la compra.")) return;

        try {
            const res = await fetch(`http://localhost:3000/api/pedidos/${id}/cancelar`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Pedido cancelado exitosamente");
                obtenerPedidos(); // Recargar la lista para actualizar el estado visual
            } else {
                toast.error(data.error || "No se pudo cancelar el pedido");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    if (cargando) return <p className="text-center">Cargando tus compras...</p>;

    return (
        <div className="catalogo-container">
            <h2 className="titulo-pagina">🛍️ Mi Historial de Compras</h2>

            {pedidos.length === 0 ? (
                <p className="text-center">Aún no has realizado ninguna compra.</p>
            ) : (
                <div className="lista-ventas">
                    {pedidos.map((pedido) => {
                        const estadoLimpio = (pedido.estado || "").trim().toLowerCase();
                        // Verificamos si aún es "pendiente" para dejarle cancelar
                        const sePuedeCancelar = estadoLimpio === 'pendiente';

                        return (
                            <div key={pedido.id} className={`tarjeta-venta border-${estadoLimpio.replace(" ", "-")}`}>
                                <div className="cabecera-pedido">
                                    <h3>Pedido #{pedido.id}</h3>
                                    <span className={`status-venta status-${estadoLimpio.replace(" ", "-")}`}>
                                        {estadoLimpio.toUpperCase()}
                                    </span>
                                </div>

                                <div className="cuerpo-pedido">
                                    <p style={{ fontSize: '0.85rem', color: '#666' }}>
                                        📅 {new Date(pedido.fecha_pedido).toLocaleString()}
                                    </p>

                                    {/* --- INFORMACIÓN DE ENTREGA PARA EL CLIENTE --- */}
                                    <div style={{ background: '#eef2f3', padding: '10px', borderRadius: '5px', margin: '10px 0' }}>
                                        <strong>Entrega: </strong> 
                                        {pedido.tipo_entrega === 'recogida' ? '🏢 Recoger en el local' : '🛵 A domicilio'}
                                    </div>
                                    
                                    <div className="detalle-productos">
                                        <ul className="lista-articulos">
                                            {pedido.productos.map((item, idx) => (
                                                <li key={idx} className="item-articulo">
                                                    <span>{item.cantidad}x {item.nombre}</span>
                                                    <span>${(item.precio * item.cantidad).toLocaleString()}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <p className="precio-total">Total pagado: ${pedido.total.toLocaleString()}</p>
                                    
                                    {/* Botón de cancelar condicional */}
                                    {sePuedeCancelar && (
                                        <button 
                                            onClick={() => cancelarPedido(pedido.id)} 
                                            className="btn-cancelar" 
                                            style={{ width: '100%', marginTop: '10px' }}
                                        >
                                            ❌ Cancelar Pedido
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MisCompras;