import React, { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaPen, FaCheck, FaTrash } from "react-icons/fa";

export default function SortableField({ field, updateField, removeField, className = "" }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(field.label);

  useEffect(() => {
    if (editingLabel) setLabelValue(field.label);
  }, [editingLabel, field.label]);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    width: field.type === "name" && field.width === 100 ? "100%" : undefined,
    minWidth: field.type === "name" && field.width === 100 ? "100%" : undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
    boxShadow: isDragging
      ? "0 0 0 2px #2563eb, 0 8px 24px 0 rgba(0,0,0,0.12)"
      : undefined,
    border: isDragging ? "2px solid #2563eb" : undefined,
  };

  const saveLabel = () => {
    updateField(field.id, { label: labelValue || "Label" });
    setEditingLabel(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`relative p-3 border rounded group select-none ${
        isDragging
          ? "bg-blue-100 dark:bg-blue-900 border-blue-600"
          : "bg-gray-50 dark:bg-gray-800"
      } ${className}`}
    >
      {!editingLabel && (
        <button
          onClick={e => {
            e.stopPropagation();
            removeField(field.id);
          }}
          className="absolute top-1 right-1 text-red-600 text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        >
          <FaTrash />
        </button>
      )}
      <div className="mb-2 flex items-center">
        <span
          {...listeners}
          className="cursor-move mr-2 text-gray-400 hover:text-gray-600"
          title="Drag to reorder"
          tabIndex={-1}
        >
          &#9776;
        </span>
        {editingLabel ? (
          <>
            <input
              value={labelValue}
              onChange={e => setLabelValue(e.target.value)}
              className="flex-1 p-1 border rounded"
              autoFocus
              onBlur={saveLabel}
              onKeyDown={e => { if (e.key === "Enter") saveLabel(); }}
            />
            <button onClick={saveLabel} className="ml-2 text-green-600">
              <FaCheck />
            </button>
          </>
        ) : (
          <>
            <h4 className="font-semibold mr-2 text-black dark:text-white">{field.label}</h4>
            <button
              onClick={() => setEditingLabel(true)}
              className="text-blue-600"
              tabIndex={-1}
              type="button"
            >
              <FaPen />
            </button>
          </>
        )}
      </div>
      {field.type === "textarea" ? (
        <textarea
          className="w-full p-2 border rounded h-24 resize-none bg-white dark:bg-gray-800 text-black dark:text-white"
          placeholder={field.placeholder}
          minLength={field.minLength}
          maxLength={field.maxLength}
          required={field.required}
          aria-describedby={field.helpText ? `help-${field.id}` : undefined}
        />
      ) : field.type === "dropdown" ? (
        <select
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
          required={field.required}
          aria-describedby={field.helpText ? `help-${field.id}` : undefined}
          placeholder={field.placeholder}
        >
          {field.options.map((o, i) => <option key={i}>{o}</option>)}
        </select>
      ) : field.type === "radio" ? (
        <div className="flex gap-10">
          {field.options.map((opt, i) => (
            <label
              key={i}
              className="cursor-pointer"
            >
              <input
                type="radio"
                name={field.id}
                className="peer hidden"
                required={field.required}
                aria-describedby={field.helpText ? `help-${field.id}` : undefined}
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
              <input
                type="checkbox"
                name={field.id}
                required={field.required}
                aria-describedby={field.helpText ? `help-${field.id}` : undefined}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      ) : (
        <input
          type={field.type === "date" ? "date" : "text"}
          value={field.value}
          onChange={e => updateField(field.id, { value: e.target.value })}
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
          placeholder={field.placeholder}
          minLength={field.minLength}
          maxLength={field.maxLength}
          required={field.required}
          pattern={field.pattern}
          aria-describedby={field.helpText ? `help-${field.id}` : undefined}
        />
      )}
      {field.helpText && (
        <div id={`help-${field.id}`} className="text-xs text-gray-500 mt-1">
          {field.helpText}
        </div>
      )}
    </div>
  );
}

// Optional: If you want to keep the group component
export function SortableFieldGroup({ group, updateField, removeField }) {
  return (
    <div key={group[0].id + group[1].id} className="flex gap-10">
      <SortableField
        field={group[0]}
        updateField={updateField}
        removeField={removeField}
        className="flex-1"
      />
      <SortableField
        field={group[1]}
        updateField={updateField}
        removeField={removeField}
        className="flex-1"
      />
    </div>
  );
}

