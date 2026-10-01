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

  const { data: tagRows } = await supabase.from('email_contacts').select('tags').eq('status', 'subscribed').limit(5000);
  const tagCounts: Record<string, number> = {};
  let total = 0;
  (tagRows || []).forEach(r => { total++; (r.tags || []).forEach((t: string) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }); });

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
      />
    </div>
  );
}
