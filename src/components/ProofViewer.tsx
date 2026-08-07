'use client';

import { useState } from 'react';
import { X, ExternalLink, FileText } from 'lucide-react';

interface ProofViewerProps {
  proofUrl: string;
  label?: string;
}

export default function ProofViewer({ proofUrl, label = 'Ver Comprobante' }: ProofViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isPdf = proofUrl.toLowerCase().endsWith('.pdf');

  if (isPdf) {
    return (
      <a
        href={proofUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="proof-viewer-trigger"
      >
        <FileText size={16} />
        {label} (PDF)
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="proof-viewer-trigger"
      >
        <FileText size={16} />
        {label}
      </button>

      {isOpen && (
        <div className="proof-lightbox-overlay" onClick={() => setIsOpen(false)}>
          <div className="proof-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="proof-lightbox-header">
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Comprobante de Pago</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a
                  href={proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proof-lightbox-btn"
                  title="Abrir en nueva pestaña"
                >
                  <ExternalLink size={18} />
                </a>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="proof-lightbox-btn"
                  title="Cerrar"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="proof-lightbox-body">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proofUrl}
                alt="Comprobante de pago"
                className="proof-lightbox-image"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
