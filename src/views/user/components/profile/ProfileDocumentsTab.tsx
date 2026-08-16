"use client";

import { Button } from "@/components/ui/button";
import { CloudUpload, FileText, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileDocumentsTabProps {
  documents?: any[];
  isUploading: boolean;
  onUploadClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileDocumentsTab({
  documents,
  isUploading,
  onUploadClick,
  fileInputRef,
  handleFileUpload,
}: ProfileDocumentsTabProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm space-y-6">
      <div className="pb-4 border-b border-border flex justify-between items-end">
        <div>
          <h2 className="text-lg font-bold text-foreground">Business Documents</h2>
          <p className="text-sm text-muted-foreground">Upload and manage certifications.</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <Button
          disabled={isUploading}
          onClick={onUploadClick}
          className="bg-primary hover:bg-primary-deep text-primary-foreground rounded-lg h-9 px-4 gap-2 text-sm"
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
            key={idx}
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-slate-50/50 hover:bg-muted transition-colors"
          >
            <FileText className="h-5 w-5 text-accent shrink-0" />
            <div className="flex-1 min-w-0">
              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-foreground hover:text-primary hover:underline truncate block"
              >
                {doc.name}
              </a>
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
          </div>
        ))}
      </div>
    </div>
  );
}
