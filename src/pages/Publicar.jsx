import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../index.css';

function Publicar({ token }) {
    const navigate = useNavigate();
    const rol = localStorage.getItem('rol');

    const [datos, setDatos] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '', 
        categoria: 'Alimentos'
    });
    const [archivos, setArchivos] = useState([]); 
    const [previsualizaciones, setPrevisualizaciones] = useState([]); 

    useEffect(() => {
        if (!token || rol !== 'productor') {
            toast.error("Acceso denegado: Solo para Comerciantes");
            navigate('/');
        }
    }, [token, rol, navigate]);

    const manejarCambio = (e) => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };

    const manejarArchivos = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setArchivos(selectedFiles);
        const previews = selectedFiles.map(file => URL.createObjectURL(file));
        setPrevisualizaciones(previews);
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        
        if (archivos.length === 0) {
            return toast.error("Por favor, selecciona al menos una foto");
        }

        const formData = new FormData();
        formData.append('nombre', datos.nombre);
        formData.append('descripcion', datos.descripcion);
        formData.append('precio', datos.precio);
        formData.append('stock', datos.stock); 
        formData.append('categoria', datos.categoria);
        
        archivos.forEach(file => {
            formData.append('imagenes', file);
        });

        try {
            const respuesta = await fetch('/api/productos', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (respuesta.ok) {
                toast.success("¡Producto exhibido con éxito!");
                navigate('/mis-productos'); // Te sugiero redirigir a tu nueva gestión de productos
            } else {
                toast.error("Error al publicar el producto");
            }
        } catch (error) {
            toast.error("Error de conexión con el servidor");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Exhibir Nuevo Producto</h2>
                <form onSubmit={manejarEnvio} className="auth-form">
                    
                    <input type="text" name="nombre" placeholder="¿Qué vas a vender?" className="form-input" onChange={manejarCambio} required />
                    
                    <textarea name="descripcion" placeholder="Describe tu producto (origen, calidad, etc.)" className="form-input" onChange={manejarCambio} required />
                    
                    {/* Fila para Precio y Stock */}
                    <div className="form-fila">
                        <input type="number" name="precio" placeholder="Precio ($)" className="form-input" onChange={manejarCambio} required />
                        <input type="number" name="stock" placeholder="Cantidad (Stock)" className="form-input" onChange={manejarCambio} required />
                    </div>
                    
                    <select name="categoria" className="form-input" onChange={manejarCambio}>
                        <option value="Alimentos">Alimentos / Agro</option>
                        <option value="Tecnologia">Tecnología / Computación</option>
                        <option value="Servicios">Servicios / Oficios</option>
                        <option value="Mascotas">Alimento para Mascotas</option>
                        <option value="Artesanias">Artesanías / Ropa</option>
                    </select>

                    {/* SECCIÓN DE FOTOS LIMPIA */}
                    <div className="section-negocio">
                        <h4 className="section-negocio-titulo">
                            📸 Fotos del Producto
                        </h4>
                        
                        <label className="file-input-label">
                            <input 
                                type="file" 
                                multiple 
                                accept="image/*" 
                                onChange={manejarArchivos} 
                                className="file-input-hidden"
                            />
                            {archivos.length > 0 ? `✅ ${archivos.length} fotos seleccionadas` : "Seleccionar imágenes..."}
                        </label>
                        
                        {/* Contenedor de Miniaturas (usa la nueva clase) */}
                        <div className="previews-container">
                            {previsualizaciones.map((url, i) => (
                                <img key={i} src={url} alt="preview" className="img-preview-mini" />
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn-submit">Publicar para la Venta</button>
                </form>
            </div>
        </div>
    );
}

export default Publicar;