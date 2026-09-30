'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';

// ⚠️ DATOS DE PRUEBA — reemplazar por los datos reales antes de publicar.
const METHODS = [
  {
    id: 'pagomovil',
    name: 'Pago Móvil / Depósito',
    rows: [
      ['Banco', 'Banco de Prueba (0000)'],
      ['Teléfono', '0412-000-0000'],
      ['Cédula / RIF', 'V-00.000.000'],
      ['Titular', 'Nombre de prueba'],
      ['Monto', 'Equivalente a $20 en Bs. (tasa BCV del día)'],
    ],
  },
  {
    id: 'binance',
    name: 'Binance Pay',
    rows: [
      ['Pay ID', '000000000'],
      ['Usuario', 'endurance_prueba'],
      ['Monto', '20 USDT'],
    ],
  },
];

export default function PaymentQrs() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* el portapapeles puede no estar disponible */
    }
  };

  return (
    <div className="eal-qrs">
      {METHODS.map(m => {
        const qrValue = `${m.name}\n` + m.rows.map(([k, v]) => `${k}: ${v}`).join('\n');
        return (
          <div key={m.id} className="eal-qr-card">
            <div className="eal-qr-head">
              <h3>{m.name}</h3>
              <span className="eal-test-badge">Datos de prueba</span>
            </div>
            <div className="eal-qr-code">
              <QRCode value={qrValue} size={148} bgColor="#ffffff" fgColor="#030303" level="M" />
            </div>
            <dl className="eal-qr-data">
              {m.rows.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>
                    <span>{v}</span>
                    {k !== 'Monto' && (
                      <button type="button" onClick={() => copy(`${m.id}-${k}`, v)} aria-label={`Copiar ${k}`}>
                        {copied === `${m.id}-${k}` ? 'Copiado' : 'Copiar'}
                      </button>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        );
      })}
    </div>
  );
}
