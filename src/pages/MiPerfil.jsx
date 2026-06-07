import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

function MiPerfil({ token }) {
    // Inicializamos el estado con todos los campos vacíos para evitar errores de "undefined"
    const [perfil, setPerfil] = useState({
        nombre: '', apellidos: '', email: '', rol: '', nombre_negocio: '', 
        direccion: '', barrio: '', ciudad: '', telefono: '', preferencias: '', foto_perfil: ''
    });
    const [cargando, setCargando] = useState(true);
    const [subiendoImagen, setSubiendoImagen] = useState(false);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (token) obtenerPerfil();
    }, [token]);

    const obtenerPerfil = async () => {
        try {
            const res = await fetch('/api/perfil', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                // Rellenamos los campos nulos con strings vacíos para que los inputs no fallen
                setPerfil({
                    ...data,
                    apellidos: data.apellidos || '',
                    ciudad: data.ciudad || '',
                    telefono: data.telefono || '',
                    preferencias: data.preferencias || '',
                    direccion: data.direccion || '',
                    barrio: data.barrio || '',
                    nombre_negocio: data.nombre_negocio || ''
                });
            }
        } catch (error) {
            toast.error("Error al cargar tu información");
        } finally {
            setCargando(false);
        }
    };

    // Función para actualizar el estado cuando el usuario escribe en los inputs
    const manejarCambio = (e) => {
        setPerfil({ ...perfil, [e.target.name]: e.target.value });
    };

    // Función para enviar los datos de texto al backend
    const guardarCambios = async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        setGuardando(true);
        try {
            const res = await fetch('/api/perfil', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(perfil)
            });

            if (res.ok) {
                toast.success("¡Datos actualizados correctamente!");
                // Opcional: Actualizar el nombre en el localStorage por si lo cambian
                localStorage.setItem('nombreUsuario', perfil.nombre); 
            } else {
                toast.error("No se pudieron guardar los cambios");
            }
        } catch (error) {
            toast.error("Error de conexión al guardar");
        } finally {
            setGuardando(false);
        }
    };

    const cambiarFoto = async (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        setSubiendoImagen(true);
        const formData = new FormData();
        formData.append('foto', archivo);

        try {
            const res = await fetch('/api/perfil/foto', {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("¡Foto de perfil actualizada!");
                setPerfil({ ...perfil, foto_perfil: data.foto_perfil });
            } else {
                toast.error(data.error || "Error al subir la imagen");
            }
        } catch (error) {
            toast.error("Error de conexión");
        } finally {
            setSubiendoImagen(false);
        }
    };

    if (cargando) return <p className="text-center" style={{marginTop: '50px'}}>Cargando tu panel de control...</p>;
    if (!perfil) return <p className="text-center">No se pudo cargar el perfil.</p>;

    return (
        <div className="catalogo-container" style={{ padding: '20px' }}>
            <h2 className="titulo-pagina" style={{ marginBottom: '30px', color: '#2c3e50' }}>Configuración de Cuenta</h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', width: '100%', maxWidth: '1000px', alignItems: 'flex-start' }}>
                
                {/* COLUMNA IZQUIERDA: FOTO (Intacta) */}
                <div className="auth-card" style={{ flex: '1', minWidth: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 0 }}>
                    <div style={{ 
                        width: '180px', height: '180px', borderRadius: '50%', overflow: 'hidden', 
                        border: '5px solid #27ae60', marginBottom: '20px', background: '#f4f7f6',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}>
                        {perfil.foto_perfil ? (
                            <img src={`${perfil.foto_perfil}`} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: '4rem' }}>{perfil.rol === 'productor' ? '🏪' : '👤'}</span>
                        )}
                    </div>

                    {/* Muestra Nombre + Apellidos en la tarjeta de identidad */}
                    <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', textAlign: 'center' }}>
                        {perfil.nombre} {perfil.apellidos}
                    </h3>
                    <span className="badge-estado status-completado" style={{ marginBottom: '20px' }}>
                        {perfil.rol.toUpperCase()}
                    </span>

                    <label className="btn-submit" style={{ cursor: 'pointer', padding: '10px 20px', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}>
                        {subiendoImagen ? 'Subiendo...' : '📷 Cambiar Fotografía'}
                        <input type="file" accept="image/*" onChange={cambiarFoto} style={{ display: 'none' }} disabled={subiendoImagen} />
                    </label>
                </div>

                {/* COLUMNA DERECHA: FORMULARIO DE EDICIÓN */}
                <div className="auth-card" style={{ flex: '2', minWidth: '300px', margin: 0, padding: '30px' }}>
                    <form onSubmit={guardarCambios}>
                        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginTop: 0, color: '#2c3e50' }}>
                            Información Personal
                        </h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px', marginTop: '15px' }}>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: '#7f8c8d', fontWeight: 'bold' }}>Nombre</label>
                                <input type="text" name="nombre" value={perfil.nombre} onChange={manejarCambio} className="form-input" required />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: '#7f8c8d', fontWeight: 'bold' }}>Apellidos</label>
                                <input type="text" name="apellidos" value={perfil.apellidos} onChange={manejarCambio} className="form-input" placeholder="Tus apellidos" />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: '#7f8c8d', fontWeight: 'bold' }}>Teléfono de Contacto</label>
                                <input type="text" name="telefono" value={perfil.telefono} onChange={manejarCambio} className="form-input" placeholder="Ej: 3001234567" />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: '#7f8c8d', fontWeight: 'bold' }}>Correo Electrónico</label>
                                {/* El correo lo dejamos disabled (solo lectura) por seguridad */}
                                <input type="email" value={perfil.email} className="form-input" disabled style={{ background: '#f4f7f6', color: '#999' }} />
                            </div>
                        </div>

                        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginTop: '30px', color: '#2c3e50' }}>
                            Ubicación
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px', marginTop: '15px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '0.85rem', color: '#7f8c8d', fontWeight: 'bold' }}>Dirección de Residencia / Envío</label>
                                <input type="text" name="direccion" value={perfil.direccion} onChange={manejarCambio} className="form-input" placeholder="Tu dirección completa" />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: '#7f8c8d', fontWeight: 'bold' }}>Barrio</label>
                                <input type="text" name="barrio" value={perfil.barrio} onChange={manejarCambio} className="form-input" />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: '#7f8c8d', fontWeight: 'bold' }}>Ciudad</label>
                                <input type="text" name="ciudad" value={perfil.ciudad} onChange={manejarCambio} className="form-input" placeholder="Ej: Bogotá" />
                            </div>
                        </div>

                        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginTop: '30px', color: '#2c3e50' }}>
                            Preferencias
                        </h3>

                        <div style={{ marginBottom: '20px', marginTop: '15px' }}>
                            <label style={{ fontSize: '0.85rem', color: '#7f8c8d', fontWeight: 'bold' }}>¿Qué tipo de productos te interesan?</label>
                            <textarea 
                                name="preferencias" 
                                value={perfil.preferencias} 
                                onChange={manejarCambio} 
                                className="form-input" 
                                rows="3" 
                                placeholder="Ej: Frutas orgánicas, ropa artesanal, servicios locales..."
                                style={{ resize: 'vertical' }}
                            ></textarea>
                        </div>

                        <button type="submit" className="btn-submit" style={{ width: '100%', marginTop: '10px' }} disabled={guardando}>
                            {guardando ? 'Guardando...' : '💾 Guardar Cambios'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MiPerfil;