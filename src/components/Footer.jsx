import React from 'react';

const Footer = () => {
    return (
        <footer style={{ 
            backgroundColor: '#121920', 
            color: '#95a5a6', 
            padding: '30px 20px', 
            marginTop: '40px', 
            borderTop: '4px solid #27ae60' 
        }}>
            <div style={{ 
                maxWidth: '900px', 
                margin: '0 auto', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '30px' 
            }}>
                
                {/* Branding - Lado Izquierdo */}
                <div style={{ flex: '1 1 300px' }}>
                    <h2 style={{ color: '#ffffff', margin: 0, fontSize: '1.2rem' }}>ConectaLocal</h2>
                </div>

                {/* Autores y Copyright - Lado Derecho */}
                <div style={{ flex: '1 1 300px', textAlign: 'right' }}>
                    <p style={{ fontSize: '0.85rem', margin: '0 0 5px 0', color: '#ffffff' }}>
                        Harold Ducon & Valentina Benitez
                    </p>
                    <p style={{ fontSize: '0.75rem', margin: 0 }}>
                        &copy; {new Date().getFullYear()} ConectaLocal. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;