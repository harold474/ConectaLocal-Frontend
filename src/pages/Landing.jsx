import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Landing() {
    const [form, setForm] = useState({ nombre: '', email: '', asunto: 'Soporte', mensaje: '' });
    // NUEVO ESTADO PARA EL DESPLEGABLE
    const [mostrarForm, setMostrarForm] = useState(false);

    const enviarReporte = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/contacto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                toast.success("Mensaje enviado con éxito");
                setForm({ nombre: '', email: '', asunto: 'Soporte', mensaje: '' });
                setMostrarForm(false); // Cierra el formulario tras enviar
            }
        } catch (error) { toast.error("Error de conexión"); }
    };

    return (
        <div style={{ fontFamily: "'Segoe UI', sans-serif", color: '#333' }}>
            {/* HERO SECTION - Igual a como lo tenías */}
            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'linear-gradient(135deg, #2c3e50 0%, #27ae60 100%)', color: 'white' }}>
                <h1 style={{ fontSize: '3.5rem', margin: '0 0 20px 0' }}>ConectaLocal</h1>
                <p style={{ fontSize: '1.5rem', fontWeight: '300', marginBottom: '30px' }}>Apoya a los productores y comercios de tu barrio mientras disfrutas productos frescos, únicos y de confianza.</p>
                <Link to="/catalogo" style={{ padding: '15px 40px', background: 'white', color: '#27ae60', textDecoration: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    Explorar Productos
                </Link>
            </div>

            {/* SECCIÓN DE ALCANCE - Igual a como lo tenías */}
            <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 20px' }}>
                <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '40px' }}>¿Qué hacemos?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    {/* ... tus cards ... */}
                    <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}><h3>🍎 Frescura Local</h3><p>Acercamos los productos de tu barrio a tu hogar, fortaleciendo el comercio local y creando conexiones más justas entre vendedores y compradores.</p></div>
                    <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}><h3>🤝 Comunidad Segura</h3><p>Monitoreamos cada transacción y cada vendedor para asegurar que la experiencia sea ética y de alta calidad.</p></div>
                    <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}><h3>🛡️ Moderación Activa</h3><p>Nuestros administradores revisan constantemente las publicaciones para proteger a nuestra comunidad de contenido inapropiado.</p></div>
                </div>
            </div>

            {/* FORMULARIO PROFESIONAL DESPLEGABLE */}
            <div style={{ maxWidth: '600px', margin: '0 auto 60px auto', textAlign: 'center' }}>
                <button 
                    onClick={() => setMostrarForm(!mostrarForm)}
                    style={{ 
                        padding: '15px 30px', 
                        background: mostrarForm ? '#c0392b' : '#2c3e50', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '30px', 
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        transition: '0.3s',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                    }}
                >
                    {mostrarForm ? 'Cerrar Formulario' : '¿Necesitas ayuda o reportar algo?'}
                </button>

                {mostrarForm && (
                    <div style={{ 
                        marginTop: '20px', 
                        padding: '30px', 
                        background: 'white', 
                        borderRadius: '15px', 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        border: '1px solid #eee',
                        textAlign: 'left'
                    }}>
                        <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Enviar reporte al administrador</h3>
                        <form onSubmit={enviarReporte} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input required placeholder="Tu Nombre" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} onChange={e => setForm({...form, nombre: e.target.value})} value={form.nombre} />
                            <input required type="email" placeholder="Tu Email" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} onChange={e => setForm({...form, email: e.target.value})} value={form.email} />
                            <select style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} onChange={e => setForm({...form, asunto: e.target.value})} value={form.asunto}>
                                <option>Soporte Técnico</option>
                                <option>Reportar Mal Comportamiento</option>
                                <option>Duda o Sugerencia</option>
                            </select>
                            <textarea required placeholder="Cuéntanos qué sucede..." style={{ padding: '12px', height: '100px', border: '1px solid #ddd', borderRadius: '8px', resize: 'none' }} onChange={e => setForm({...form, mensaje: e.target.value})} value={form.mensaje} />
                            <button type="submit" style={{ padding: '15px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar Mensaje</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}   