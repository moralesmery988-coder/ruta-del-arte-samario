import React, { useRef } from 'react';

type MediaItem = { url: string; type: 'image' | 'video' };

export default function MultiMediaUploader({ value, onChange }: any) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const readers: Promise<MediaItem>[] = Array.from(files).map(
      (file) =>
        new Promise((res) => {
          const reader = new FileReader();
          reader.onload = () => {
            const url = String(reader.result);
            const isVideo = file.type.startsWith('video');
            res({ url, type: isVideo ? 'video' : 'image' });
          };
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((items) => {
      onChange([...(value || []), ...items]);
    });
  }

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="mb-2"
      />

      <div className="grid grid-cols-3 gap-2">
        {(value || []).map((m: MediaItem, idx: number) => (
          <div key={idx} className="border rounded p-1">
            {m.type === 'image' ? (
              <img src={m.url} alt={`media-${idx}`} className="h-28 w-full object-cover" />
            ) : (
              <video src={m.url} className="h-28 w-full object-cover" controls />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
