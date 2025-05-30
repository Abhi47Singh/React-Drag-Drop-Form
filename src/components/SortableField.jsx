// SortableField.jsx
import React, { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FaPen,
  FaCheck,
  FaTrash,
  FaBold,
  FaItalic,
  FaPlus,
  FaMinus,
  FaArrowUp,
  FaArrowDown,
  FaArrowsAlt,
} from "react-icons/fa";
import ParagraphField from "./ParagraphField";
import { typeIcons } from "./icons";

const MIN_SIZE = 10;
const MAX_SIZE = 50;

export default function SortableField({ field, updateField, removeField, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id });
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(field.label);

  useEffect(() => {
    if (editingLabel) setLabelValue(field.label);
  }, [editingLabel, field.label]);

  // Shared dragging style
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

  // Paragraph fields get their own component
  if (field.type === "p") {
    return (
      <ParagraphField
        field={field}
        updateField={updateField}
        removeField={removeField}
        listeners={listeners}
        attributes={attributes}
        setNodeRef={setNodeRef}
        transform={transform}
        transition={transition}
        isDragging={isDragging}
      />
    );
  }

  const Icon = typeIcons[field.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-3 border rounded group select-none ${
        isDragging
          ? "bg-blue-100 dark:bg-blue-900 border-blue-600"
          : "bg-gray-50 dark:bg-gray-800"
      }`}
    >
      {/* Delete button */}
      {!editingLabel && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeField(field.id);
          }}
          className="absolute top-1 right-1 text-red-600 text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        >
          <FaTrash />
        </button>
      )}

      {/* Label editing */}
      <div className="mb-2 flex justify-around">
        <span
          {...listeners}
          {...attributes}
          className="cursor-move mr-2 text-gray-400 hover:text-gray-600 select-none"
          title="Drag to reorder"
          tabIndex={-1}
          style={{ fontSize: 20, display: "flex", alignItems: "center" }}
        >
          <FaArrowsAlt />
        </span>
        {editingLabel ? (
          <>
            <input
              value={labelValue}
              onChange={(e) => setLabelValue(e.target.value)}
              onBlur={() => {
                updateField(field.id, { label: labelValue || "Label" });
                setEditingLabel(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
              className="flex-1 p-1 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
              autoFocus
            />
            <button onClick={() => setEditingLabel(false)} className="ml-2 text-green-600">
              <FaCheck />
            </button>
          </>
        ) : (
          <>
            <h4 className="font-semibold mr-2 text-black dark:text-white flex items-center gap-2">
              {Icon && <Icon className="inline-block text-lg" />}
              {field.label}
            </h4>
            <button
              onClick={() => onEdit(field)}
              className="text-blue-600"
              type="button"
            >
              <FaPen />
            </button>
          </>
        )}
      </div>

      {/* Field input/rendering */}
      {field.type === "textarea" ? (
        <textarea
          className="w-full p-2 border rounded h-24 resize-none bg-white dark:bg-gray-800 text-black dark:text-white"
          placeholder={field.placeholder}
          required={field.required}
        />
      ) : field.type === "dropdown" ? (
        <select
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
          required={field.required}
        >
          {field.options.map((o, i) => (
            <option key={i}>{o}</option>
          ))}
        </select>
      ) : field.type === "radio" && field.multi ? (
        <div className="flex gap-10">
          {field.options.map((opt, i) => (
            <label key={i} className="cursor-pointer">
              <input
                type="checkbox"
                checked={field.value && field.value.includes(opt)}
                onChange={() => {
                  const newValue = field.value && field.value.includes(opt)
                    ? field.value.filter(v => v !== opt)
                    : [...(field.value || []), opt];
                  updateField(field.id, { value: newValue });
                }}
                className="peer hidden"
              />
              <span
                className={`inline-flex items-center justify-center px-4 py-2 border-2 border-gray-400 dark:border-gray-600 rounded-md text-base transition
                  peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500
                  bg-white dark:bg-gray-800 text-black dark:text-white select-none min-w-[80px]`}
              >
                {opt}
              </span>
            </label>
          ))}
        </div>
      ) : field.type === "radio" ? (
        <div className="flex gap-10">
          {field.options.map((opt, i) => (
            <label key={i} className="cursor-pointer">
              <input
                type="radio"
                name={field.id}
                checked={field.value === opt}
                onChange={() => updateField(field.id, { value: opt })}
                className="peer hidden"
              />
              <span
                className={`inline-flex items-center justify-center px-4 py-2 border-2 border-gray-400 dark:border-gray-600 rounded-md text-base transition
                  peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500
                  bg-white dark:bg-gray-800 text-black dark:text-white select-none min-w-[80px]`}
              >
                {opt}
              </span>
            </label>
          ))}
        </div>
      ) : (
        <input
          type={field.type === "date" ? "date" : "text"}
          value={field.value}
          onChange={(e) => updateField(field.id, { value: e.target.value })}
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
          placeholder={field.placeholder}
          required={field.required}
          pattern={field.pattern}
        />
      )}

      {/* Optional help text */}
      {field.helpText && <div className="text-xs text-gray-500 mt-1">{field.helpText}</div>}
    </div>
  );
}

export function SortableFieldGroup({ group, updateField, removeField }) {
  // group is an array of two fields
  return (
    <div className="flex gap-4 w-full">
      {group.map((field) => (
        <div key={field.id} className="flex-1">
          <SortableField
            field={field}
            updateField={updateField}
            removeField={removeField}
          />
        </div>
      ))}
    </div>
  );
}
