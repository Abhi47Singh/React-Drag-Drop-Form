import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Sidebar from "./components/Sidebar";
import FormBuilder from "./components/FormBuilder";
import PreviewModal from "./components/PreviewModal";

const COMPONENTS = [
  { type: "name", label: "Name" },
  { type: "email", label: "Email" },
  { type: "phone", label: "Phone" },
  { type: "address", label: "Address" },
  { type: "date", label: "Date" },
  { type: "dropdown", label: "Dropdown" },
  { type: "radio", label: "Radio" },
  { type: "textarea", label: "Textarea" },
];

export default function App() {
  const [fields, setFields] = useState([]);
  const [preview, setPreview] = useState(false);
  const [theme, setTheme] = useState("light");
  const sensors = useSensors(useSensor(PointerSensor));

  // Persist theme in localStorage (optional)
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  // Handle DnD for form area (reorder or add new)
  const handleDragEnd = ({ active, over }) => {
    if (active.data?.current?.fromSidebar && over?.id === "form-dropzone") {
      const comp = COMPONENTS.find(
        (c) => c.type === active.id.replace("sidebar-", "")
      );
      if (comp) {
        setFields((prev) => [
          ...prev,
          {
            ...comp,
            id: `${comp.type}-${Date.now()}`,
            label: comp.label,
            width: 100,
            options:
              comp.type === "dropdown" || comp.type === "radio"
                ? ["Option 1"]
                : undefined,
            value: "",
          },
        ]);
      }
      return;
    }
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      if (oldIndex > -1 && newIndex > -1)
        setFields((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  const addField = (config) => {
    const count = config.type === "name" && config.width === 50 ? 2 : 1;
    const newFields = [];
    for (let i = 0; i < count; i++) {
      newFields.push({
        ...config,
        id: `${config.type}-${Date.now()}-${i}`,
        value: "",
      });
    }
    setFields((prev) => [...prev, ...newFields]);
  };
  const updateField = (id, updates) =>
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  const removeField = (id) =>
    setFields((prev) => prev.filter((f) => f.id !== id));

  return (
    <div className={`${theme} h-screen bg-white text-black dark:bg-gray-900 dark:text-white`}>
      {/* Theme toggle icon */}
      <button
        className="absolute top-4 right-8 z-50 text-2xl p-2 rounded-full bg-white dark:bg-gray-800 shadow"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        title="Toggle theme"
      >
        {theme === "light" ? <FaMoon /> : <FaSun />}
      </button>
      {preview && <PreviewModal fields={fields} setPreview={setPreview} />}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-screen">
          <Sidebar
            onAdd={addField}
            COMPONENTS={COMPONENTS}
            setPreview={setPreview}
          />
          <FormBuilder
            fields={fields}
            updateField={updateField}
            removeField={removeField}
          />
        </div>
      </DndContext>
    </div>
  );
}
