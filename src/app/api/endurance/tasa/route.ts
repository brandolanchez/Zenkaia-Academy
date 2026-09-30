import { NextResponse } from 'next/server';

// Tasa oficial del BCV (Banco Central de Venezuela) para calcular el monto en bolívares.
// Fuente principal: ve.dolarapi.com (publica la tasa oficial BCV). Respaldo: pydolarve.org.
// Se refresca cada 30 minutos.
const REVALIDATE = 1800;

type Rate = { usd: number; eur: number | null; date: string | null; source: string };

async function fromDolarApi(): Promise<Rate | null> {
  const [usdRes, eurRes] = await Promise.all([
    fetch('https://ve.dolarapi.com/v1/dolares/oficial', { next: { revalidate: REVALIDATE } }),
    fetch('https://ve.dolarapi.com/v1/euros/oficial', { next: { revalidate: REVALIDATE } }),
  ]);
  if (!usdRes.ok) return null;
  const usd = await usdRes.json();
  const eur = eurRes.ok ? await eurRes.json() : null;
  if (typeof usd?.promedio !== 'number' || usd.promedio <= 0) return null;
  return {
    usd: usd.promedio,
    eur: typeof eur?.promedio === 'number' ? eur.promedio : null,
    date: usd.fechaActualizacion ?? null,
    source: 'BCV',
  };
}

async function fromPyDolar(): Promise<Rate | null> {
  const res = await fetch('https://pydolarve.org/api/v2/dollar?page=bcv', { next: { revalidate: REVALIDATE } });
  if (!res.ok) return null;
  const data = await res.json();
  const usd = data?.monitors?.usd?.price;
  const eur = data?.monitors?.eur?.price;
  if (typeof usd !== 'number' || usd <= 0) return null;
  return { usd, eur: typeof eur === 'number' ? eur : null, date: data?.monitors?.usd?.last_update ?? null, source: 'BCV' };
}

export async function GET() {
  let rate: Rate | null = null;
  for (const source of [fromDolarApi, fromPyDolar]) {
    try {
      rate = await source();
      if (rate) break;
    } catch {
      /* probamos la siguiente fuente */
    }
  }

  if (!rate) {
    return NextResponse.json({ error: 'No se pudo consultar la tasa BCV.' }, { status: 503 });
  }

  return NextResponse.json(rate, {
    headers: { 'Cache-Control': `public, s-maxage=${REVALIDATE}, stale-while-revalidate=${REVALIDATE}` },
  });
}
