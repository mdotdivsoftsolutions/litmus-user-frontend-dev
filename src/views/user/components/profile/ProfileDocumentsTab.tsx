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
import { uploadApi } from "@/lib/api/uploadApi";
import { toast } from "sonner";

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
  const blob = await uploadApi.downloadFile(url, name);
  if (blob.type === "application/json") {
    throw new Error("Download failed");
  }
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = name || "document";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
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
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);

  const handleDownload = async (url: string, name: string) => {
    if (!url || downloadingUrl) return;
    setDownloadingUrl(url);
    try {
      await downloadDocument(url, name);
    } catch {
      toast.error("Download failed. Try again.");
    } finally {
      setDownloadingUrl(null);
    }
  };

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
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Business Documents & Certifications</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Upload, verify, view, and manage trade licenses & food safety certifications.</p>
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
          className="bg-brand-action hover:bg-brand-action-hover text-white rounded-xl h-10 px-4 gap-2 text-xs sm:text-sm font-semibold shrink-0 shadow-xs"
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />} Upload Document
        </Button>
      </div>

      <div className="grid gap-3">
        {(!documents || documents.length === 0) && (
          <div
            onClick={onUploadClick}
            className="border-2 border-dashed border-slate-200 hover:border-brand-action/50 hover:bg-brand-action/5 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="h-12 w-12 rounded-xl bg-slate-100 group-hover:bg-brand-action/10 text-slate-400 group-hover:text-brand-action flex items-center justify-center transition-colors">
              <CloudUpload className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No documents uploaded yet</p>
            <p className="text-xs text-slate-500 max-w-sm">Click to upload FSSAI certificates, GST registration, or company licenses (PDF, JPG, PNG up to 10MB).</p>
          </div>
        )}
        {documents?.map((doc: any, idx: number) => (
          <div
            key={doc._id || doc.url || idx}
            className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all"
          >
            <div className="h-11 w-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
              {isImageDoc(doc) ? (
                <img src={doc.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <FileText className="h-5 w-5 text-brand-action" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{doc.name}</p>
              <span className="text-[11px] text-muted-foreground">
                {doc.docType || "Document"} • {doc.size || "Unknown Size"}
              </span>
            </div>
            <div
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 shrink-0",
                doc.status === "Verified" ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : "text-amber-800 bg-amber-50 border border-amber-200"
              )}
            >
              {doc.status === "Verified" ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <Clock className="h-3.5 w-3.5 text-amber-600" />}
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
                disabled={downloadingUrl === doc.url}
                onClick={() => handleDownload(doc.url, doc.name)}
              >
                {downloadingUrl === doc.url ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
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
              disabled={!previewDoc?.url || downloadingUrl === previewDoc?.url}
              onClick={() => previewDoc && handleDownload(previewDoc.url, previewDoc.name)}
            >
              {downloadingUrl === previewDoc?.url ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download
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
