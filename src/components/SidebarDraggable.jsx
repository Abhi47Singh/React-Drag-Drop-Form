import React, { useRef } from "react";
import { useDraggable } from "@dnd-kit/core";

export default function SidebarDraggable({ type, label, onClick }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: "sidebar-" + type,
    data: { fromSidebar: true },
  });

  // Track if a drag occurred
  const dragRef = useRef(false);

  // Listen for drag start and end
  const handlePointerDown = () => {
    dragRef.current = false;
    window.addEventListener("pointermove", handlePointerMove);
  };

  const handlePointerMove = () => {
    dragRef.current = true;
    window.removeEventListener("pointermove", handlePointerMove);
  };

  const handlePointerUp = (e) => {
    window.removeEventListener("pointermove", handlePointerMove);
    // Only open config if not a drag
    if (!dragRef.current) {
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`w-full py-2 px-4 rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 capitalize select-none flex items-center justify-center cursor-pointer dark:text-white`}
      tabIndex={0}
      role="button"
      style={{ minHeight: 60 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {label}
    </div>
  );
}