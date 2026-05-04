import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast'; // Re-importado para las notificaciones

function Registro() {
    const navigate = useNavigate();
    const [datos, setDatos] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'consumidor',
        nombre_negocio: '',
        direccion: '',
        barrio: ''
    });

    const [errorServidor, setErrorServidor] = useState("");

    const manejarCambio = (e) => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setErrorServidor(""); 

        try {
            const res = await fetch('http://localhost:3000/api/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            if (res.ok) {
                // Notificación de éxito (saldrá abajo a la derecha)
                toast.success("¡Cuenta creada con éxito! Ya puedes iniciar sesión.", {
                    icon: '✅',
                    duration: 4000
                });
                
                navigate('/login');
            } else {
                const errorData = await res.json();
                const mensajeError = errorData.error || "Error al registrar";
                
                // Notificación de error y mensaje en la tarjeta
                toast.error(mensajeError);
                setErrorServidor(mensajeError);
            }
        } catch (error) {
            toast.error("Error de conexión con el servidor");
            setErrorServidor("No se pudo conectar con el servidor. Intenta más tarde.");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Crear Cuenta</h2>
                <form onSubmit={manejarEnvio} className="auth-form">
                    <input 
                        type="text" 
                        name="nombre" 
                        placeholder="Nombre completo" 
                        className="form-input" 
                        onChange={manejarCambio} 
                        required 
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Correo electrónico" 
                        className="form-input" 
                        onChange={manejarCambio} 
                        required 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Contraseña" 
                        className="form-input" 
                        onChange={manejarCambio} 
                        required 
                    />

                    <select name="rol" className="form-input" onChange={manejarCambio}>
                        <option value="consumidor">Soy Consumidor (Quiero comprar)</option>
                        <option value="productor">Soy Comerciante (Quiero vender)</option>
                    </select>

                    {/* Campos adicionales exclusivos para productores */}
                    {datos.rol === 'productor' && (
                        <>
                            <input 
                                type="text" 
                                name="nombre_negocio" 
                                placeholder="Nombre de tu negocio" 
                                className="form-input" 
                                onChange={manejarCambio} 
                                required 
                            />
                            <input 
                                type="text" 
                                name="direccion" 
                                placeholder="Dirección física" 
                                className="form-input" 
                                onChange={manejarCambio} 
                                required 
                            />
                            <input 
                                type="text" 
                                name="barrio" 
                                placeholder="Barrio" 
                                className="form-input" 
                                onChange={manejarCambio} 
                                required 
                            />
                        </>
                    )}

                    <button type="submit" className="btn-submit">Registrarme</button>
                    
                    {/* Mensaje de error visible en la tarjeta */}
                    {errorServidor && <p className="error-texto">{errorServidor}</p>}

                    <p className="auth-footer">
                        ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión aquí</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Registro;