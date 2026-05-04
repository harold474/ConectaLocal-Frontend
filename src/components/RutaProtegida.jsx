import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ children, rolPermitido }) => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Si no hay token, lo mandamos al login de una
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Si el rol no coincide con el permitido, lo mandamos al inicio
    if (rolPermitido && rol !== rolPermitido) {
        return <Navigate to="/" />;
    }

    return children;
};

export default RutaProtegida;