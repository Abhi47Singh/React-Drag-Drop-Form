import React, { useState } from "react";
import { FaArrowLeft, FaDesktop, FaTabletAlt, FaMobileAlt, FaMoon, FaSun } from "react-icons/fa";
import { typeIcons } from "./icons";

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
          overflow-auto scrollbar-hide
          max-h-[80vh]
          mx-auto
          p-2
        `}
      >
        <div
          className="border border-dashed border-gray-400 rounded-lg bg-transparent p-8 mx-auto flex flex-col gap-4"
          style={{
            minHeight: 400,
            background: "transparent",
            overflow: "visible",
          }}
        >
          {fields.map((field) => (
            <PreviewField key={field.id} field={field} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PreviewField({ field }) {
  // Use array for checkbox, string for others
  const [value, setValue] = useState(
    field.type === "checkbox" ? (Array.isArray(field.value) ? field.value : []) : field.value || ""
  );

  // Handler for checkbox group (multi-select)
  const handleCheckbox = (opt) => {
    if (value.includes(opt)) {
      setValue(value.filter((v) => v !== opt));
    } else {
      setValue([...value, opt]);
    }
  };

  // Handler for radio group (single-select)
  const handleRadio = (opt) => setValue(opt);

  const Icon = typeIcons[field.type];

  if (field.type === "p") {
    return (
      <div className="mb-6">
        <span
          style={{
            fontWeight: field.bold ? "bold" : "normal",
            fontStyle: field.italic ? "italic" : "normal",
            fontSize: field.fontSize || 18,
            marginTop: field.margin || 0,
            marginBottom: field.margin || 0,
            display: "block"
          }}
        >
          {field.text}
        </span>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Label above input */}
      <label className="block mb-2 font-semibold text-black dark:text-white">
        {field.label}
      </label>
      {/* Input with icon inside */}
      <div className="relative">
        {/* Only show icon for input types, not textarea or dropdown */}
        {field.type !== "dropdown" && field.type !== "radio" && field.type !== "checkbox" && field.type !== "textarea" && Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
            <Icon />
          </span>
        )}
        {field.type === "textarea" ? (
          <textarea
            className="w-full p-2 border rounded h-24 resize-none bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
            placeholder={field.placeholder}
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        ) : field.type === "dropdown" ? (
          <select
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
            value={value}
            onChange={e => setValue(e.target.value)}
          >
            {field.options.map((o, i) => (
              <option key={i}>{o}</option>
            ))}
          </select>
        ) : field.type === "radio" && field.multi ? (
          <div className="flex gap-4">
            {field.options.map((opt, i) => (
              <label
                key={i}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded border
                  border-gray-500 cursor-pointer
                  ${value.includes(opt) ? "bg-blue-600 text-white" : "bg-white text-black"}
                `}
                style={{ minWidth: 100, justifyContent: "center" }}
              >
                <input
                  type="checkbox"
                  checked={value.includes(opt)}
                  onChange={() => handleCheckbox(opt)}
                  className="hidden"
                />
                {opt}
              </label>
            ))}
          </div>
        ) : field.type === "radio" ? (
          <div className="flex gap-4">
            {field.options.map((opt, i) => (
              <label
                key={i}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded border
                  border-gray-500 cursor-pointer
                  ${value === opt ? "bg-blue-600 text-white" : "bg-white text-black"}
                `}
                style={{ minWidth: 100, justifyContent: "center" }}
              >
                <input
                  type="radio"
                  checked={value === opt}
                  onChange={() => handleRadio(opt)}
                  className="hidden"
                />
                {opt}
              </label>
            ))}
          </div>
        ) : field.type === "checkbox" ? (
          <div className="flex gap-4">
            {(field.options || []).map((opt, i) => (
              <label
                key={i}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded border
                  border-gray-500 cursor-pointer
                  ${value.includes(opt) ? "bg-blue-600 text-white" : "bg-white text-black"}
                `}
                style={{ minWidth: 100, justifyContent: "center" }}
              >
                <input
                  type="checkbox"
                  checked={value.includes(opt)}
                  onChange={() => handleCheckbox(opt)}
                  className="hidden"
                />
                {opt}
              </label>
            ))}
          </div>
        ) : (
          <input
            type={field.type === "date" ? "date" : "text"}
            className="w-full pl-10 p-2 border rounded bg-white dark:bg-gray-800 text- dark:text-white border-gray-300 dark:border-gray-600"
            placeholder={field.placeholder}
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}