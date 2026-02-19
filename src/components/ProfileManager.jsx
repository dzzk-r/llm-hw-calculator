import { useRef } from "react";

export default function ProfileManager({ state, storageKey = "llm-hw-profile", onLoad, onReset }) {
    const fileInputRef = useRef(null);

    const saveToLocal = () => {
        localStorage.setItem(storageKey, JSON.stringify(state));
        alert("Saved.");
    };

    const exportJSON = () => {
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "llm-hw-screen.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const importJSON = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(String(reader.result));
                onLoad?.(data);
            } catch {
                alert("Invalid JSON");
            }
        };
        reader.readAsText(file);
        event.target.value = "";
    };

    return (
        <div className="mt-4 flex flex-wrap gap-2">
            <button
                onClick={saveToLocal}
                className="text-xs px-2 py-1 rounded-lg border border-zinc-700 hover:border-zinc-500"
                type="button"
            >
                Save screen
            </button>

            <button
                onClick={exportJSON}
                className="text-xs px-2 py-1 rounded-lg border border-zinc-700 hover:border-zinc-500"
                type="button"
            >
                Export JSON
            </button>

            <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs px-2 py-1 rounded-lg border border-zinc-700 hover:border-zinc-500"
                type="button"
            >
                Import JSON
            </button>

            <button
                onClick={onReset}
                className="text-xs px-2 py-1 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                type="button"
            >
                Reset
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={importJSON}
            />
        </div>
    );
}
