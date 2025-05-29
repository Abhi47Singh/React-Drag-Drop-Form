import React from "react";
import { FaArrowLeft } from "react-icons/fa";

export default function PreviewModal({ fields, setPreview }) {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-start p-8 z-50">
      <button
        className="self-start mb-4 text-xl"
        onClick={() => setPreview(false)}
      >
        <FaArrowLeft /> Back
      </button>
      <div className="w-full max-w-xl">
        {fields.map((field) => (
          <PreviewField key={field.id} field={field} />
        ))}
      </div>
    </div>
  );
}

function PreviewField({ field }) {
  if (field.type === "textarea")
    return <textarea className="w-full p-2 border rounded h-24 resize-none mb-4" placeholder={field.label} />;
  if (field.type === "dropdown")
    return (
      <select className="w-full p-2 border rounded mb-4">
        {field.options.map((o, i) => <option key={i}>{o}</option>)}
      </select>
    );
  if (field.type === "radio")
    return (
      <div className="flex gap-4 mb-4">
        {field.options.map((opt, i) => (
          <button key={i} className="px-4 py-2 border rounded">{opt}</button>
        ))}
      </div>
    );
  return <input type={field.type === "date" ? "date" : "text"}
    className="w-full p-2 border rounded mb-4" placeholder={field.label} />;
}