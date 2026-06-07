import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../index.css';

function Login({ setToken }) {
    const [credenciales, setCredenciales] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const manejarCambio = (e) => {
        setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credenciales)
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                // GUARDAMOS TOKEN Y ROL PARA LA SEGURIDAD
                localStorage.setItem('token', resultado.token);
                localStorage.setItem('rol', resultado.usuario.rol);
                
                setToken(resultado.token);
                toast.success(`¡Bienvenido de nuevo, ${resultado.usuario.nombre}!`);
                navigate('/');
            } else {
                toast.error(resultado.error || "Credenciales incorrectas");
            }
        } catch (error) {
            toast.error("Error al conectar con el servidor");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Iniciar Sesión</h2>
                <form onSubmit={manejarEnvio} className="auth-form">
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
                    <button type="submit" className="btn-submit">Entrar a ConectaLocal</button>
                </form>
            </div>
        </div>
    );
}

export default Login;