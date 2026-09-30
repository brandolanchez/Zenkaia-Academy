'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';

// ⚠️ DATOS DE PRUEBA — reemplazar por los datos reales antes de publicar.
const METHODS = [
  {
    id: 'pagomovil',
    tab: 'Pago Móvil / Depósito',
    amount: 'Equivalente a $20 en Bs. (tasa BCV del día)',
    rows: [
      ['Banco', 'Banco de Prueba (0000)'],
      ['Teléfono', '0412-000-0000'],
      ['Cédula / RIF', 'V-00.000.000'],
      ['Titular', 'Nombre de prueba'],
    ],
  },
  {
    id: 'binance',
    tab: 'Binance Pay',
    amount: '20 USDT',
    rows: [
      ['Pay ID', '000000000'],
      ['Usuario', 'endurance_prueba'],
    ],
  },
];

export default function PaymentQrs() {
  const [active, setActive] = useState(METHODS[0].id);
  const [copied, setCopied] = useState<string | null>(null);
  const method = METHODS.find(m => m.id === active)!;

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* el portapapeles puede no estar disponible */
    }
  };

  const qrValue = `${method.tab}\n` + method.rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\nMonto: ${method.amount}`;

  return (
    <div className="eal-paybox">
      <div className="eal-tabs" role="tablist" aria-label="Método de pago">
        {METHODS.map(m => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={active === m.id}
            aria-controls={`pay-${m.id}`}
            className={active === m.id ? 'is-active' : ''}
            onClick={() => setActive(m.id)}
          >
            {m.tab}
          </button>
        ))}
      </div>

      <div className="eal-paypanel" role="tabpanel" id={`pay-${method.id}`}>
        <div className="eal-qr">
          <QRCode value={qrValue} size={136} bgColor="#ffffff" fgColor="#11161b" level="M" />
          <span className="eal-test-badge">Datos de prueba</span>
        </div>
        <div className="eal-paydata">
          <p className="eal-amount"><span>Monto</span>{method.amount}</p>
          <dl>
            {method.rows.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>
                  <span>{v}</span>
                  <button type="button" onClick={() => copy(`${method.id}-${k}`, v)} aria-label={`Copiar ${k}`}>
                    {copied === `${method.id}-${k}` ? 'Copiado ✓' : 'Copiar'}
                  </button>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
