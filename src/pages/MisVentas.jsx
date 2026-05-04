import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import '../index.css';

function MisVentas({ token }) {
    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (token) obtenerVentas();
    }, [token]);

    const obtenerVentas = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/mis-ventas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const datos = await res.json();
            if (res.ok) setVentas(datos);
        } catch (error) {
            toast.error("Error al cargar ventas");
        } finally {
            setCargando(false);
        }
    };

    const cambiarEstado = async (id, nuevoEstado) => {
        const ventasAnteriores = [...ventas];
        setVentas(prev => prev.map(v => v.pedido_id === id ? { ...v, estado: nuevoEstado } : v));

        try {
            const res = await fetch(`http://localhost:3000/api/pedidos/${id}/estado`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });

            if (res.ok) {
                toast.success(`Pedido: ${nuevoEstado.toUpperCase()}`);
                obtenerVentas();
            } else {
                setVentas(ventasAnteriores);
                toast.error("El servidor no pudo guardar el cambio");
            }
        } catch (error) {
            setVentas(ventasAnteriores);
            toast.error("Error de conexión");
        }
    };

    if (cargando) return <p className="text-center">Cargando panel de ventas...</p>;

    return (
        <div className="catalogo-container">
            <h2 className="titulo-pagina">📦 Panel de Control de Ventas</h2>

            {ventas.length === 0 ? (
                <p className="text-center">Aún no tienes ventas registradas.</p>
            ) : (
                <div className="lista-ventas">
                    {ventas.map((venta) => {
                        const estadoActual = (venta.estado || "").trim().toLowerCase();
                        const esFlujoFinal = estadoActual === 'completado' || estadoActual === 'devolucion';

                        return (
                            <div key={venta.pedido_id} className={`tarjeta-venta border-${estadoActual.replace(" ", "-")}`}>
                                <div className="cabecera-pedido">
                                    <h3>Pedido #{venta.pedido_id}</h3>
                                    <span className={`status-venta status-${estadoActual.replace(" ", "-")}`}>
                                        {estadoActual.toUpperCase()}
                                    </span>
                                </div>

                                <div className="cuerpo-pedido">
                                    <p>👤 <strong>Cliente:</strong> {venta.cliente}</p>
                                    
                                    {/* --- NUEVO BLOQUE DE LOGÍSTICA DE ENTREGA --- */}
                                    <div className="info-entrega" style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px', margin: '10px 0', borderLeft: venta.tipo_entrega === 'recogida' ? '4px solid #f39c12' : '4px solid #27ae60' }}>
                                        <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
                                            {venta.tipo_entrega === 'recogida' ? '🏢 Recogida en Local' : '🛵 Envío a Domicilio'}
                                        </h4>
                                        <p style={{ margin: '3px 0' }}>📞 <strong>Teléfono:</strong> {venta.telefono_contacto}</p>
                                        
                                        {venta.tipo_entrega === 'domicilio' && (
                                            <>
                                                <p style={{ margin: '3px 0' }}>📍 <strong>Dirección:</strong> {venta.direccion_envio}</p>
                                                <p style={{ margin: '3px 0' }}>🏘️ <strong>Barrio:</strong> {venta.barrio_envio}</p>
                                            </>
                                        )}
                                    </div>
                                    {/* ------------------------------------------- */}

                                    <div className="detalle-productos">
                                        <ul className="lista-articulos">
                                            {venta.productos.map((item, idx) => (
                                                <li key={idx} className="item-articulo">
                                                    <span>{item.cantidad}x {item.producto}</span>
                                                    <span>${(item.precio * item.cantidad).toLocaleString()}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <p className="precio-total">Total: ${venta.total.toLocaleString()}</p>
                                </div>

                                <div className="acciones-ventas">
                                    <label className="label-estado">Cambiar estado del pedido:</label>
                                    <select 
                                        className="form-input" 
                                        value={estadoActual}
                                        onChange={(e) => cambiarEstado(venta.pedido_id, e.target.value)}
                                    >
                                        {esFlujoFinal ? (
                                            <>
                                                <option value="completado">Completado ✅</option>
                                                <option value="devolucion">Devolución ↩️</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="pendiente">Pendiente ⏳</option>
                                                <option value="en camino">En camino 🚚</option>
                                                <option value="completado">Completado ✅</option>
                                                <option value="cancelado">Cancelado ❌</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MisVentas;