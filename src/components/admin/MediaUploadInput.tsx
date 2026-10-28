'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, Check, X } from 'lucide-react';
import Image from 'next/image';

interface MediaUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export default function MediaUploadInput({
  value,
  onChange,
  label = 'Image / Mockup',
  placeholder = 'https://... or upload below',
}: MediaUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-white/60">{label}</label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] text-red-400/80 hover:text-red-300 flex items-center gap-1"
          >
            <X size={11} /> Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
        />

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-white/80 hover:text-white border border-white/10 transition-colors disabled:opacity-50 shrink-0"
        >
          {uploading ? (
            <>
              <Loader2 size={13} className="animate-spin text-[#3b82d4]" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud size={13} className="text-[#3b82d4]" />
              <span>Upload CDN</span>
            </>
          )}
        </button>
      </div>

      {error && <p className="text-[11px] text-red-400">{error}</p>}

      {value && (
        <div className="mt-2 relative w-full h-28 rounded-lg overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center">
          {value.startsWith('http') || value.startsWith('/') ? (
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-contain p-1"
              unoptimized
            />
          ) : (
            <div className="flex items-center gap-2 text-white/30 text-xs">
              <ImageIcon size={16} />
              <span>{value}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
