import React, { useState } from "react";
import { FaArrowLeft, FaDesktop, FaTabletAlt, FaMobileAlt, FaMoon, FaSun } from "react-icons/fa";

export default function PreviewModal({ fields, setPreview, theme, setTheme }) {
  const [previewMode, setPreviewMode] = useState("desktop");

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-start p-8 z-50">
      {/* Theme toggle button */}
      <button
        className="absolute top-8 right-12 z-50 text-2xl p-2 rounded-full bg-white dark:bg-gray-800 shadow text-black dark:text-white"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        title="Toggle theme"
      >
        {theme === "light" ? <FaMoon /> : <FaSun />}
      </button>
      {/* Device selector */}
      <div className="flex gap-4 mb-6 mt-2 items-center">
        <button
          onClick={() => setPreviewMode("desktop")}
          className={`relative text-2xl p-2 rounded-full transition ${
            previewMode === "desktop"
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-800 text-black dark:text-white"
          }`}
          title="Desktop"
        >
          <FaDesktop />
          <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs bg-black text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none">
            Desktop
          </span>
        </button>
        <button
          onClick={() => setPreviewMode("tablet")}
          className={`relative text-2xl p-2 rounded-full transition ${
            previewMode === "tablet"
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-800 text-black dark:text-white"
          }`}
          title="Tablet"
        >
          <FaTabletAlt />
          <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs bg-black text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none">
            Tablet
          </span>
        </button>
        <button
          onClick={() => setPreviewMode("mobile")}
          className={`relative text-2xl p-2 rounded-full transition ${
            previewMode === "mobile"
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-800 text-black dark:text-white"
          }`}
          title="Mobile"
        >
          <FaMobileAlt />
          <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs bg-black text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none">
            Mobile
          </span>
        </button>
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
          bg-transparent
a          overflow-auto scrollbar-hide
          max-h-[80vh]
          mx-auto
          p-2
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
  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold text-black dark:text-white">
        {field.label}
      </label>
      {field.type === "textarea" ? (
        <textarea
          className="w-full p-2 border rounded h-24 resize-none bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
          placeholder={field.placeholder}
          disabled
        />
      ) : field.type === "dropdown" ? (
        <select
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
          disabled
        >
          {field.options.map((o, i) => (
            <option key={i}>{o}</option>
          ))}
        </select>
      ) : field.type === "radio" ? (
        <div className="flex gap-10">
          {field.options.map((opt, i) => (
            <label key={i} className="cursor-pointer">
              <input
                type="radio"
                name={field.id}
                className="peer hidden"
                disabled
                readOnly
              />
              <span className="
                inline-flex items-center justify-center
                px-4 py-2
                border-2 border-gray-400 dark:border-gray-600
                rounded-md
                text-base
                transition
                peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500
                bg-white dark:bg-gray-800 text-black dark:text-white
                select-none
                min-w-[80px]
              ">
                {opt}
              </span>
            </label>
          ))}
        </div>
      ) : field.type === "checkbox" ? (
        <div className="flex flex-col gap-2">
          {(field.options || []).map((opt, i) => (
            <label key={i} className="flex items-center space-x-2">
              <input type="checkbox" disabled />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      ) : (
        <input
          type={field.type === "date" ? "date" : "text"}
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
          placeholder={field.placeholder}
          disabled
        />
      )}
    </div>
  );
}