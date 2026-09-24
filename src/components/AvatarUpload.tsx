'use client';

import { useState, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Image from 'next/image';
import { Camera, Loader2 } from 'lucide-react';

interface AvatarUploadProps {
  userId: string;
  avatarUrl: string | null;
}

export default function AvatarUpload({ userId, avatarUrl }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(avatarUrl);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen.');
      }

      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La imagen pesa más de 5 MB. Elige una más liviana.');
      }
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      window.location.reload();
    } catch (error: any) {
      setError(error.message || 'No se pudo subir la imagen. Intenta de nuevo.');
      // Revert preview on error
      setPreview(avatarUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="avatar-upload-container">
      <button
        type="button"
        className="avatar-wrapper"
        onClick={() => !uploading && fileInputRef.current?.click()}
        aria-label="Cambiar foto de perfil"
        disabled={uploading}
      >
        {preview ? (
          <Image 
            src={preview} 
            alt="Avatar" 
            width={100} 
            height={100} 
            className="avatar-image"
            unoptimized
          />
        ) : (
          <div className="avatar-placeholder">
            <Camera size={32} />
          </div>
        )}
        
        <div className="avatar-overlay">
          {uploading ? <Loader2 className="spin" size={24} /> : <Camera size={24} />}
        </div>
      </button>

      <button
        type="button"
        className="avatar-change-link"
        onClick={() => !uploading && fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'Subiendo…' : preview ? 'Cambiar foto' : 'Agregar foto'}
      </button>
      {error && <p className="avatar-error" role="alert">{error}</p>}
      
      <input
        style={{ display: 'none' }}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        ref={fileInputRef}
        disabled={uploading}
      />
      
      <style jsx>{`
        .avatar-upload-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .avatar-change-link {
          background: none;
          border: none;
          color: var(--text-secondary);
          font: inherit;
          font-size: 0.85rem;
          text-decoration: underline;
          text-underline-offset: 3px;
          cursor: pointer;
        }
        .avatar-change-link:hover {
          color: var(--accent-color);
        }
        .avatar-error {
          color: #ff3366;
          font-size: 0.85rem;
          max-width: 240px;
          text-align: center;
        }
        .avatar-wrapper {
          padding: 0;
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid var(--border-color);
          background: var(--bg-tertiary);
          transition: all 0.2s ease;
        }
        .avatar-wrapper:hover {
          border-color: var(--accent-color);
        }
        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }
        .avatar-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
          color: white;
        }
        .avatar-wrapper:hover .avatar-overlay {
          opacity: 1;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
