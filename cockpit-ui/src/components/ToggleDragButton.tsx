import { useDragMode } from "../DragContext";

export default function ToggleDragButton() {
  const { dragEnabled, toggleDrag } = useDragMode();

  return (
    <button
      onClick={toggleDrag}
      className={`fixed bottom-4 left-4 px-2 py-1 text-xs rounded shadow z-50 transition-colors duration-200 ${
        dragEnabled ? "bg-green-700" : "bg-red-700"
      } text-white`}
    >
      {dragEnabled ? "🔓 Drag ON" : "🔒 Drag OFF"}
    </button>
  );
}
