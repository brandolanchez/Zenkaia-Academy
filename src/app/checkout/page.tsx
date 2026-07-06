'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';

const MAX_FILE_SIZE_MB = 5;

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'zinli'>('crypto');
  const [plan, setPlan] = useState<'standard' | 'elite'>('standard');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userName, setUserName] = useState('');
  const router = useRouter();
  const supabase = createClient();

  // Auth guard: redirect to login if not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      // Get user's name for Zinli reference
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      if (profile?.full_name) {
        setUserName(profile.full_name);
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`El archivo es demasiado grande. Máximo ${MAX_FILE_SIZE_MB}MB.`);
        e.target.value = '';
        return;
      }
      setError(null);
      setFile(selectedFile);
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

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const proofUrl = uploadData.path;

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

  if (checkingAuth) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ paddingTop: '150px', textAlign: 'center', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Cargando...</p>
        </div>
      </>
    );
  }

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

  const price = plan === 'standard' ? 47 : 97;

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '150px', paddingBottom: '5rem', minHeight: '100vh' }}>
        <h1 className="section-title text-left" style={{ marginBottom: '1rem' }}>Finaliza tu compra</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>Zenkai Mentorship Program - ${price} USD</p>

        {/* Plan selection */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <button 
            type="button"
            onClick={() => setPlan('standard')}
            style={{ 
              flex: '1 1 280px', padding: '1.5rem', textAlign: 'left',
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
              flex: '1 1 280px', padding: '1.5rem', textAlign: 'left',
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

        {/* Payment + Upload grid */}
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
                Crypto (USDT)
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
                    Envía exactamente <strong style={{ color: 'var(--accent-color)', fontSize: '1.1rem' }}>{price} USDT</strong> a cualquiera de estas direcciones:
                  </p>
                  
                  {/* TRC20 - Recommended */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <strong>Red TRC20 (Tron)</strong> <span style={{ background: 'rgba(0, 255, 60, 0.1)', color: '#00ff3c', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', marginLeft: '0.5rem' }}>{'Recomendado · Comisión <$1'}</span>
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#000', padding: '1rem', borderRadius: '4px', flexWrap: 'wrap' }}>
                      <div style={{ background: '#fff', padding: '4px', borderRadius: '4px', flexShrink: 0 }}>
                        <QRCode value="TDZozqLwArk7LYMtTDZi5gGpZBUEeNVDTT" size={70} />
                      </div>
                      <p style={{ fontFamily: 'monospace', margin: 0, wordBreak: 'break-all', flex: 1, minWidth: '120px', fontSize: '0.85rem' }}>
                        TDZozqLwArk7LYMtTDZi5gGpZBUEeNVDTT
                      </p>
                      <button 
                        type="button" 
                        onClick={() => handleCopy('TDZozqLwArk7LYMtTDZi5gGpZBUEeNVDTT', 'crypto-trc20')}
                        style={{ background: copiedField === 'crypto-trc20' ? '#00ff3c' : 'var(--accent-color)', color: copiedField === 'crypto-trc20' ? '#000' : '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                      >
                        {copiedField === 'crypto-trc20' ? '✓ Copiado' : 'Copiar'}
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
                      <p style={{ fontFamily: 'monospace', margin: 0, wordBreak: 'break-all', flex: 1, minWidth: '120px', fontSize: '0.85rem' }}>
                        0x50981102210ee0d3bc449Bef0B5234B528D50C21
                      </p>
                      <button 
                        type="button" 
                        onClick={() => handleCopy('0x50981102210ee0d3bc449Bef0B5234B528D50C21', 'crypto-erc20')}
                        style={{ background: copiedField === 'crypto-erc20' ? '#00ff3c' : 'var(--accent-color)', color: copiedField === 'crypto-erc20' ? '#000' : '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                      >
                        {copiedField === 'crypto-erc20' ? '✓ Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Envía exactamente <strong style={{ color: 'var(--accent-color)', fontSize: '1.1rem' }}>${price}</strong> a la siguiente cuenta Zinli:</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#000', padding: '1rem', borderRadius: '4px', flexWrap: 'wrap' }}>
                    <p style={{ fontFamily: 'monospace', margin: 0, wordBreak: 'break-all', flex: 1, minWidth: '120px', fontSize: '0.95rem' }}>
                      lanchez456@gmail.com
                    </p>
                    <button 
                      type="button" 
                      onClick={() => handleCopy('lanchez456@gmail.com', 'zinli')}
                      style={{ background: copiedField === 'zinli' ? '#00ff3c' : 'var(--accent-color)', color: copiedField === 'zinli' ? '#000' : '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                    >
                      {copiedField === 'zinli' ? '✓ Copiado' : 'Copiar'}
                    </button>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '0.8rem' }}>
                    💡 En el concepto de la transferencia escribe: <strong style={{ color: '#fff' }}>Zenkai membresia</strong>
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
            
            {error && <div className="error-message" style={{ background: 'rgba(255,0,60,0.1)', border: '1px solid var(--accent-color)', padding: '1rem', marginBottom: '1.5rem', borderRadius: '4px', fontSize: '0.9rem' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ marginBottom: '0.5rem' }}>Captura de pago</label>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>PNG, JPG o PDF · Máximo {MAX_FILE_SIZE_MB}MB</p>
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={handleFileChange}
                  style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#fff' }}
                  required
                />
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Plan</span>
                  <span>{plan === 'standard' ? 'Standard' : 'Elite'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Método</span>
                  <span>{paymentMethod === 'crypto' ? 'Crypto USDT' : 'Zinli'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span>${price}.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <span>Total a Pagar</span>
                  <span style={{ color: 'var(--accent-color)' }}>${price}.00</span>
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
