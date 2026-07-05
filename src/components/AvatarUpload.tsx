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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen.');
      }

      const file = event.target.files[0];
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
      alert(error.message || 'Error al subir la imagen');
      // Revert preview on error
      setPreview(avatarUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="avatar-upload-container">
      <div 
        className="avatar-wrapper"
        onClick={() => !uploading && fileInputRef.current?.click()}
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
      </div>
      
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
          justify-content: center;
          margin-bottom: 2rem;
        }
        .avatar-wrapper {
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
