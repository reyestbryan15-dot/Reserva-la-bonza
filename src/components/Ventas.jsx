import React from 'react';
import { Link } from 'react-router-dom';

const Ventas = () => {
  return (
    <div style={styles.container}>
      {/* Capa oscura para que el texto se lea bien */}
      <div style={styles.overlay}></div>

      {/* Tarjeta de Vidrio (Glassmorphism) */}
      <div style={styles.card}>
        <span style={styles.badge}>PRÓXIMAMENTE</span>
        
        <h1 style={styles.title}>
          Invierte en el <br />
          <span style={{ color: '#D4AF37' }}>Paraíso</span>
        </h1>

        <p style={styles.text}>
          Estamos preparando una selección exclusiva de apartamentos frente al mar en Santa Marta.
          <br /><br />
          ¿Te imaginas ser dueño de esta vista? Sé el primero en enterarte cuando iniciemos la preventa.
        </p>

        {/* Botón de WhatsApp para captar clientes YA */}
        <a 
          href="https://wa.me/573000000000?text=Hola,%20me%20interesa%20comprar%20o%20invertir%20en%20propiedades,%20anótame%20en%20la%20lista%20de%20espera." 
          target="_blank" 
          rel="noopener noreferrer"
          style={styles.button}
        >
          Unirme a la Lista de Espera 📋
        </a>

        <Link to="/" style={styles.backLink}>
          ← Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

// ESTILOS (CSS en JS para que sea fácil de copiar)
const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    width: '100%',
    // Foto de fondo (cámbiala por una tuya si quieres)
    backgroundImage: 'url("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop")', 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Helvetica Neue', sans-serif",
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Oscurece la foto
  },
  card: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.1)', // Fondo transparente
    backdropFilter: 'blur(15px)', // EFECTO VIDRIO BORROSO
    WebkitBackdropFilter: 'blur(15px)',
    padding: '40px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxWidth: '500px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
    color: 'white',
  },
  badge: {
    background: '#D4AF37', // Color Dorado
    color: 'white',
    padding: '5px 15px',
    borderRadius: '50px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    letterSpacing: '2px',
    marginBottom: '20px',
    display: 'inline-block',
  },
  title: {
    fontSize: '2.5rem',
    margin: '15px 0',
    lineHeight: '1.2',
    fontWeight: '700',
  },
  text: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    marginBottom: '30px',
    opacity: '0.9',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '15px',
    background: 'white',
    color: '#333',
    textDecoration: 'none',
    borderRadius: '50px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    transition: 'transform 0.2s',
    marginBottom: '20px',
  },
  backLink: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '0.9rem',
  }
};

export default Ventas;