'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'zinli'>('crypto');
  const [plan, setPlan] = useState<'standard' | 'elite'>('standard');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
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
          method: `${paymentMethod}-${plan}`,
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
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>Zenkai Mentorship Program - {plan === 'standard' ? '$47' : '$97'} USD</p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <button 
            type="button"
            onClick={() => setPlan('standard')}
            style={{ 
              flex: '1 1 300px', padding: '1.5rem', textAlign: 'left',
              background: plan === 'standard' ? 'rgba(255,0,60,0.1)' : 'rgba(255,255,255,0.02)',
              border: plan === 'standard' ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
              color: '#fff', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s'
            }}
          >
            <h3 style={{ marginBottom: '0.5rem' }}>Mentoría Standard</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Rutinas, seguimiento grupal y comunidad.</p>
            <strong style={{ fontSize: '1.2rem', color: 'var(--accent-color)' }}>$47 USD</strong>
          </button>
          
          <button 
            type="button"
            onClick={() => setPlan('elite')}
            style={{ 
              flex: '1 1 300px', padding: '1.5rem', textAlign: 'left',
              background: plan === 'elite' ? 'rgba(255,0,60,0.1)' : 'rgba(255,255,255,0.02)',
              border: plan === 'elite' ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
              color: '#fff', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s'
            }}
          >
            <h3 style={{ marginBottom: '0.5rem' }}>Mentoría Elite</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Todo lo del Standard + mentoría 1 a 1 y nutrición.</p>
            <strong style={{ fontSize: '1.2rem', color: 'var(--accent-color)' }}>$97 USD</strong>
          </button>
        </div>
        <div className="bento-grid">
          
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
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                    Envía exactamente <strong style={{ color: 'var(--accent-color)', fontSize: '1.1rem' }}>{plan === 'standard' ? '47' : '97'} USDT</strong> a cualquiera de estas direcciones:
                  </p>
                  
                  {/* TRC20 - Recomendado */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <strong>Red TRC20 (Tron)</strong> <span style={{ background: 'rgba(0, 255, 60, 0.1)', color: '#00ff3c', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', marginLeft: '0.5rem' }}>Recomendado: Comisiones casi nulas</span>
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#000', padding: '1rem', borderRadius: '4px', flexWrap: 'wrap' }}>
                      <div style={{ background: '#fff', padding: '4px', borderRadius: '4px', flexShrink: 0 }}>
                        <QRCode value="TDZozqLwArk7LYMtTDZi5gGpZBUEeNVDTT" size={70} />
                      </div>
                      <p style={{ fontFamily: 'monospace', margin: 0, wordBreak: 'break-all', flex: 1, minWidth: '150px' }}>
                        TDZozqLwArk7LYMtTDZi5gGpZBUEeNVDTT
                      </p>
                      <button 
                        type="button" 
                        onClick={() => handleCopy('TDZozqLwArk7LYMtTDZi5gGpZBUEeNVDTT', 'crypto-trc20')}
                        style={{ background: 'var(--accent-color)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                      >
                        {copiedField === 'crypto-trc20' ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  </div>

                  {/* ERC20 */}
                  <div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Red ERC20 (Ethereum)</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#000', padding: '1rem', borderRadius: '4px', opacity: 0.8, flexWrap: 'wrap' }}>
                      <div style={{ background: '#fff', padding: '4px', borderRadius: '4px', flexShrink: 0 }}>
                        <QRCode value="0x50981102210ee0d3bc449Bef0B5234B528D50C21" size={70} />
                      </div>
                      <p style={{ fontFamily: 'monospace', margin: 0, wordBreak: 'break-all', flex: 1, minWidth: '150px' }}>
                        0x50981102210ee0d3bc449Bef0B5234B528D50C21
                      </p>
                      <button 
                        type="button" 
                        onClick={() => handleCopy('0x50981102210ee0d3bc449Bef0B5234B528D50C21', 'crypto-erc20')}
                        style={{ background: 'var(--accent-color)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                      >
                        {copiedField === 'crypto-erc20' ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Envía exactamente <strong style={{ color: 'var(--accent-color)', fontSize: '1.1rem' }}>${plan === 'standard' ? '47' : '97'}</strong> a la siguiente cuenta Zinli:</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#000', padding: '1rem', borderRadius: '4px', flexWrap: 'wrap' }}>
                    <p style={{ fontFamily: 'monospace', margin: 0, wordBreak: 'break-all', flex: 1, minWidth: '150px' }}>
                      lanchez456@gmail.com
                    </p>
                    <button 
                      type="button" 
                      onClick={() => handleCopy('lanchez456@gmail.com', 'zinli')}
                      style={{ background: 'var(--accent-color)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                    >
                      {copiedField === 'zinli' ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
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
                  <span>${plan === 'standard' ? '47.00' : '97.00'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  <span>Total a Pagar</span>
                  <span style={{ color: 'var(--accent-color)' }}>${plan === 'standard' ? '47.00' : '97.00'}</span>
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
