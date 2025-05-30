import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableField from "./SortableField";
import { FaEye } from "react-icons/fa";

export default function FormBuilder({ fields, updateField, removeField }) {
  const { setNodeRef, isOver } = useDroppable({ id: "form-dropzone" });
  // This hook allows the form area to accept dropped fields

  return (
    <div className="flex-1 relative flex flex-col">
      {/* Main Form Builder */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-8 overflow-auto border-2 border-dotted rounded min-h-[200px] flex flex-col bg-gray-50 dark:bg-gray-900 mx-8 my-8 ${
          isOver ? "bg-blue-50 dark:bg-blue-900" : ""
        }`}
        id="form-dropzone"
        style={{ transition: "background 0.2s" }}
      >
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-4">
            {fields.length === 0 ? (
              <div className="w-full flex items-center justify-center h-60">
                <span className="text-gray-400 text-lg text-center">
                  Drag or tap to add field
                </span>
              </div>
            ) : (
              fields.map((field) => (
                <SortableField
                  key={field.id}
                  field={field}
                  updateField={updateField}
                  removeField={removeField}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}