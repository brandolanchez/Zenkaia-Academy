'use client';

import { useEffect, useState } from 'react';

const PRICE_USD = 20;

type Rate = { usd: number; eur: number | null; date: string | null };

const fmtBs = (n: number) =>
  n.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (iso: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('es-VE', { day: 'numeric', month: 'long', timeZone: 'America/Caracas' });
};

// Datos de pago
const PAGO_MOVIL = {
  bank: 'Bancamiga (0172)',
  phone: '04126134013',
  phoneLabel: '0412-613-4013',
  id: '25239611',
  idLabel: 'V-25.239.611',
  holder: 'Brando José Lanchez Palmera',
};

const BINANCE = {
  holder: 'Brando Lanchez',
  email: 'lanchez456@gmail.com',
};

export default function PaymentQrs() {
  const [active, setActive] = useState<'pagomovil' | 'binance'>('pagomovil');
  const [copied, setCopied] = useState<string | null>(null);
  const [rate, setRate] = useState<Rate | null>(null);
  const [rateError, setRateError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/endurance/tasa')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((data: Rate) => { if (!cancelled) setRate(data); })
      .catch(() => { if (!cancelled) setRateError(true); });
    return () => { cancelled = true; };
  }, []);

  // El cobro en bolívares se calcula a la tasa BCV del EURO (no del dólar), por el diferencial cambiario.
  const eurRate = rate?.eur ?? null;
  const amountBs = eurRate ? Math.ceil(PRICE_USD * eurRate * 100) / 100 : null;
  const amountLabel = amountBs !== null ? `Bs ${fmtBs(amountBs)}` : null;

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* el portapapeles puede no estar disponible */
    }
  };

  const pagoMovilAll = [
    'Pago Móvil – Endurance at the Limit',
    `Banco: ${PAGO_MOVIL.bank}`,
    `Teléfono: ${PAGO_MOVIL.phone}`,
    `Cédula: ${PAGO_MOVIL.idLabel}`,
    `Titular: ${PAGO_MOVIL.holder}`,
    amountLabel ? `Monto: ${amountLabel}` : `Monto: $${PRICE_USD} a tasa euro BCV del día`,
  ].join('\n');

  const binanceAll = [
    'Binance Pay – Endurance at the Limit',
    `Correo: ${BINANCE.email}`,
    `Titular: ${BINANCE.holder}`,
    `Monto: ${PRICE_USD} USDT`,
  ].join('\n');

  const Row = ({ k, label, value, copyValue }: { k: string; label: string; value: string; copyValue?: string }) => (
    <div>
      <dt>{label}</dt>
      <dd>
        <span>{value}</span>
        <button type="button" onClick={() => copy(k, copyValue ?? value)} aria-label={`Copiar ${label}`}>
          {copied === k ? 'Copiado ✓' : 'Copiar'}
        </button>
      </dd>
    </div>
  );

  return (
    <div className="eal-paybox">
      <div className="eal-tabs" role="tablist" aria-label="Método de pago">
        <button type="button" role="tab" aria-selected={active === 'pagomovil'} aria-controls="pay-pagomovil"
          className={active === 'pagomovil' ? 'is-active' : ''} onClick={() => setActive('pagomovil')}>
          Pago Móvil
        </button>
        <button type="button" role="tab" aria-selected={active === 'binance'} aria-controls="pay-binance"
          className={active === 'binance' ? 'is-active' : ''} onClick={() => setActive('binance')}>
          Binance Pay
        </button>
      </div>

      {active === 'pagomovil' ? (
        <div className="eal-paypanel" role="tabpanel" id="pay-pagomovil">
          <div className="eal-qr">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/endurance/qr-pagomovil.webp" alt="Código QR de Pago Móvil Bancamiga" width={440} height={445} />
          </div>
          <div className="eal-paydata">
            <div className="eal-amount">
              <span>Monto a pagar</span>
              {amountLabel ? (
                <>
                  <strong>{amountLabel}</strong>
                  <small>
                    Calculado a la tasa euro BCV: Bs {fmtBs(eurRate!)}
                    {fmtDate(rate!.date) ? ` (${fmtDate(rate!.date)})` : ''}
                  </small>
                  <button type="button" className="eal-copy-amount" onClick={() => copy('monto', fmtBs(amountBs!))}>
                    {copied === 'monto' ? 'Monto copiado ✓' : 'Copiar monto'}
                  </button>
                </>
              ) : rateError || (rate && !eurRate) ? (
                <strong>${PRICE_USD} a tasa euro BCV del día</strong>
              ) : (
                <strong className="eal-loading">Consultando tasa BCV…</strong>
              )}
            </div>
            <dl>
              <Row k="banco" label="Banco" value={PAGO_MOVIL.bank} copyValue="0172" />
              <Row k="tel" label="Teléfono" value={PAGO_MOVIL.phoneLabel} copyValue={PAGO_MOVIL.phone} />
              <Row k="ci" label="Cédula" value={PAGO_MOVIL.idLabel} copyValue={PAGO_MOVIL.id} />
              <Row k="titular" label="Titular" value={PAGO_MOVIL.holder} />
            </dl>
            <button type="button" className="eal-copy-all" onClick={() => copy('pm-all', pagoMovilAll)}>
              {copied === 'pm-all' ? 'Datos copiados ✓' : 'Copiar todos los datos'}
            </button>
          </div>
        </div>
      ) : (
        <div className="eal-paypanel" role="tabpanel" id="pay-binance">
          <div className="eal-qr">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/endurance/qr-binance.webp" alt="Código QR de Binance Pay" width={440} height={513} />
          </div>
          <div className="eal-paydata">
            <div className="eal-amount">
              <span>Monto a pagar</span>
              <strong>{PRICE_USD} USDT</strong>
              <small>Escanea el QR desde la app de Binance o envía a este correo por Binance Pay.</small>
            </div>
            <dl>
              <Row k="correo" label="Correo Binance Pay" value={BINANCE.email} />
              <Row k="bn-titular" label="Titular" value={BINANCE.holder} />
            </dl>
            <button type="button" className="eal-copy-all" onClick={() => copy('bn-all', binanceAll)}>
              {copied === 'bn-all' ? 'Datos copiados ✓' : 'Copiar todos los datos'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
