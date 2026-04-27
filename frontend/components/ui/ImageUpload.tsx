"use client";
import { useRef, useState } from "react";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/formatters";
import { Spinner } from "./Spinner";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ value = [], onChange, maxImages = 5 }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    try {
      const uploads = Array.from(files).slice(0, maxImages - value.length);
      const urls: string[] = [];
      for (const file of uploads) {
        const form = new FormData();
        form.append("file", file);
        const { data } = await api.post("/upload", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        urls.push(data.url);
      }
      onChange([...value, ...urls]);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      alert(msg || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const remove = (url: string) => onChange(value.filter((u) => u !== url));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {value.map((url) => (
          <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getImageUrl(url)} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xl"
            >
              ✕
            </button>
          </div>
        ))}
        {value.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary flex flex-col items-center justify-center text-gray-400 hover:text-primary transition"
          >
            {uploading ? <Spinner className="h-5 w-5" /> : (
              <>
                <span className="text-2xl">+</span>
                <span className="text-xs">Upload</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-xs text-gray-500">JPG, PNG, WEBP · Max 5MB each · Up to {maxImages} images</p>
    </div>
  );
}
