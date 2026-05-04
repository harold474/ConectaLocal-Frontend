import { useState, useEffect } from 'react';

function Catalogo({ agregarAlCarrito }) {
    const [productos, setProductos] = useState([]);
    const [cantidadesSeleccionadas, setCantidadesSeleccionadas] = useState({});
    const [busqueda, setBusqueda] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
    const [paginaActual, setPaginaActual] = useState(1);
    
    const PRODUCTOS_POR_PAGINA = 48; 

    useEffect(() => {
        fetch('http://localhost:3000/api/productos')
            .then(respuesta => respuesta.json())
            .then(datos => {
                setProductos(datos);
                const inicial = {};
                datos.forEach(p => inicial[p.id] = 1);
                setCantidadesSeleccionadas(inicial);
            })
            .catch(error => console.error("Error cargando productos:", error));
    }, []);

    const manejarCambioCantidad = (id, valor, stockMaximo) => {
        let num = parseInt(valor);
        if (num < 1) num = 1;
        if (num > stockMaximo) num = stockMaximo;
        setCantidadesSeleccionadas({ ...cantidadesSeleccionadas, [id]: num });
    };

    const determinarColorCategoria = (categoria) => {
        const catLimpia = categoria ? categoria.toLowerCase() : '';
        if (catLimpia.includes('alimento')) return '#27ae60'; 
        if (catLimpia.includes('servicio')) return '#2980b9'; 
        if (catLimpia.includes('arte')) return '#8e44ad'; 
        if (catLimpia.includes('mascota')) return '#e67e22'; 
        return '#34495e'; 
    };

    const obtenerIcono = (categoria) => {
        const catLimpia = categoria ? categoria.toLowerCase() : '';
        if (catLimpia.includes('alimento')) return '🍯';
        if (catLimpia.includes('servicio')) return '🛠️';
        if (catLimpia.includes('arte')) return '🧶';
        if (catLimpia.includes('mascota')) return '🐾';
        return '📦';
    };

    const categoriasDisponibles = ['Todas', ...new Set(productos.map(p => p.categoria).filter(Boolean))];

    const productosFiltrados = productos.filter(producto => {
        const coincideCategoria = categoriaSeleccionada === 'Todas' || producto.categoria === categoriaSeleccionada;
        const termino = busqueda.toLowerCase();
        return coincideCategoria && (producto.nombre.toLowerCase().includes(termino) || producto.descripcion.toLowerCase().includes(termino));
    });

    const indexUltimoProducto = paginaActual * PRODUCTOS_POR_PAGINA;
    const indexPrimerProducto = indexUltimoProducto - PRODUCTOS_POR_PAGINA;
    const productosAMostrar = productosFiltrados.slice(indexPrimerProducto, indexUltimoProducto);
    const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);

    useEffect(() => { setPaginaActual(1); }, [busqueda, categoriaSeleccionada]);

    return (
        <div className="catalogo-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            
            <style>{`
                .grid-principal {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
                    gap: 25px;
                    width: 100%;
                }

                .tarjeta-market {
                    background: white;
                    border-radius: 15px;
                    border: 1px solid #eef0f2;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
                    height: fit-content;
                }

                .tarjeta-market:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
                    border-color: #27ae60;
                }

                .seccion-revelada {
                    max-height: 0;
                    opacity: 0;
                    overflow: hidden;
                    transition: all 0.5s ease-in-out;
                    font-size: 0.85rem;
                    color: #555;
                }

                .tarjeta-market:hover .seccion-revelada {
                    max-height: 250px;
                    opacity: 1;
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px dashed #ddd;
                }

                .input-cantidad-pro {
                    width: 55px;
                    padding: 8px;
                    border-radius: 8px;
                    border: 2px solid #f1f2f6;
                    text-align: center;
                    font-weight: 700;
                    outline: none;
                }

                .input-cantidad-pro:focus {
                    border-color: #27ae60;
                }
            `}</style>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: '#2c3e50', fontSize: '2.5rem', margin: '0 0 10px 0', fontWeight: '900', letterSpacing: '-1px' }}>
                    ConectaLocal
                </h1>
                <p style={{ color: '#7f8c8d', fontSize: '1.1rem', margin: 0 }}>Calidad artesanal y frescura directo a tu puerta.</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', marginBottom: '40px', maxWidth: '850px', margin: '0 auto 50px auto' }}>
                <input 
                    type="text" placeholder="🔍 ¿Qué estás buscando hoy?" value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ padding: '12px 20px', borderRadius: '10px', flex: '2', minWidth: '280px', border: '1px solid #e0e0e0', outline: 'none', fontSize: '1rem' }}
                />
                <select 
                    value={categoriaSeleccionada} onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    style={{ padding: '12px 15px', borderRadius: '10px', border: '1px solid #e0e0e0', fontWeight: '700', cursor: 'pointer', flex: '1', minWidth: '150px' }}
                >
                    {categoriasDisponibles.map((cat, i) => (
                        <option key={i} value={cat}>{cat === 'Todas' ? '📂 Categorías' : cat}</option>
                    ))}
                </select>
            </div>

            <div className="grid-principal">
                {productosAMostrar.map(producto => {
                    const colorCat = determinarColorCategoria(producto.categoria);
                    const cant = cantidadesSeleccionadas[producto.id] || 1;

                    return (
                        <div key={producto.id} className="tarjeta-market">
                            <div style={{ width: '100%', height: '170px', position: 'relative', backgroundColor: '#f4f7f6' }}>
                                {producto.imagenes?.length > 0 ? (
                                    <img src={`http://localhost:3000${producto.imagenes[0]}`} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: '3.5rem' }}>{obtenerIcono(producto.categoria)}</div>
                                )}
                                <span style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: colorCat, color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: '800', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                    {producto.categoria?.toUpperCase()}
                                </span>
                            </div>

                            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '1.05rem', fontWeight: '800', lineHeight: '1.3' }}>{producto.nombre}</h3>
                                
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#95a5a6' }}>
                                    🏪 <strong>{producto.nombre_productor}</strong>
                                </p>

                                <div className="seccion-revelada">
                                    {producto.descripcion}
                                </div>

                                <div style={{ marginTop: 'auto', paddingTop: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        {/* AQUÍ ESTABA EL ERROR: Cambiado </h2> por </span> */}
                                        <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#27ae60' }}>
                                            ${Number(producto.precio).toLocaleString()}
                                        </span>
                                        <span style={{ fontSize: '0.7rem', color: '#7f8c8d', background: '#f8f9fa', padding: '3px 7px', borderRadius: '5px' }}>Stock: {producto.stock}</span>
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input 
                                            type="number" value={cant} min="1" max={producto.stock}
                                            onChange={(e) => manejarCambioCantidad(producto.id, e.target.value, producto.stock)}
                                            className="input-cantidad-pro"
                                        />
                                        <button 
                                            onClick={() => agregarAlCarrito({ ...producto, cantidad: cant })}
                                            style={{ flexGrow: 1, backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s' }}
                                        >
                                            🛒 Añadir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalPaginas > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px', gap: '20px' }}>
                    <button onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))} disabled={paginaActual === 1} style={{ backgroundColor: '#2c3e50', color: 'white', padding: '12px 25px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 'bold', opacity: paginaActual === 1 ? 0.5 : 1 }}>⬅️ Anterior</button>
                    <span style={{ fontWeight: '800', color: '#2c3e50' }}>{paginaActual} / {totalPaginas}</span>
                    <button onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))} disabled={paginaActual === totalPaginas} style={{ backgroundColor: '#2c3e50', color: 'white', padding: '12px 25px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 'bold', opacity: paginaActual === totalPaginas ? 0.5 : 1 }}>Siguiente ➡️</button>
                </div>
            )}
        </div>
    );
}

export default Catalogo;