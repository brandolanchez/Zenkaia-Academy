'use client';

import { useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────
// CIRCUITOS DE COMPETENCIA 2026 — edita aquí bloques, repeticiones y lastre.
// Cada ronda es por tiempo: avanza (o gana) el mejor tiempo.
// `load` es el lastre del bloque; déjalo vacío si no lleva peso.
// ─────────────────────────────────────────────────────────────
type Block = { work: string; load?: string };
type Round = { name: string; athletes?: string; note?: string; blocks: Block[] };
type Category = { id: string; name: string; rounds: Round[] };

const CATEGORIES: Category[] = [
  {
    id: 'elite',
    name: 'Élite',
    rounds: [
      {
        name: 'Clasificatoria',
        athletes: 'Todos los inscritos',
        blocks: [
          { work: '10 pull ups + 1 muscle up + 20 bar dips + 2 muscle ups' },
          { work: '30 push ups' },
          { work: '3 muscle ups' },
          { work: '40 squats', load: '10 kg' },
          { work: '4 muscle ups' },
          { work: '40 push ups' },
          { work: '5 muscle ups' },
        ],
      },
      {
        name: 'Segunda ronda',
        athletes: '10 atletas',
        blocks: [
          { work: '50 push ups + 25 pull ups + 20 squats' },
          { work: '40 push ups + 20 pull ups + 20 squats' },
          { work: '30 dips + 15 pull ups + 20 squats' },
          { work: '20 dips + 10 pull ups + 20 squats' },
          { work: '10 push ups + 5 muscle ups + 20 squats' },
          { work: '(3 muscle ups + 10 bar dips + 5 pull ups) ×2' },
        ],
      },
      {
        name: 'Final',
        athletes: '3 atletas',
        note: 'El mejor tiempo es campeón.',
        blocks: [
          { work: '(1 pull up + 1 muscle up + 1 bar dip) ×3', load: '10 kg' },
          { work: '30 squats', load: '15 kg' },
          { work: '20 push ups' },
          { work: '10 burpees' },
          { work: '(1 muscle up + 1 bar dip + 1 pull up) ×4', load: '5 kg' },
          { work: '40 squats', load: '15 kg' },
          { work: '20 dips', load: '10 kg' },
          { work: '10 burpees' },
          { work: '(1 muscle up + 1 bar dip + 1 pull up) ×5' },
          { work: '50 squats' },
          { work: '30 push ups' },
          { work: '10 burpees' },
          { work: '10 muscle ups' },
        ],
      },
    ],
  },
  {
    id: 'junior',
    name: 'Alfa Junior',
    rounds: [
      {
        name: 'Clasificatoria',
        athletes: 'Todos los inscritos',
        blocks: [
          { work: '25 push ups + 20 pull ups + 20 squats' },
          { work: '20 push ups + 15 pull ups + 20 squats' },
          { work: '20 dips + 10 chin ups + 20 squats' },
          { work: '15 dips + 10 pull ups + 20 squats' },
          { work: '10 push ups + 10 burpees + 20 squats' },
          { work: '10 dips + 30 s de chin over the bar + 10 dips' },
        ],
      },
      {
        name: 'Final',
        athletes: '3 atletas',
        note: 'El mejor tiempo es Atleta Revelación.',
        blocks: [
          { work: '10 burpees' },
          { work: '5 dips + 20 leg raises' },
          { work: '30 push ups' },
          { work: '8 pull ups + 20 squats + 8 pull ups' },
          { work: '10 dips + 15 leg raises' },
          { work: '20 push ups' },
          { work: '6 pull ups + 20 squats + 6 pull ups' },
          { work: '15 dips + 10 leg raises' },
          { work: '10 push ups' },
          { work: '4 pull ups + 20 squats + 4 pull ups' },
          { work: '20 dips' },
        ],
      },
    ],
  },
];

function RoundTable({ round }: { round: Round }) {
  const hasLoad = round.blocks.some(b => b.load);
  return (
    <div className="eal-round">
      <div className="eal-round-head">
        <h4 className="eal-display">{round.name}</h4>
        {round.athletes && <span className="eal-round-count">{round.athletes}</span>}
        {round.note && <span className="eal-round-note">{round.note}</span>}
      </div>
      <div className="eal-table-wrap">
        <table className="eal-table">
          <caption className="eal-sr">{round.name}: {round.blocks.length} bloques en este orden</caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Bloque</th>
              {hasLoad && <th scope="col">Lastre</th>}
            </tr>
          </thead>
          <tbody>
            {round.blocks.map((b, i) => (
              <tr key={i}>
                <td className="eal-table-num">{String(i + 1).padStart(2, '0')}</td>
                <td>{b.work}</td>
                {hasLoad && <td className={b.load ? 'eal-table-load' : 'eal-table-empty'}>{b.load || '—'}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CompetitionFormat() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + CATEGORIES.length) % CATEGORIES.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="eal-format">
      <div className="eal-tabs" role="tablist" aria-label="Categoría" onKeyDown={onKey}>
        {CATEGORIES.map((c, i) => (
          <button
            key={c.id}
            ref={el => { tabs.current[i] = el; }}
            type="button"
            role="tab"
            id={`tab-${c.id}`}
            aria-selected={active === i}
            aria-controls={`panel-${c.id}`}
            tabIndex={active === i ? 0 : -1}
            className="eal-tab"
            onClick={() => setActive(i)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {CATEGORIES.map((c, i) => (
        <div
          key={c.id}
          role="tabpanel"
          id={`panel-${c.id}`}
          aria-labelledby={`tab-${c.id}`}
          hidden={active !== i}
          className="eal-rounds"
        >
          {c.rounds.map(r => <RoundTable key={r.name} round={r} />)}
        </div>
      ))}
    </div>
  );
}
