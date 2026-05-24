"use client";

import React from "react";
import { sanitizeHtml } from "@/lib/utils";

type IssueDescriptionProps = {
  description?: string | null;
  className?: string;
};

/**
 * Renders issue description, splitting the main description from
 * "-- Additional Details --" into visually separated sections.
 */
export default function IssueDescription({
  description = "",
  className = "",
}: IssueDescriptionProps) {
  const raw = description || "";
  const separator = "-- Additional Details --";
  const sepIndex = raw.indexOf(separator);

  if (sepIndex === -1) {
    // No additional details — render as-is
    let htmlContent: string | null = null;
    try {
      htmlContent = sanitizeHtml(raw);
    } catch {
      // Fallback to raw content if sanitization fails
    }

    if (htmlContent !== null) {
      return (
        <div
          className={`whitespace-pre-wrap ${className}`}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    }

    return <div className={`whitespace-pre-wrap ${className}`}>{raw}</div>;
  }

  const mainDescription = raw.substring(0, sepIndex).trim();
  const additionalRaw = raw.substring(sepIndex + separator.length).trim();

  // Parse key-value pairs from additional details (e.g. "Issue Type: individual_based Sector: Urban Water Supply")
  const detailPairs: { label: string; value: string }[] = [];
  const knownKeys = [
    "Issue Type",
    "Sector",
    "Subsector",
    "People Affected",
    "Households Affected",
    "Category",
    "Priority",
    "Community",
  ];

  const remaining = additionalRaw;
  for (let i = 0; i < knownKeys.length; i++) {
    const key = knownKeys[i];
    const keyPattern = `${key}:`;
    const keyIdx = remaining.indexOf(keyPattern);
    if (keyIdx === -1) continue;

    const afterKey = remaining.substring(keyIdx + keyPattern.length);

    // Find where the next known key starts
    let nextKeyIdx = afterKey.length;
    for (const nextKey of knownKeys) {
      const nIdx = afterKey.indexOf(`${nextKey}:`);
      if (nIdx !== -1 && nIdx < nextKeyIdx) {
        nextKeyIdx = nIdx;
      }
    }

    const value = afterKey.substring(0, nextKeyIdx).trim();
    if (value) {
      detailPairs.push({ label: key, value });
    }
  }

  const renderMainDescription = () => {
    if (!mainDescription) return null;
    let htmlContent: string | null = null;
    try {
      htmlContent = sanitizeHtml(mainDescription);
    } catch {
      // Fallback if sanitization fails
    }

    if (htmlContent !== null) {
      return (
        <div
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    }

    return <div className="whitespace-pre-wrap">{mainDescription}</div>;
  };

  return (
    <div className={className}>
      {renderMainDescription()}

      {/* Additional Details */}
      {(detailPairs.length > 0 || additionalRaw) && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Additional Details
          </h4>
          {detailPairs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {detailPairs.map((pair, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {pair.label}
                  </span>
                  <span className="text-sm text-gray-800 mt-0.5">
                    {pair.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {additionalRaw}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
