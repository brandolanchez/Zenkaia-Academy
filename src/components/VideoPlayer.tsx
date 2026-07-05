'use client';

import ReactPlayer from 'react-player';
import Link from 'next/link';

interface VideoPlayerProps {
  url: string;
  isFree: boolean;
  hasPaid: boolean;
}

export default function VideoPlayer({ url, isFree, hasPaid }: VideoPlayerProps) {
  const canWatch = isFree || hasPaid;

  if (!canWatch) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#111',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ff003c\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
      }}>
        <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '500px', background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Suscríbete para ver esta clase</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Este contenido es exclusivo para miembros del programa. Completa tu Ruta Zenkai adquiriendo el acceso completo.
          </p>
          <Link href="/checkout" className="btn btn-primary" style={{ padding: '1rem 3rem' }}>
            Ver planes de pago
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls={true}
        playing={false}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload'
            }
          }
        }}
      />
    </div>
  );
}
