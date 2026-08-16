"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CloudUpload,
  FileText,
  CheckCircle2,
  Clock,
  Loader2,
  Eye,
  Download,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileDocumentsTabProps {
  documents?: any[];
  isUploading: boolean;
  isSaving?: boolean;
  onUploadClick: () => void;
  onReplaceClick: (index: number) => void;
  onDelete: (index: number) => void;
  onRename: (index: number, name: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function isImageDoc(doc: any) {
  const src = `${doc?.name || ""} ${doc?.url || ""}`.toLowerCase();
  return /\.(jpe?g|png|gif|webp)$/i.test(src);
}

function isPdfDoc(doc: any) {
  const src = `${doc?.name || ""} ${doc?.url || ""}`.toLowerCase();
  return /\.pdf$/i.test(src);
}

async function downloadDocument(url: string, name: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("download failed");
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = name || "document";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export function ProfileDocumentsTab({
  documents,
  isUploading,
  isSaving,
  onUploadClick,
  onReplaceClick,
  onDelete,
  onRename,
  fileInputRef,
  handleFileUpload,
}: ProfileDocumentsTabProps) {
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const openEdit = (idx: number, doc: any) => {
    setEditIndex(idx);
    setEditName(doc.name || "");
  };

  const saveEdit = () => {
    if (editIndex === null) return;
    const trimmed = editName.trim();
    if (trimmed) onRename(editIndex, trimmed);
    setEditIndex(null);
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm space-y-6">
      <div className="pb-4 border-b border-border flex justify-between items-end gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Business Documents</h2>
          <p className="text-sm text-muted-foreground">Upload, view, download, and replace certifications.</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          accept=".pdf,.jpg,.jpeg,.png,.webp"
        />
        <Button
          disabled={isUploading}
          onClick={onUploadClick}
          className="bg-brand-action hover:bg-brand-action-hover text-white rounded-lg h-9 px-4 gap-2 text-sm shrink-0"
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />} Upload
        </Button>
      </div>

      <div className="grid gap-3">
        {(!documents || documents.length === 0) && (
          <p className="text-sm text-muted-foreground text-center py-6">No documents uploaded yet.</p>
        )}
        {documents?.map((doc: any, idx: number) => (
          <div
            key={doc._id || doc.url || idx}
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-slate-50/50 hover:bg-muted transition-colors"
          >
            <div className="h-10 w-10 rounded-lg bg-white border border-border flex items-center justify-center shrink-0 overflow-hidden">
              {isImageDoc(doc) ? (
                <img src={doc.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <FileText className="h-5 w-5 text-brand-action" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{doc.name}</p>
              <span className="text-[10px] text-muted-foreground font-mono">
                {doc.docType || "Document"} • {doc.size || "Unknown Size"}
              </span>
            </div>
            <div
              className={cn(
                "px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 shrink-0",
                doc.status === "Verified" ? "text-litmus-teal bg-litmus-teal/10" : "text-flame-orange bg-flame-orange/10"
              )}
            >
              {doc.status === "Verified" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              {doc.status}
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-brand-action"
                title="View"
                onClick={() => setPreviewDoc(doc)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-brand-action"
                title="Download"
                onClick={() => downloadDocument(doc.url, doc.name)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-brand-action"
                title="Edit"
                onClick={() => openEdit(idx, doc)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                title="Delete"
                disabled={isSaving}
                onClick={() => onDelete(idx)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate pr-6">{previewDoc?.name || "Document"}</DialogTitle>
          </DialogHeader>
          <div className="min-h-[240px] max-h-[70vh] overflow-auto rounded-lg border border-border bg-slate-50 flex items-center justify-center">
            {previewDoc && isImageDoc(previewDoc) ? (
              <img src={previewDoc.url} alt={previewDoc.name} className="max-h-[70vh] w-auto object-contain" />
            ) : previewDoc && isPdfDoc(previewDoc) ? (
              <iframe src={previewDoc.url} title={previewDoc.name} className="w-full h-[70vh] rounded-lg" />
            ) : (
              <div className="p-8 text-center space-y-3">
                <FileText className="h-10 w-10 text-brand-action mx-auto" />
                <p className="text-sm text-muted-foreground">Preview is not available for this file type.</p>
                <Button asChild className="bg-brand-action hover:bg-brand-action-hover text-white">
                  <a href={previewDoc?.url} target="_blank" rel="noreferrer">Open in new tab</a>
                </Button>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <a href={previewDoc?.url} target="_blank" rel="noreferrer">Open in new tab</a>
            </Button>
            <Button
              className="bg-brand-action hover:bg-brand-action-hover text-white"
              onClick={() => previewDoc && downloadDocument(previewDoc.url, previewDoc.name)}
            >
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editIndex !== null} onOpenChange={(open) => !open && setEditIndex(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">File name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-10 rounded-lg" />
            </div>
            <p className="text-xs text-muted-foreground">Replace the file to upload a new version. The current file stays until you pick a replacement.</p>
            <div className="flex justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isUploading || editIndex === null}
                onClick={() => {
                  if (editIndex === null) return;
                  onReplaceClick(editIndex);
                  setEditIndex(null);
                }}
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />}
                Replace file
              </Button>
              <Button
                type="button"
                className="bg-brand-action hover:bg-brand-action-hover text-white"
                disabled={isSaving || !editName.trim()}
                onClick={saveEdit}
              >
                Save name
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
