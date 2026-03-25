"use client";

import React, { useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";
import { uploadService } from "@/lib/services/upload-service";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    );
    Component.displayName = "ReactQuill";
    return Component;
  },
  { ssr: false },
);

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillRef = useRef<any>(null);

  const uploadEditorImage = async (file: File): Promise<string> => {
    const response = await uploadService.uploadFile(file, "editor", "image");
    const rawUrl = response.data.url;

    // If the server returns a relative path, prepend the backend API URL
    if (rawUrl.startsWith("/")) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      // Strip any trailing slashes from baseUrl for clean concatenation
      const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
      return `${cleanBaseUrl}${rawUrl}`;
    }

    return rawUrl;
  };

  const imageHandler = React.useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection();
          try {
            const url = await uploadEditorImage(file);
            quill.insertEmbed(range?.index || 0, "image", url);
          } catch (error) {
            console.error("Image upload failed", error);
          }
        }
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
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
    [imageHandler],
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "align",
  ];

  return (
    <div
      className={cn(
        "rounded-md border border-input rich-text-wrapper bg-white dark:bg-slate-950",
        error && "border-destructive ring-destructive/20",
        className,
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
        .dark .rich-text-wrapper .ql-snow .ql-stroke {
          stroke: #94a3b8;
        }
        .dark .rich-text-wrapper .ql-snow .ql-fill {
          fill: #94a3b8;
        }
        .dark .rich-text-wrapper .ql-snow .ql-picker {
          color: #94a3b8;
        }
        .dark .rich-text-wrapper .ql-snow .ql-picker-options {
          background-color: #020617;
          border-color: #1e293b;
        }
      `}</style>
      <ReactQuill
        forwardedRef={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
      />
    </div>
  );
}
