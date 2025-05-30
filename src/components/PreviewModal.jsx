import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

export default function PreviewModal({ fields, setPreview }) {
  const [previewMode, setPreviewMode] = useState("desktop");

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-start p-8 z-50">
      {/* Device selector */}
      <div className="flex gap-4 mb-6 mt-2">
        <button onClick={() => setPreviewMode("desktop")} className={previewMode === "desktop" ? "font-bold" : ""}>Desktop</button>
        <button onClick={() => setPreviewMode("tablet")} className={previewMode === "tablet" ? "font-bold" : ""}>Tablet</button>
        <button onClick={() => setPreviewMode("mobile")} className={previewMode === "mobile" ? "font-bold" : ""}>Mobile</button>
        <button
          className="ml-8 px-4 py-2 border rounded text-black dark:text-white border-gray-300 dark:border-gray-600"
          onClick={() => setPreview(false)}
        >
          <span className="inline-flex items-center gap-2"><FaArrowLeft /> Back</span>
        </button>
      </div>
      <div
        className={`
          w-full
          ${previewMode === "desktop" ? "max-w-2xl" : ""}
          ${previewMode === "tablet" ? "max-w-lg" : ""}
          ${previewMode === "mobile" ? "max-w-xs" : ""}
        `}
      >
        {fields.map((field) => (
          <PreviewField key={field.id} field={field} />
        ))}
      </div>
    </div>
  );
}

function PreviewField({ field }) {
  if (field.type === "textarea")
    return <textarea className="w-full p-2 border rounded h-24 resize-none mb-4 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600" placeholder={field.label} disabled />;
  if (field.type === "dropdown")
    return (
      <select className="w-full p-2 border rounded mb-4 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600" disabled>
        {field.options.map((o, i) => <option key={i}>{o}</option>)}
      </select>
    );
  if (field.type === "radio")
    return (
      <div className="flex gap-4 mb-4">
        {field.options.map((opt, i) => (
          <button key={i} className="px-4 py-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600" disabled>{opt}</button>
        ))}
      </div>
    );
  return <input
    type={field.type === "date" ? "date" : "text"}
    className="w-full p-2 border rounded mb-4 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
    placeholder={field.label}
    disabled
  />;
}