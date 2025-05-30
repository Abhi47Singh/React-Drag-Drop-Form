import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { FaEye } from "react-icons/fa";
import SortableField, { SortableFieldGroup } from "./SortableField";

export default function FormBuilder({ fields, updateField, removeField }) {
  const { setNodeRef, isOver } = useDroppable({ id: "form-dropzone" });
  // This hook allows the form area to accept dropped fields

  let rows = [];
  for (let i = 0; i < fields.length; ) {
    if (fields[i].width === 50 && fields[i + 1] && fields[i + 1].width === 50) {
      rows.push(
        <SortableFieldGroup
          key={fields[i].id + fields[i + 1].id}
          group={[fields[i], fields[i + 1]]}
          updateField={updateField}
          removeField={removeField}
        />
      );
      i += 2;
    } else {
      rows.push(
        <SortableField
          key={fields[i].id}
          field={fields[i]}
          updateField={updateField}
          removeField={removeField}
        />
      );
      i += 1;
    }
  }

  return (
    <div className="flex-1 relative flex flex-col mt-6">
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
              rows
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}