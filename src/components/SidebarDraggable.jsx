import React from "react";
import { useDraggable } from "@dnd-kit/core";

export default function SidebarDraggable({ type, label, onClick }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: "sidebar-" + type,
    data: { fromSidebar: true },
  });
  const handleClick = (e) => {
    if (!isDragging) onClick();
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`p-3 bg-white border rounded hover:bg-gray-200 capitalize select-none flex items-center justify-center ${
        isDragging ? "opacity-50" : ""
      }`}
      onClick={handleClick}
      style={{ minHeight: 60 }}
    >
      {label}
    </div>
  );
}