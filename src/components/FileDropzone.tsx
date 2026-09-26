"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  FileCode,
  FileSpreadsheet,
} from "lucide-react";

interface FileDropzoneProps {
  onTextExtracted: (text: string, filename: string) => void;
  disabled?: boolean;
  compact?: boolean;
}

export default function FileDropzone({
  onTextExtracted,
  disabled = false,
  compact = false,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadedFileInfo, setLoadedFileInfo] = useState<{
    name: string;
    sizeKb: number;
    wordCount: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setErrorMessage(null);

    // 10 MB limit
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File exceeds 10 MB limit. Please select a smaller contract file.");
      return;
    }

    const filename = file.name;
    const extension = filename.split(".").pop()?.toLowerCase();

    if (!["pdf", "docx", "txt", "md", "rtf"].includes(extension || "")) {
      setErrorMessage(
        "Unsupported file type. Please upload a PDF (.pdf), Word Document (.docx), or Text file (.txt, .md)."
      );
      return;
    }

    setIsLoading(true);

    try {
      let extractedText = "";

      // Fast-path client extraction for plain text files
      if (extension === "txt" || extension === "md" || extension === "rtf") {
        extractedText = await file.text();
      } else {
        // Send PDF / DOCX to /api/extract
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/extract", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to extract text from document.");
        }
        extractedText = data.text;
      }

      const words = extractedText.trim().split(/\s+/).filter(Boolean).length;
      setLoadedFileInfo({
        name: filename,
        sizeKb: Math.round(file.size / 1024),
        wordCount: words,
      });

      onTextExtracted(extractedText, filename);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error extracting text from file.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isLoading) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setLoadedFileInfo(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt,.md,.rtf"
        onChange={handleFileChange}
        disabled={disabled || isLoading}
        className="hidden"
        id="contract-file-upload-input"
        aria-label="Upload legal contract file"
      />

      {/* Upload Dropzone Box */}
      {!loadedFileInfo ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && !isLoading && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`border-2 border-dashed rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center text-center outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            compact ? "p-4 min-h-[140px]" : "p-6 sm:p-8 min-h-[190px]"
          } ${
            isDragging
              ? "border-blue-500 bg-blue-950/40 scale-[0.99]"
              : "border-gray-700/80 bg-gray-950/60 hover:border-blue-600/70 hover:bg-gray-950"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <div className="flex flex-col items-center space-y-3 text-blue-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <div className="text-xs font-semibold text-gray-200">
                Extracting legal text &amp; formatting clauses...
              </div>
              <p className="text-[11px] text-gray-400">
                Running in-memory extraction pipeline
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/60 border border-blue-800/60 flex items-center justify-center text-blue-400 shadow-md">
                <UploadCloud className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-white flex items-center justify-center space-x-1">
                  <span>Drop your contract here, or</span>
                  <span className="text-blue-400 underline decoration-blue-500/50 hover:text-blue-300 ml-1">
                    browse files
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Supports <strong>PDF (.pdf)</strong>, <strong>Word (.docx)</strong>, and <strong>Text (.txt, .md)</strong> up to 10 MB.
                </p>
              </div>

              {/* Supported Format Badges */}
              <div className="flex items-center space-x-2 pt-1">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-rose-950/60 text-rose-300 border border-rose-800/60">
                  PDF
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-blue-950/60 text-blue-300 border border-blue-800/60">
                  DOCX
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                  TXT
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Loaded File Confirmation Pill */
        <div className="bg-gray-950 border border-emerald-800/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                  {loadedFileInfo.name}
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-mono font-semibold">
                  Extracted
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {loadedFileInfo.sizeKb} KB • <strong>{loadedFileInfo.wordCount} words</strong> ready for in-browser PII shielding and audit.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs text-gray-300 hover:text-white bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
            >
              Replace File
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-gray-400 hover:text-rose-300 bg-gray-900 border border-gray-800 rounded-lg hover:border-rose-900 transition-colors"
              title="Remove document"
              aria-label="Remove uploaded document"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error Feedback */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-start space-x-2"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">{errorMessage}</div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-rose-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
