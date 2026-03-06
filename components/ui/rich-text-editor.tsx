"use client";

import React from "react";
import { Editor } from "@tinymce/tinymce-react";
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
  const envTinyMceApiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY?.trim();
  const tinyMceApiKey =
    envTinyMceApiKey &&
    envTinyMceApiKey !== "YOUR_TINYMCE_API_KEY" &&
    envTinyMceApiKey !== "YOUR_API_KEY"
      ? envTinyMceApiKey
      : "no-api-key";

  const uploadEditorImage = async (file: File): Promise<string> => {
    const response = await uploadService.uploadFile(file, "editor", "image");
    return response.data.url;
  };

  const handleTinyMceImageUpload = async (
    blobInfo: { blob: () => Blob; filename: () => string },
  ): Promise<string> => {
    const file = new File([blobInfo.blob()], blobInfo.filename(), {
      type: blobInfo.blob().type || "image/png",
    });
    return uploadEditorImage(file);
  };

  const handleTinyMceFilePicker = (
    callback: (url: string, meta?: { title?: string }) => void,
  ): void => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        return;
      }

      try {
        const imageUrl = await uploadEditorImage(file);
        callback(imageUrl, { title: file.name });
      } catch {
        callback("");
      }
    };

    input.click();
  };

  // Detect if dark mode is active (client-side)
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
        apiKey={tinyMceApiKey}
        value={value}
        onEditorChange={(content) => {
          if (onChange) onChange(content);
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
            "media",
            "table",
            "paste",
            "code",
            "help",
            "quickbars",
            "wordcount",
          ],
          toolbar:
            "undo redo | formatselect | " +
            "bold italic underline | alignleft aligncenter alignright | " +
            "bullist numlist outdent indent | link image media | removeformat | code",
          /* Ensure Enter creates paragraphs */
          forced_root_block: "p",
          force_p_newlines: true,
          force_br_newlines: false,
          paste_as_text: false,
          paste_data_images: true,
          list_indent_on_tab: true,
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
              font-size: 14px;
              padding: 8px;
            }
            p { margin-bottom: 1rem; line-height: 1.6; }
            ul, ol { margin-top: 0.5rem; margin-bottom: 0.5rem; padding-left: 1.25rem; }
          `,
          skin: isDarkMode ? "oxide-dark" : "oxide",
          content_css: isDarkMode ? "dark" : "default",
          placeholder,
          branding: false,
          promotion: false,
          automatic_uploads: true,
          file_picker_types: "image",
          images_upload_handler: async (
            blobInfo: any,
            success: (url: string) => void,
            failure: (msg: string) => void,
          ) => {
            try {
              const url = await handleTinyMceImageUpload(blobInfo);
              success(url);
            } catch (e) {
              failure("Image upload failed");
            }
          },
          file_picker_callback: (
            callback: (url: string, meta?: { title?: string }) => void,
          ) => {
            handleTinyMceFilePicker(callback);
          },
          /* Ensure editor starts with a paragraph for predictable Enter behaviour */
          setup: (editor: any) => {
            editor.on("init", () => {
              if (!editor.getContent({ format: "raw" })) {
                editor.setContent("<p></p>");
              }
            });
          },
        }}
      />
    </div>
  );
}
