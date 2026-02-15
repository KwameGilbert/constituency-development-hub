"use client";

import React from "react";
import { sanitizeHtml } from "@/lib/utils";

type SanitizedHtmlProps = {
  html?: string | null;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
};

export default function SanitizedHtml({
  html = "",
  className = "",
  tag = "div",
}: SanitizedHtmlProps) {
  try {
    const sanitized = sanitizeHtml(html || "");
    return React.createElement(tag, {
      className,
      dangerouslySetInnerHTML: { __html: sanitized },
    });
  } catch (err) {
    return React.createElement(tag, { className }, html);
  }
}
