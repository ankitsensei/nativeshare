import { useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  File,
  FileImage,
  FileText,
  FolderOpen,
  HardDrive,
  Laptop,
  Network,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  Wifi,
  X,
} from "lucide-react";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return FileImage;
  if (type.startsWith("text/") || type.includes("pdf")) return FileText;
  return File;
}

export default function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hostname = window.location.hostname;
  const networkAddress = `http://${hostname}:3000`;

  function addFiles(selectedFiles: FileList | File[]) {
    setFiles((previous) => {
      const incoming = Array.from(selectedFiles);
      const unique = incoming.filter(
        (file) =>
          !previous.some(
            (existing) =>
              existing.name === file.name &&
              existing.size === file.size &&
              existing.lastModified === file.lastModified,
          ),
      );

      return [...previous, ...unique];
    });
  }

  function removeFile(index: number) {
    setFiles((previous) => previous.filter((_, i) => i !== index));
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  }

  const totalSize = files.reduce((total, file) => total + file.size, 0);

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <ArrowUpFromLine size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">NativeShare</h1>
              <p className="text-xs text-zinc-500">Share files. Stay local.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Local network
          </div>
        </header>

        {/* Welcome */}
        <section className="py-10">
          <p className="mb-2 text-sm font-medium text-blue-400">
            YOUR PERSONAL FILE TRANSFER
          </p>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Share files, effortlessly.
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            Transfer files between devices connected to the same Wi-Fi network.
            Fast, private, and without cloud storage.
          </p>
        </section>

        {/* Network card */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#121216] p-5">
            <div className="mb-4 flex items-center gap-2 text-sm text-zinc-400">
              <Network size={17} />
              Network address
            </div>

            <p className="break-all font-mono text-lg font-semibold">
              {networkAddress}
            </p>

            <p className="mt-2 text-xs text-zinc-500">
              Open this address on another device.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#121216] p-5">
            <div className="mb-4 flex items-center gap-2 text-sm text-zinc-400">
              <Laptop size={17} />
              Current device
            </div>

            <p className="text-lg font-semibold">
              {hostname === "localhost" ? "Development device" : hostname}
            </p>

            <p className="mt-2 text-xs text-zinc-500">
              NativeShare host interface
            </p>
          </div>
        </section>

        {/* Upload area */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Send files</h3>
            <span className="text-xs text-zinc-500">Select multiple files</span>
          </div>

          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setDragging(false);
              }
            }}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition sm:p-14 ${
              dragging
                ? "border-blue-400 bg-blue-500/10"
                : "border-white/15 bg-[#121216] hover:border-blue-500/50 hover:bg-[#17171d]"
            }`}
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <Upload size={30} />
            </div>

            <h4 className="text-lg font-semibold">
              {dragging ? "Drop your files here" : "Drag and drop your files"}
            </h4>

            <p className="mt-2 text-sm text-zinc-500">
              Or click below to browse your device
            </p>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                inputRef.current?.click();
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
            >
              <Plus size={17} />
              Choose files
            </button>

            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(event) => {
                if (event.target.files) {
                  addFiles(event.target.files);
                }
                event.target.value = "";
              }}
            />
          </div>
        </section>

        {/* Selected files */}
        {files.length > 0 && (
          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Selected files</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  {files.length} files · {formatBytes(totalSize)}
                </p>
              </div>

              <button
                onClick={() => setFiles([])}
                className="text-xs text-zinc-400 transition hover:text-red-400"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-3">
              {files.map((file, index) => {
                const Icon = getFileIcon(file.type);

                return (
                  <div
                    key={`${file.name}-${file.lastModified}-${index}`}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#121216] p-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <Icon size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {file.name}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {formatBytes(file.size)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFile(index)}
                      aria-label={`Remove ${file.name}`}
                      className="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Future transfer section */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-[#121216] p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-zinc-800 p-3 text-zinc-400">
              <HardDrive size={20} />
            </div>

            <div>
              <h3 className="text-sm font-semibold">Transfer activity</h3>
              <p className="mt-1 text-xs text-zinc-500">
                Your transfers will appear here.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center rounded-xl border border-dashed border-white/10 py-8 text-center">
            <div>
              <ArrowDownToLine size={24} className="mx-auto text-zinc-600" />
              <p className="mt-3 text-sm text-zinc-500">No transfers yet</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-zinc-500 sm:flex-row">
          <p>NativeShare · Share files. Stay local.</p>

          <div className="flex items-center gap-2">
            <ShieldCheck size={14} />
            <span>Designed for local file sharing</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
