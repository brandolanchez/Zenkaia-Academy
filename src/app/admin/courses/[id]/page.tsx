import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { addVideo, deleteVideo, updateVideo } from './actions';
import { updateCourse } from '../actions';
import { ArrowLeft, PlayCircle, Trash2, Plus, Edit, Save, X } from 'lucide-react';

export default async function AdminCourseDetailsPage({ 
  params,
  searchParams
}: { 
  params: { id: string },
  searchParams: { editVideoId?: string }
}) {
  const supabase = await createClient();

  // Obtener detalles del curso y sus videos
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', params.id)
    .single();

  const { data: videos, error: videosError } = await supabase
    .from('videos')
    .select('*')
    .eq('course_id', params.id)
    .order('order', { ascending: true });

  if (courseError || !course) {
    return <div>Error cargando el curso: {courseError?.message || 'No encontrado'}</div>;
  }

  // Si estamos editando un video en particular
  const videoToEdit = searchParams.editVideoId 
    ? videos?.find(v => v.id === searchParams.editVideoId) 
    : null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/courses" className="btn btn-outline" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={18} />
        </Link>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Gestionar Ruta: {course.title}</h1>
      </div>

      <div className="responsive-grid-1-2">
        
        {/* COLUMNA IZQUIERDA: Formularios de Edición */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* 1. Formulario para Editar la Ruta */}
          <div className="card" style={{ borderTop: '4px solid var(--accent-color)' }}>
            <h2 className="card-title">Detalles de la Ruta</h2>
            <form action={updateCourse}>
              <input type="hidden" name="id" value={course.id} />
              
              <div className="form-group">
                <label className="form-label" htmlFor="title">Nombre de la Ruta</label>
                <input type="text" id="title" name="title" className="form-input" required defaultValue={course.title} />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="description">Descripción</label>
                <textarea id="description" name="description" className="form-input" rows={3} defaultValue={course.description || ''}></textarea>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="thumbnail">Cambiar Miniatura</label>
                {course.thumbnail_url && (
                  <div style={{ marginBottom: '0.5rem', width: '100%', height: '80px', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                    <Image src={course.thumbnail_url} alt="Current thumbnail" fill style={{ objectFit: 'cover' }} unoptimized />
                  </div>
                )}
                <input type="file" id="thumbnail" name="thumbnail" accept="image/*" className="form-input" style={{ padding: '0.5rem' }} />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Deja vacío para mantener la miniatura actual.</p>
              </div>

              <button type="submit" className="btn btn-outline" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <Save size={18} /> Guardar Cambios de la Ruta
              </button>
            </form>
          </div>

          {/* 2. Formulario para Añadir/Editar Video */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="card-title" style={{ margin: 0 }}>
                {videoToEdit ? 'Editar Video' : 'Añadir Nuevo Video'}
              </h2>
              {videoToEdit && (
                <Link href={`/admin/courses/${course.id}`} className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <X size={14} /> Cancelar
                </Link>
              )}
            </div>
            
            <form action={videoToEdit ? updateVideo : addVideo}>
              <input type="hidden" name="course_id" value={course.id} />
              {videoToEdit && <input type="hidden" name="id" value={videoToEdit.id} />}
              
              <div className="form-group">
                <label className="form-label" htmlFor="video_title">Título del Video</label>
                <input type="text" id="video_title" name="title" className="form-input" required defaultValue={videoToEdit?.title || ''} placeholder="Ej. 1. Bienvenida" />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="video_url">URL del Video (YouTube, Vimeo, MP4)</label>
                <input type="url" id="video_url" name="video_url" className="form-input" required defaultValue={videoToEdit?.video_url || ''} placeholder="https://..." />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="video_description">Descripción de la Clase</label>
                <textarea id="video_description" name="description" className="form-input" rows={3} defaultValue={videoToEdit?.description || ''} placeholder="De qué trata esta lección..."></textarea>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="order">Orden</label>
                  <input type="number" id="order" name="order" className="form-input" required defaultValue={videoToEdit?.order || (videos?.length || 0) + 1} min="1" />
                </div>
                
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '1.5rem' }}>
                    <input type="checkbox" name="is_free" style={{ width: '18px', height: '18px' }} defaultChecked={videoToEdit?.is_free} />
                    <span>¿Es Gratis / Intro?</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                {videoToEdit ? <><Save size={18} /> Guardar Video</> : <><Plus size={18} /> Añadir Video</>}
              </button>
            </form>
          </div>
        </div>

        {/* COLUMNA DERECHA: Lista de Videos */}
        <div className="card">
          <h2 className="card-title">Contenido de la Ruta</h2>
          
          {videosError && <div className="error-message">Error: {videosError.message}</div>}
          
          {!videos || videos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <PlayCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
              <p>No hay videos en esta ruta. Añade el primero.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {videos.map((video: any) => (
                <div key={video.id} style={{ 
                  border: videoToEdit?.id === video.id ? '1px solid var(--accent-color)' : '1px solid var(--border-color)', 
                  borderRadius: '8px', 
                  padding: '1rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  background: videoToEdit?.id === video.id ? 'rgba(255,0,60,0.05)' : 'rgba(255,255,255,0.02)' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'var(--bg-tertiary)', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontWeight: 'bold' }}>
                      {video.order}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {video.title} 
                        {video.is_free && <span style={{ fontSize: '0.7rem', background: 'rgba(0,255,100,0.1)', color: '#00ff66', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase' }}>Gratis</span>}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {video.video_url.substring(0, 50)}...
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/admin/courses/${course.id}?editVideoId=${video.id}`} className="btn btn-outline" style={{ padding: '0.5rem' }} title="Editar video">
                      <Edit size={18} />
                    </Link>
                    <form action={async () => {
                      'use server';
                      await deleteVideo(video.id, course.id);
                    }}>
                      <button type="submit" className="btn btn-outline" style={{ padding: '0.5rem', borderColor: '#ff3366', color: '#ff3366' }} title="Eliminar video">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
