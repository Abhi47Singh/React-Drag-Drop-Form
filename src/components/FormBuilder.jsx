import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableField from "./SortableField";
import { FaEye } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

export default function FormBuilder({ fields, updateField, removeField, setPreview }) {
  const { setNodeRef, isOver } = useDroppable({ id: "form-dropzone" });

  // Group fields: if two consecutive fields have width 50, render them in a row
  const groupedFields = [];
  for (let i = 0; i < fields.length; ) {
    if (
      fields[i].width === 50 &&
      fields[i + 1] &&
      fields[i + 1].width === 50
    ) {
      groupedFields.push([fields[i], fields[i + 1]]);
      i += 2;
    } else {
      groupedFields.push([fields[i]]);
      i += 1;
    }
  }

  return (
    <div className="flex-1 relative flex flex-col">
      <div
        ref={setNodeRef}
        className={`flex-1 p-8 overflow-auto border-2 border-dotted rounded min-h-[200px] flex flex-col bg-gray-50 mx-8 my-8 ${
          isOver ? "bg-blue-50" : ""
        }`}
        id="form-dropzone"
        style={{ transition: "background 0.2s" }}
      >
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-4">
            {fields.length === 0 ? (
              <div className="w-full flex items-center justify-center h-60">
                <span className="text-gray-400 text-lg text-center">
                  Drag or tap to add field
                </span>
              </div>
            ) : (
              groupedFields.map((group, idx) =>
                group.length === 2 ? (
                  <div key={group[0].id + group[1].id} className="flex gap-4">
                    <div className="flex-1">
                      <SortableField
                        field={group[0]}
                        updateField={updateField}
                        removeField={removeField}
                      />
                    </div>
                    <div className="flex-1">
                      <SortableField
                        field={group[1]}
                        updateField={updateField}
                        removeField={removeField}
                      />
                    </div>
                  </div>
                ) : (
                  <SortableField
                    key={group[0].id}
                    field={group[0]}
                    updateField={updateField}
                    removeField={removeField}
                  />
                )
              )
            )}
          </div>
        </SortableContext>
        {/* Preview button bottom left, inside border */}
        {setPreview && (
          <div className="absolute left-12 bottom-8">
            <button
              className="text-xl bg-white border rounded shadow px-3 py-2 flex items-center gap-2"
              onClick={() => setPreview(true)}
            >
              <FaEye />
              Preview
            </button>
          </div>
        )}
      </div>
      {fields.map((field) => (
        <button
          key={field.id}
          onClick={() => removeField(field.id)}
          className="absolute top-1 right-1 text-red-600 text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        >
          <FaTrash />
        </button>
      ))}
    </div>
  );
}