import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import CampaignEditor from './CampaignEditor';

export const dynamic = 'force-dynamic';

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: campaign } = await supabase.from('email_campaigns').select('*').eq('id', id).maybeSingle();
  if (!campaign) notFound();

  // Conteo por etiqueta (Supabase entrega máx. 1000 filas por consulta: paginamos)
  const tagCounts: Record<string, number> = {};
  let total = 0;
  for (let from = 0; ; from += 1000) {
    const { data } = await supabase.from('email_contacts').select('tags').eq('status', 'subscribed').range(from, from + 999);
    (data || []).forEach(r => { total++; (r.tags || []).forEach((t: string) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }); });
    if (!data || data.length < 1000) break;
  }

  const { data: others } = await supabase.from('email_campaigns').select('id, name').neq('id', id).order('sort_order').order('created_at');

  const { count: sent } = await supabase.from('email_sends').select('id', { count: 'exact', head: true }).eq('campaign_id', id).eq('status', 'sent');
  const { count: failed } = await supabase.from('email_sends').select('id', { count: 'exact', head: true }).eq('campaign_id', id).eq('status', 'failed');

  return (
    <div className="mail-stack">
      <Link href="/admin/correos/campanas" className="mail-link">← Volver a campañas</Link>
      <CampaignEditor
        campaign={campaign}
        audiences={[{ tag: '', label: 'Todos los suscritos', count: total }, ...Object.entries(tagCounts).sort().map(([tag, count]) => ({ tag, label: tag, count }))]}
        sentCount={sent ?? 0}
        failedCount={failed ?? 0}
        otherCampaigns={others || []}
      />
    </div>
  );
}
