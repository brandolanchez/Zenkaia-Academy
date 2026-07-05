import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { createCourse, deleteCourse } from './actions';
import { Plus, Trash2, Edit, ImageIcon } from 'lucide-react';

export default async function AdminCoursesPage() {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from('courses')
    .select('*, videos(count)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Gestión de Rutas Zenkai</h1>
      </div>

      <div className="responsive-grid-1-2">
        {/* Formulario para Crear Ruta */}
        <div className="card">
          <h2 className="card-title">Crear Nueva Ruta</h2>
          <form action={createCourse}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">Nombre de la Ruta</label>
              <input type="text" id="title" name="title" className="form-input" required placeholder="Ej. Ruta de Empuje Inicial" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="description">Descripción</label>
              <textarea id="description" name="description" className="form-input" rows={3} placeholder="Breve descripción de la ruta..."></textarea>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="thumbnail">Miniatura de la Ruta</label>
              <input 
                type="file" 
                id="thumbnail" 
                name="thumbnail" 
                accept="image/*"
                className="form-input" 
                style={{ padding: '0.5rem' }}
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>JPG, PNG o WebP. Recomendado: 800×450px</p>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <Plus size={18} /> Crear Ruta
            </button>
          </form>
        </div>

        {/* Lista de Rutas con Tarjetas */}
        <div className="card">
          <h2 className="card-title">Rutas Creadas</h2>
          
          {error && <div className="error-message">Error: {error.message}</div>}
          
          {!courses || courses.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Aún no hay rutas creadas.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {courses.map((course: any) => (
                <div key={course.id} style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', transition: 'transform 0.2s, border-color 0.2s' }} className="route-card">
                  
                  {/* Miniatura con título superpuesto */}
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#111' }}>
                    {course.thumbnail_url ? (
                      <Image 
                        src={course.thumbnail_url} 
                        alt={course.title} 
                        fill 
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.15)' }}>
                        <ImageIcon size={48} />
                      </div>
                    )}
                    {/* Overlay con el nombre */}
                    <div style={{ 
                      position: 'absolute', 
                      bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                      padding: '2rem 1rem 1rem'
                    }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{course.title}</h3>
                    </div>
                  </div>

                  {/* Info y acciones */}
                  <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {course.videos[0].count} videos
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link href={`/admin/courses/${course.id}`} className="btn btn-outline" style={{ padding: '0.4rem' }} title="Gestionar videos">
                        <Edit size={16} />
                      </Link>
                      <form action={async () => {
                        'use server';
                        await deleteCourse(course.id);
                      }}>
                        <button type="submit" className="btn btn-outline" style={{ padding: '0.4rem', borderColor: '#ff3366', color: '#ff3366' }} title="Eliminar ruta">
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .route-card:hover {
          transform: translateY(-2px);
          border-color: var(--accent-color) !important;
        }
      `}</style>
    </div>
  );
}
