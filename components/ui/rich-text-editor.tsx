"use client";

import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { cn } from "@/lib/utils";

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
  const editorRef = useRef<any>(null);

  // Detect if dark mode is active
  const isDarkMode =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  return (
    <div
      className={cn(
        "rounded-md border border-input",
        error && "border-destructive ring-destructive/20",
        className,
      )}
    >
      <Editor
        apiKey="kq54asy1zm0lhnt1x2zsqhel46zq48awgwxzw51xfjx1unf9"
        onInit={(_evt, editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={(content) => {
          if (onChange) {
            onChange(content);
          }
        }}
        disabled={disabled}
        init={{
          height,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | link image | code | help",
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
              font-size: 14px;
              padding: 10px;
            }
          `,
          skin: isDarkMode ? "oxide-dark" : "oxide",
          content_css: isDarkMode ? "dark" : "default",
          placeholder,
          branding: false,
          promotion: false,
        }}
      />
    </div>
  );
}
