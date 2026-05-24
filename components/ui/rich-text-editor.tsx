"use client";

import React, { useEffect, useRef, useMemo, useCallback } from "react";
import "quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";
import { uploadService } from "@/lib/services/upload-service";

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  height?: number;
  error?: boolean;
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Enter content...",
  disabled = false,
  className,
  height = 400,
  error = false,
}: RichTextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const isInternalChange = useRef(false);
  const onChangeRef = useRef(onChange);

  // Keep onChange ref updated to avoid stale closures in Quill events
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const uploadEditorImage = async (file: File): Promise<string> => {
    const response = await uploadService.uploadFile(file, "editor", "image");
    const rawUrl = response.data.url;

    if (rawUrl.startsWith("/")) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL|| "";
      const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
      return `${cleanBaseUrl}${rawUrl}`;
    }
    return rawUrl;
  };

  const imageHandler = useCallback(async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file && quillRef.current) {
        const range = quillRef.current.getSelection();
        try {
          const url = await uploadEditorImage(file);
          quillRef.current.insertEmbed(range?.index || 0, "image", url);
        } catch (error) {
          console.error("Image upload failed", error);
        }
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, false] }],
          ["bold", "italic", "underline", "strike", "blockquote", "code-block", "code", "script", "formula"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [imageHandler]
  );

  const formats = [
    "header", "bold", "italic", "underline", "strike", "blockquote",
    "list", "bullet", "indent", "link", "image", "video", "align",
  ];

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || quillRef.current) return;

    const initQuill = async () => {
      try {
        const { default: Quill } = await import("quill");
        
        if (!containerRef.current || quillRef.current) return;

        const quill = new Quill(containerRef.current, {
          theme: "snow",
          placeholder,
          modules,
          formats,
          readOnly: disabled,
        });

        quillRef.current = quill;

        if (value) {
          isInternalChange.current = true;
          quill.root.innerHTML = value;
          isInternalChange.current = false;
        }

        quill.on("text-change", () => {
          if (!isInternalChange.current) {
            const html = quill.root.innerHTML;
            onChangeRef.current?.(html === "<p><br></p>" ? "" : html);
          }
        });
      } catch (error) {
        console.error("Quill initialization failed:", error);
      }
    };

    initQuill();

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []); // Initialize once

  // Sync value from props to editor
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML && !isInternalChange.current) {
      isInternalChange.current = true;
      quillRef.current.root.innerHTML = value || "";
      isInternalChange.current = false;
    }
  }, [value]);

  // Sync disabled state
  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!disabled);
    }
  }, [disabled]);

  return (
    <div
      className={cn(
        "rounded-md border border-input rich-text-wrapper bg-white dark:bg-slate-950",
        error && "border-destructive ring-destructive/20",
        className
      )}
      style={{ minHeight: height }}
    >
      <style jsx global>{`
        .rich-text-wrapper .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid hsl(var(--input));
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
        }
        .rich-text-wrapper .ql-container.ql-snow {
          border: none;
          font-family: inherit;
          font-size: 0.875rem;
          min-height: ${height - 42}px;
        }
        .dark .rich-text-wrapper .ql-snow .ql-stroke { stroke: #94a3b8; }
        .dark .rich-text-wrapper .ql-snow .ql-fill { fill: #94a3b8; }
        .dark .rich-text-wrapper .ql-snow .ql-picker { color: #94a3b8; }
        .dark .rich-text-wrapper .ql-snow .ql-picker-options {
          background-color: #020617;
          border-color: #1e293b;
        }
      `}</style>
      <div ref={containerRef} />
    </div>
  );
}
