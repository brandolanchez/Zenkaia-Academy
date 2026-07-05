'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'zinli'>('crypto');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Por favor adjunta un comprobante de pago.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Debes iniciar sesión");

      // 1. Subir archivo al bucket 'payment-proofs'
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Obtener URL pública (asumiendo que el bucket es privado, pero para MVP guardamos el path)
      const proofUrl = uploadData.path;

      // 3. Insertar registro en payments
      // Buscamos un curso (para MVP usamos un ID de curso falso o nulo si no hay tabla llena)
      // Como la tabla courses tiene FK, necesitamos un course_id válido. En un caso real lo pasaríamos por URL o buscaríamos.
      // Aquí insertaremos solo user_id, method y proof_url si la BD lo permite, de lo contrario esto fallaría si course_id es NOT NULL.
      // En nuestro schema schema.sql course_id es opcional (no dice NOT NULL).
      
      const { error: insertError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          method: paymentMethod,
          proof_url: proofUrl,
          status: 'pending'
        });

      if (insertError) throw insertError;

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error al procesar tu pago.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ paddingTop: '150px', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2>Comprobante Enviado</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem', maxWidth: '500px' }}>
            Hemos recibido tu comprobante de pago. Un agente lo revisará pronto y te dará acceso a tu Ruta completa.
          </p>
          <button onClick={() => router.push('/dashboard/profile')} className="btn btn-primary">
            Ir a mi perfil
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '150px', paddingBottom: '5rem', minHeight: '100vh' }}>
        <h1 className="section-title text-left" style={{ marginBottom: '1rem' }}>Finaliza tu compra</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>Zenkai Mentorship Program - $47 USD</p>

        <div className="bento-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          
          <div className="card">
            <h2 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Selecciona tu método de pago</h2>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button 
                type="button"
                onClick={() => setPaymentMethod('crypto')}
                style={{ 
                  flex: 1, padding: '1rem', background: paymentMethod === 'crypto' ? 'rgba(255,0,60,0.1)' : 'transparent',
                  border: paymentMethod === 'crypto' ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  color: '#fff', cursor: 'pointer'
                }}
              >
                Crypto (USDT ERC20)
              </button>
              <button 
                type="button"
                onClick={() => setPaymentMethod('zinli')}
                style={{ 
                  flex: 1, padding: '1rem', background: paymentMethod === 'zinli' ? 'rgba(255,0,60,0.1)' : 'transparent',
                  border: paymentMethod === 'zinli' ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  color: '#fff', cursor: 'pointer'
                }}
              >
                Zinli
              </button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', border: '1px dashed var(--border-color)', marginBottom: '2rem' }}>
              {paymentMethod === 'crypto' ? (
                <>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Envía exactamente <strong>47 USDT</strong> a la siguiente dirección ERC20:</p>
                  <p style={{ fontFamily: 'monospace', background: '#000', padding: '1rem', wordBreak: 'break-all' }}>
                    0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                  </p>
                </>
              ) : (
                <>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Envía exactamente <strong>$47</strong> a la siguiente cuenta Zinli:</p>
                  <p style={{ fontFamily: 'monospace', background: '#000', padding: '1rem' }}>
                    pagos_prueba@zinli.com
                  </p>
                </>
              )}
            </div>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              * Una vez realizado el pago, toma una captura de pantalla donde se vea claramente el monto y el ID de transacción.
            </p>
          </div>

          <div className="card">
            <h2 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Sube tu comprobante</h2>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ marginBottom: '1rem' }}>Captura de pago</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#fff' }}
                  required
                />
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span>Subtotal</span>
                  <span>$47.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  <span>Total a Pagar</span>
                  <span style={{ color: 'var(--accent-color)' }}>$47.00</span>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Procesando...' : 'Confirmar Pago y Enviar'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  )
}
