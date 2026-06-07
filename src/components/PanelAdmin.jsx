import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const PanelAdmin = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [mensajes, setMensajes] = useState([]);
    const [nuevoAdminEmail, setNuevoAdminEmail] = useState('');

    const [tabActiva, setTabActiva] = useState('usuarios');

    // --- ESTADOS PARA PAGINACIÓN DE PRODUCTOS ---
    const [paginaActual, setPaginaActual] = useState(1);
    const productosPorPagina = 20;

    useEffect(() => {
        if (tabActiva === 'usuarios') obtenerUsuarios();

        if (tabActiva === 'productos') {
            obtenerProductos();
            setPaginaActual(1);
        }

        if (tabActiva === 'transacciones') obtenerPedidos();

        if (tabActiva === 'mensajes') obtenerMensajes();
    }, [tabActiva]);

    // --- LÓGICA DE USUARIOS ---
    const obtenerUsuarios = async () => {
        try {
            const token = localStorage.getItem('token');

            const res = await fetch('http://localhost:3000/api/admin/usuarios', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setUsuarios(await res.json());
            } else {
                toast.error("Error al cargar usuarios");
            }
        } catch (error) {
            toast.error("Error al cargar usuarios");
        }
    };

    const cambiarEstadoUsuario = async (id, nuevoEstado) => {
        try {
            const token = localStorage.getItem('token');

            const res = await fetch(`http://localhost:3000/api/admin/usuarios/${id}/estado`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });

            if (res.ok) {
                setUsuarios(usuarios.map(u =>
                    u.id === id ? { ...u, estado: nuevoEstado } : u
                ));

                toast.success(`Usuario marcado como ${nuevoEstado}`);
            } else {
                toast.error("Error al cambiar estado");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    // --- LÓGICA DE PUBLICACIONES ---
    const obtenerProductos = async () => {
        try {
            const token = localStorage.getItem('token');

            const res = await fetch('http://localhost:3000/api/admin/productos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setProductos(await res.json());
            } else {
                toast.error("Error al cargar publicaciones");
            }
        } catch (error) {
            toast.error("Error al cargar publicaciones");
        }
    };

    const eliminarProducto = async (id) => {
        if (!window.confirm("🚨 ¿Estás seguro de eliminar esta publicación por incumplir las políticas?")) return;

        try {
            const token = localStorage.getItem('token');

            const res = await fetch(`http://localhost:3000/api/admin/productos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setProductos(productos.filter(p => p.id !== id));
                toast.success("Publicación eliminada correctamente");
            } else {
                toast.error("Error al eliminar la publicación");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    // --- LÓGICA DE TRANSACCIONES ---
    const obtenerPedidos = async () => {
        try {
            const token = localStorage.getItem('token');

            const res = await fetch('http://localhost:3000/api/admin/pedidos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setPedidos(await res.json());
            } else {
                toast.error("Error al cargar transacciones");
            }
        } catch (error) {
            toast.error("Error al cargar transacciones");
        }
    };

    // --- LÓGICA DE MENSAJES DE CONTACTO ---
    const obtenerMensajes = async () => {
        try {
            const token = localStorage.getItem('token');

            const res = await fetch('http://localhost:3000/api/admin/contactos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setMensajes(await res.json());
            } else {
                toast.error("Error al cargar mensajes de contacto");
            }
        } catch (error) {
            toast.error("Error de conexión al cargar mensajes");
        }
    };

    // --- PROMOVER USUARIO A ADMIN ---
    const promoverAdmin = async (e) => {
        e.preventDefault();

        if (!nuevoAdminEmail.trim()) {
            toast.error("Ingresa el correo del usuario");
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const res = await fetch('http://localhost:3000/api/admin/promover', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: nuevoAdminEmail
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Usuario ascendido a Administrador");
                setNuevoAdminEmail('');
                obtenerUsuarios();
            } else {
                toast.error(data.error || "Error al asignar rol");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    // --- CÁLCULOS DE PAGINACIÓN ---
    const indiceUltimoProducto = paginaActual * productosPorPagina;
    const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
    const productosActuales = productos.slice(indicePrimerProducto, indiceUltimoProducto);
    const totalPaginas = Math.ceil(productos.length / productosPorPagina);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>🛡️ Centro de Moderación y Auditoría</h2>
                <p style={styles.subtitle}>
                    Supervisa usuarios, contenido, transacciones y mensajes de la comunidad de ConectaLocal.
                </p>
            </div>

            {/* PESTAÑAS */}
            <div style={styles.tabContainer}>
                <button
                    style={tabActiva === 'usuarios' ? styles.tabActive : styles.tabInactive}
                    onClick={() => setTabActiva('usuarios')}
                >
                    👥 Usuarios
                </button>

                <button
                    style={tabActiva === 'productos' ? styles.tabActive : styles.tabInactive}
                    onClick={() => setTabActiva('productos')}
                >
                    🚩 Publicaciones
                </button>

                <button
                    style={tabActiva === 'transacciones' ? styles.tabActive : styles.tabInactive}
                    onClick={() => setTabActiva('transacciones')}
                >
                    📊 Compras/Ventas
                </button>

                <button
                    style={tabActiva === 'mensajes' ? styles.tabActive : styles.tabInactive}
                    onClick={() => setTabActiva('mensajes')}
                >
                    📩 Mensajes
                </button>

                <button
                    style={tabActiva === 'admin-gestion' ? styles.tabActive : styles.tabInactive}
                    onClick={() => setTabActiva('admin-gestion')}
                >
                    ⚙️ Admins
                </button>
            </div>

            {/* TABLA DE USUARIOS */}
            {tabActiva === 'usuarios' && (
                <div style={styles.card}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Nombre</th>
                                <th style={styles.th}>Correo</th>
                                <th style={styles.th}>Rol</th>
                                <th style={styles.th}>Estado</th>
                                <th style={styles.th}>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {usuarios.map(u => (
                                <tr key={u.id} style={styles.tr}>
                                    <td style={styles.td}>#{u.id}</td>

                                    <td style={{ ...styles.td, fontWeight: 'bold' }}>
                                        {u.nombre}
                                    </td>

                                    <td style={styles.td}>{u.email}</td>

                                    <td style={styles.td}>
                                        {u.rol?.toUpperCase()}
                                    </td>

                                    <td style={styles.td}>
                                        <span
                                            style={
                                                u.estado === 'activo'
                                                    ? styles.badgeGreen
                                                    : u.estado === 'inactivo'
                                                        ? styles.badgeYellow
                                                        : styles.badgeRed
                                            }
                                        >
                                            {u.estado}
                                        </span>
                                    </td>

                                    <td style={styles.tdAcciones}>
                                        {u.estado !== 'activo' && (
                                            <button
                                                style={styles.btnGreen}
                                                onClick={() => cambiarEstadoUsuario(u.id, 'activo')}
                                            >
                                                Activar
                                            </button>
                                        )}

                                        {u.estado !== 'inactivo' && (
                                            <button
                                                style={styles.btnYellow}
                                                onClick={() => cambiarEstadoUsuario(u.id, 'inactivo')}
                                            >
                                                Inactivar
                                            </button>
                                        )}

                                        {u.estado !== 'bloqueado' && (
                                            <button
                                                style={styles.btnRed}
                                                onClick={() => cambiarEstadoUsuario(u.id, 'bloqueado')}
                                            >
                                                Bloquear
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {usuarios.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={styles.emptyCell}>
                                        No hay usuarios registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* TABLA DE PUBLICACIONES */}
            {tabActiva === 'productos' && (
                <div style={styles.card}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={{ ...styles.th, textAlign: 'center' }}>Foto</th>
                                <th style={styles.th}>Publicación</th>
                                <th style={styles.th}>Productor</th>
                                <th style={styles.th}>Precio/Stock</th>
                                <th style={styles.th}>Acción</th>
                            </tr>
                        </thead>

                        <tbody>
                            {productosActuales.map(p => {
                                const imagenPrincipal =
                                    p.imagenes && p.imagenes.length > 0
                                        ? `http://localhost:3000${p.imagenes[0]}`
                                        : 'https://via.placeholder.com/60?text=Sin+Foto';

                                return (
                                    <tr key={p.id} style={styles.tr}>
                                        <td style={styles.td}>#{p.id}</td>

                                        <td style={{ ...styles.td, textAlign: 'center' }}>
                                            <img
                                                src={imagenPrincipal}
                                                alt={p.nombre}
                                                style={styles.imgPreview}
                                            />
                                        </td>

                                        <td style={styles.td}>
                                            <strong>{p.nombre}</strong>
                                            <br />
                                            <span style={{ fontSize: '12px', color: '#7f8c8d' }}>
                                                {p.descripcion?.substring(0, 40)}...
                                            </span>
                                        </td>

                                        <td style={styles.td}>
                                            👤 {p.productor}
                                        </td>

                                        <td style={styles.td}>
                                            <span style={{ color: '#27ae60', fontWeight: 'bold' }}>
                                                ${Number(p.precio).toLocaleString()}
                                            </span>
                                            <br />
                                            <span style={{ fontSize: '12px' }}>
                                                Stock: {p.stock}
                                            </span>
                                        </td>

                                        <td style={styles.tdAcciones}>
                                            <button
                                                style={styles.btnDanger}
                                                onClick={() => eliminarProducto(p.id)}
                                            >
                                                🗑️ Bajar Publicación
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                            {productos.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={styles.emptyCell}>
                                        No hay publicaciones registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* CONTROLES DE PAGINACIÓN */}
                    {totalPaginas > 1 && (
                        <div style={styles.paginacionContainer}>
                            <button
                                style={paginaActual === 1 ? styles.btnDisabled : styles.btnPage}
                                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                                disabled={paginaActual === 1}
                            >
                                ◀ Anterior
                            </button>

                            <span style={styles.pageInfo}>
                                Página <strong>{paginaActual}</strong> de {totalPaginas}
                            </span>

                            <button
                                style={paginaActual === totalPaginas ? styles.btnDisabled : styles.btnPage}
                                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                                disabled={paginaActual === totalPaginas}
                            >
                                Siguiente ▶
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* TABLA DE TRANSACCIONES */}
            {tabActiva === 'transacciones' && (
                <div style={styles.card}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID Pedido</th>
                                <th style={styles.th}>Fecha</th>
                                <th style={styles.th}>Comprador</th>
                                <th style={styles.th}>Vendedor(es)</th>
                                <th style={styles.th}>Monto Total</th>
                                <th style={styles.th}>Estado</th>
                            </tr>
                        </thead>

                        <tbody>
                            {pedidos.map(p => (
                                <tr key={p.id} style={styles.tr}>
                                    <td style={{ ...styles.td, fontWeight: 'bold' }}>
                                        #{p.id}
                                    </td>

                                    <td style={styles.td}>
                                        {new Date(p.fecha_pedido).toLocaleDateString()}
                                    </td>

                                    <td style={styles.td}>
                                        🛍️ {p.comprador}
                                        <br />
                                        <span style={{ fontSize: '12px', color: '#7f8c8d' }}>
                                            {p.email_comprador}
                                        </span>
                                    </td>

                                    <td style={styles.td}>
                                        📦 {p.vendedores}
                                    </td>

                                    <td style={{ ...styles.td, fontWeight: 'bold', color: '#2c3e50' }}>
                                        ${Number(p.total).toLocaleString()}
                                    </td>

                                    <td style={styles.td}>
                                        <span
                                            style={
                                                p.estado === 'entregado'
                                                    ? styles.badgeGreen
                                                    : p.estado === 'cancelado'
                                                        ? styles.badgeRed
                                                        : styles.badgeYellow
                                            }
                                        >
                                            {p.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {pedidos.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={styles.emptyCell}>
                                        No hay transacciones registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* PESTAÑA DE MENSAJES DE CONTACTO */}
            {tabActiva === 'mensajes' && (
                <div style={styles.cardMensajes}>
                    <div style={styles.mensajesHeader}>
                        <h3 style={styles.sectionTitle}>📩 Mensajes de Contáctanos</h3>
                        <p style={styles.sectionSubtitle}>
                            Aquí puedes revisar reportes, dudas o solicitudes enviadas por usuarios y visitantes.
                        </p>
                    </div>

                    {mensajes.length === 0 ? (
                        <div style={styles.emptyBox}>
                            No hay mensajes de contacto registrados.
                        </div>
                    ) : (
                        mensajes.map(m => (
                            <div key={m.id} style={styles.mensajeItem}>
                                <div style={styles.mensajeTop}>
                                    <div>
                                        <strong style={styles.mensajeNombre}>
                                            {m.nombre}
                                        </strong>

                                        <span style={styles.mensajeEmail}>
                                            {' '}({m.email})
                                        </span>
                                    </div>

                                    <span style={styles.mensajeFecha}>
                                        {new Date(m.fecha_envio).toLocaleString()}
                                    </span>
                                </div>

                                <div style={styles.mensajeAsunto}>
                                    {m.asunto || 'Sin asunto'}
                                </div>

                                <p style={styles.mensajeTexto}>
                                    {m.mensaje}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* PESTAÑA DE GESTIÓN DE ADMINS */}
            {tabActiva === 'admin-gestion' && (
                <div style={styles.adminCard}>
                    <h3 style={styles.sectionTitle}>➕ Asignar nuevo Administrador</h3>

                    <p style={styles.sectionSubtitle}>
                        Ingresa el correo de un usuario registrado para otorgarle permisos administrativos.
                    </p>

                    <form onSubmit={promoverAdmin} style={styles.adminForm}>
                        <input
                            type="email"
                            placeholder="Email del usuario a promover"
                            value={nuevoAdminEmail}
                            onChange={(e) => setNuevoAdminEmail(e.target.value)}
                            style={styles.input}
                        />

                        <button type="submit" style={styles.btnPromover}>
                            Asignar Privilegios de Admin
                        </button>
                    </form>

                    <p style={styles.warningText}>
                        ⚠️ Cuidado: los nuevos administradores tendrán acceso a reportes, usuarios,
                        publicaciones, transacciones y eliminación de contenido.
                    </p>
                </div>
            )}
        </div>
    );
};

// --- ESTILOS CSS EN LÍNEA ---
const styles = {
    container: {
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
        marginBottom: '30px',
        textAlign: 'center'
    },
    title: {
        color: '#2c3e50',
        fontSize: '32px',
        marginBottom: '10px'
    },
    subtitle: {
        color: '#7f8c8d',
        fontSize: '16px'
    },
    tabContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
        gap: '10px',
        flexWrap: 'wrap'
    },
    tabActive: {
        backgroundColor: '#34495e',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    tabInactive: {
        backgroundColor: '#ecf0f1',
        color: '#7f8c8d',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px',
        transition: '0.3s'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        border: '1px solid #ecf0f1'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    th: {
        backgroundColor: '#f8f9fa',
        color: '#2c3e50',
        padding: '16px',
        textAlign: 'left',
        borderBottom: '2px solid #e9ecef',
        textTransform: 'uppercase',
        fontSize: '13px',
        letterSpacing: '0.5px'
    },
    tr: {
        borderBottom: '1px solid #e9ecef',
        transition: 'background-color 0.2s'
    },
    td: {
        padding: '16px',
        color: '#34495e',
        verticalAlign: 'middle'
    },
    tdAcciones: {
        padding: '16px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    badgeGreen: {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    badgeYellow: {
        backgroundColor: '#fff3cd',
        color: '#856404',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    badgeRed: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    btnGreen: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 'bold'
    },
    btnYellow: {
        backgroundColor: '#ffc107',
        color: '#212529',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 'bold'
    },
    btnRed: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 'bold'
    },
    btnDanger: {
        backgroundColor: '#c0392b',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    },
    imgPreview: {
        width: '50px',
        height: '50px',
        objectFit: 'cover',
        borderRadius: '8px',
        border: '1px solid #ecf0f1'
    },
    paginacionContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e9ecef',
        gap: '15px'
    },
    btnPage: {
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: '0.2s'
    },
    btnDisabled: {
        backgroundColor: '#bdc3c7',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'not-allowed',
        fontWeight: 'bold'
    },
    pageInfo: {
        fontSize: '14px',
        color: '#2c3e50'
    },
    emptyCell: {
        padding: '20px',
        textAlign: 'center',
        color: '#7f8c8d'
    },
    cardMensajes: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        padding: '24px',
        border: '1px solid #ecf0f1'
    },
    mensajesHeader: {
        marginBottom: '20px',
        borderBottom: '1px solid #ecf0f1',
        paddingBottom: '15px'
    },
    sectionTitle: {
        margin: '0 0 8px 0',
        color: '#2c3e50',
        fontSize: '22px'
    },
    sectionSubtitle: {
        margin: 0,
        color: '#7f8c8d',
        fontSize: '14px'
    },
    mensajeItem: {
        borderBottom: '1px solid #ecf0f1',
        padding: '16px 0'
    },
    mensajeTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '15px',
        flexWrap: 'wrap'
    },
    mensajeNombre: {
        color: '#2c3e50'
    },
    mensajeEmail: {
        color: '#7f8c8d',
        fontSize: '14px'
    },
    mensajeFecha: {
        color: '#95a5a6',
        fontSize: '12px'
    },
    mensajeAsunto: {
        display: 'inline-block',
        marginTop: '8px',
        backgroundColor: '#fdecea',
        color: '#c0392b',
        padding: '5px 10px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: 'bold'
    },
    mensajeTexto: {
        color: '#34495e',
        lineHeight: '1.5',
        marginBottom: 0
    },
    emptyBox: {
        padding: '30px',
        textAlign: 'center',
        color: '#7f8c8d',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px'
    },
    adminCard: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        maxWidth: '520px',
        margin: '0 auto',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        border: '1px solid #ecf0f1'
    },
    adminForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '20px'
    },
    input: {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '15px'
    },
    btnPromover: {
        background: '#e74c3c',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    warningText: {
        fontSize: '0.85rem',
        color: '#7f8c8d',
        marginTop: '20px',
        lineHeight: '1.5'
    }
};

export default PanelAdmin;