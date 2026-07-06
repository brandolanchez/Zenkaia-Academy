import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/Navbar';
import { approvePayment, rejectPayment } from './actions';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch pending payments with user details
  // As this is a MVP we'll just fetch all payments. In production, add pagination.
  const { data: payments, error } = await supabase
    .from('payments')
    .select(`
      id,
      method,
      proof_url,
      status,
      created_at,
      user_id,
      profiles!payments_user_id_fkey(full_name)
    `)
    .order('created_at', { ascending: false });

  // but for this MVP we focus on payment approvals as requested.

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Gestión de Pagos</h1>
      </div>

      <div className="card">
          <h2 className="card-title" style={{ marginBottom: '2rem' }}>Pagos Pendientes y Recientes</h2>
          
          {error && (
            <div className="error-message">Error cargando pagos: {error.message}</div>
          )}

          {!payments || payments.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No hay pagos registrados.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '1rem' }}>Fecha</th>
                    <th style={{ padding: '1rem' }}>Usuario</th>
                    <th style={{ padding: '1rem' }}>Método</th>
                    <th style={{ padding: '1rem' }}>Estado</th>
                    <th style={{ padding: '1rem' }}>Comprobante</th>
                    <th style={{ padding: '1rem' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment: any) => (
                    <tr key={payment.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem' }}>
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {payment.profiles?.full_name} <br/>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ID: {payment.user_id.slice(0,8)}...</span>
                      </td>
                      <td style={{ padding: '1rem', textTransform: 'uppercase' }}>
                        {payment.method}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.2rem 0.8rem', 
                          borderRadius: '20px', 
                          fontSize: '0.85rem',
                          background: payment.status === 'approved' ? 'rgba(0,255,100,0.1)' : payment.status === 'rejected' ? 'rgba(255,0,0,0.1)' : 'rgba(255,255,0,0.1)',
                          color: payment.status === 'approved' ? '#00ff66' : payment.status === 'rejected' ? '#ff3366' : '#ffd700'
                        }}>
                          {payment.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {payment.proof_url ? (
                          <a href={payment.proof_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)' }}>
                            Ver Imagen
                          </a>
                        ) : (
                          <span style={{ color: 'var(--text-secondary)' }}>Sin comprobante</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {payment.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <form action={async () => {
                              'use server';
                              await approvePayment(payment.id, payment.user_id);
                            }}>
                              <button type="submit" style={{ padding: '0.5rem 1rem', background: '#00ff66', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                ✓
                              </button>
                            </form>
                            <form action={async () => {
                              'use server';
                              await rejectPayment(payment.id);
                            }}>
                              <button type="submit" style={{ padding: '0.5rem 1rem', background: '#ff3366', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                ✕
                              </button>
                            </form>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
    </div>
  )
}
