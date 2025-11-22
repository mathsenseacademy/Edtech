import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";

// Tools
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import Table from "@editorjs/table";
import ImageTool from "@editorjs/image";
import AttachesTool from "@editorjs/attaches";
import Checklist from "@editorjs/checklist";
import Embed from "@editorjs/embed";
import Warning from "@editorjs/warning";
import Marker from "@editorjs/marker";
import LinkTool from "@editorjs/link"; // Simple LinkTool

// Firebase utils (must export uploadToFirebase & deleteFromFirebase)
import { uploadToFirebase, deleteFromFirebase } from "../utils/firebaseStorage";

// Editor CSS (ensure your editor.css exists)
import "../styles/editor.css";

const EditorJsFirebase = ({ data, onChange, blogId, readOnly = false }) => {
  const editorHolderRef = useRef(null);
  const instanceRef = useRef(null);

  // track active uploads (use Set so multiple uploads count correctly)
  const [uploadingFiles, setUploadingFiles] = useState(new Set());

  // ready + initial load flags
  const [isReady, setIsReady] = useState(false);
  const initialLoadedRef = useRef(false);

  // Utility: add/remove upload id from Set
  const addUploading = (id) =>
    setUploadingFiles((prev) => {
      const s = new Set(prev);
      s.add(id);
      return s;
    });
  const removeUploading = (id) =>
    setUploadingFiles((prev) => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });

  // Normalize incoming data to Editor.js expected shape.
  // This avoids "Block skipped because saved data is invalid" for common cases.
  const normalizeInitialData = (raw) => {
    if (!raw) return undefined;
    if (!raw.blocks || !Array.isArray(raw.blocks)) return undefined;

    // Map blocks and ensure each has correct `data` shape for common block types.
    const blocks = raw.blocks.map((b) => {
      if (!b || typeof b !== "object") return null;
      const type = b.type;
      const db = b.data ?? {};

      // Paragraph expected: { text: "..." }
      if (type === "paragraph") {
        if (typeof db === "string") return { type, data: { text: db } };
        if (db.text) return { type, data: { text: db.text } };
        return { type, data: { text: "" } };
      }

      // Header expected: { text: "...", level: 2 }
      if (type === "header") {
        return {
          type,
          data: {
            text: db.text ?? db?.heading ?? "",
            level: db.level ?? 2,
          },
        };
      }

      // Image expected: { file: { url }, caption, withBorder, ... }
      if (type === "image") {
        if (db.file && db.file.url) {
          return {
            type,
            data: {
              file: { url: db.file.url, ...db.file },
              caption: db.caption ?? "",
              withBorder: !!db.withBorder,
              withBackground: !!db.withBackground,
              stretched: !!db.stretched,
            },
          };
        }
        // If invalid, return a paragraph fallback
        return { type: "paragraph", data: { text: "[Image could not be loaded]" } };
      }

      // Attaches expected: file:{url, name, size, path} ...
      if (type === "attaches") {
        if (db.file && db.file.url) {
          return { type, data: { file: { ...(db.file || {}) }, title: db.title ?? db.file.name ?? "" } };
        }
        return { type: "paragraph", data: { text: "[Attachment]" } };
      }

      // For other blocks, return as-is (best effort)
      return { type, data: db };
    });

    return { blocks: blocks.filter(Boolean) };
  };

  useEffect(() => {
    // Initialize only once
    if (!editorHolderRef.current || instanceRef.current) return;

    let mounted = true;

    const editor = new EditorJS({
      holder: editorHolderRef.current,
      readOnly,
      autofocus: !readOnly,

      // We won't pass reactive data here to avoid re-renders.
      // We'll render initial data manually after ready (once).
      data: undefined,

      // Called when editor changes. IMPORTANT: do NOT feed this result back
      // into the `data` prop of this component (causes re-render loops).
      onChange: async (api) => {
        if (readOnly || typeof onChange !== "function") return;
        try {
          const saved = await api.saver.save();
          // Give consumer the saved JSON; consumer should NOT pass it back into `data`.
          onChange(saved);
        } catch (err) {
          console.error("Editor save failed:", err);
        }
      },

      onReady: () => {
        if (!mounted) return;
        instanceRef.current = editor;
        setIsReady(true);
      },

      placeholder: "Start writing your blog post...",
      tools: {
        header: { class: Header, inlineToolbar: true },
        list: { class: List, inlineToolbar: true },
        checklist: { class: Checklist, inlineToolbar: true },
        quote: { class: Quote, inlineToolbar: true },
        code: { class: Code },
        inlineCode: { class: InlineCode },
        marker: { class: Marker },
        delimiter: Delimiter,
        table: { class: Table, inlineToolbar: true },
        warning: { class: Warning, inlineToolbar: true },

        // LinkTool (simple)
        link: {
          class: LinkTool,
          inlineToolbar: true,
        },

        embed: {
          class: Embed,
          inlineToolbar: true,
          config: { services: { youtube: true, vimeo: true } },
        },

        /* IMAGE UPLOADER */
        image: {
          class: ImageTool,
          inlineToolbar: true,
          config: {
            captionPlaceholder: "Add caption",
            buttonContent: "Select an Image",
            uploader: {
              // EditorJS expects uploadByFile(file) returning { success, file: {url, ...} }
              uploadByFile: async (file) => {
                const uploadId = `img-${Date.now()}-${file.name}`;
                addUploading(uploadId);

                try {
                  // Attempt to find previous file path for this block (defensive)
                  let prevPath = null;
                  try {
                    const blocksApi = instanceRef.current?.blocks;
                    const curIndex =
                      typeof blocksApi?.getCurrentBlockIndex === "function"
                        ? blocksApi.getCurrentBlockIndex()
                        : null;

                    if (curIndex !== null && typeof blocksApi?.getBlockByIndex === "function") {
                      const block = blocksApi.getBlockByIndex(curIndex);
                      prevPath = block?.data?.file?.path ?? null;
                    }
                  } catch (err) {
                    console.warn("Failed to get previous image path:", err);
                  }

                  const uploaded = await uploadToFirebase(file, "blog-images", blogId || "temp");

                  // Delete previous if exists
                  if (prevPath) {
                    try {
                      await deleteFromFirebase(prevPath);
                    } catch (err) {
                      console.warn("Failed to delete previous image:", err);
                    }
                  }

                  removeUploading(uploadId);

                  return {
                    success: 1,
                    file: {
                      url: uploaded.url,
                      name: uploaded.name,
                      size: uploaded.size,
                      path: uploaded.path,
                    },
                  };
                } catch (err) {
                  removeUploading(uploadId);
                  console.error("Image upload error:", err);
                  return { success: 0, error: err?.message || "Upload failed" };
                }
              },

              uploadByUrl: async (url) => {
                // For external urls, we don't upload; just return as-is
                return { success: 1, file: { url } };
              },
            },
          },
        },

        /* ATTACHMENTS (PDF/DOC) */
        attaches: {
          class: AttachesTool,
          config: {
            uploader: {
              uploadByFile: async (file) => {
                const uploadId = `file-${Date.now()}-${file.name}`;
                addUploading(uploadId);

                try {
                  let prevPath = null;
                  try {
                    const blocksApi = instanceRef.current?.blocks;
                    const curIndex =
                      typeof blocksApi?.getCurrentBlockIndex === "function"
                        ? blocksApi.getCurrentBlockIndex()
                        : null;

                    if (curIndex !== null && typeof blocksApi?.getBlockByIndex === "function") {
                      const block = blocksApi.getBlockByIndex(curIndex);
                      prevPath = block?.data?.file?.path ?? null;
                    }
                  } catch (err) {
                    console.warn("Could not determine previous attachment path:", err);
                  }

                  const uploaded = await uploadToFirebase(file, "blog-files", blogId || "temp");

                  // Delete previous if exists
                  if (prevPath) {
                    try {
                      await deleteFromFirebase(prevPath);
                    } catch (err) {
                      console.warn("Failed to delete previous attachment:", err);
                    }
                  }

                  removeUploading(uploadId);

                  return {
                    success: 1,
                    file: {
                      url: uploaded.url,
                      name: uploaded.name,
                      size: uploaded.size,
                      path: uploaded.path,
                      extension: uploaded.name.split(".").pop(),
                    },
                  };
                } catch (err) {
                  removeUploading(uploadId);
                  console.error("Attachment upload error:", err);
                  return { success: 0, error: err?.message || "Upload failed" };
                }
              },
            },
            buttonText: "Select file to upload",
            errorMessage: "File upload failed",
          },
        },
      }, // end tools
    }); // end new EditorJS

    // cleanup on unmount
    return () => {
      mounted = false;
      if (instanceRef.current && typeof instanceRef.current.destroy === "function") {
        instanceRef.current.destroy();
      }
      instanceRef.current = null;
    };
  }, [readOnly, blogId, onChange]); // init only once realistically; dependencies won't cause re-init because instanceRef prevents.

  // Render initial data only once after editor is ready
  useEffect(() => {
    if (!isReady || initialLoadedRef.current) return;
    if (!instanceRef.current) return;

    const payload = normalizeInitialData(data);
    if (!payload) {
      initialLoadedRef.current = true;
      return;
    }

    instanceRef.current
      .render(payload)
      .then(() => {
        initialLoadedRef.current = true;
      })
      .catch((err) => {
        console.error("Failed to render initial data:", err);
        initialLoadedRef.current = true;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]); // run when ready only

  return (
    <div className="relative w-full">
      {/* Upload indicator */}
      {uploadingFiles.size > 0 && (
        <div
          className="fixed top-4 right-4 z-50 px-4 py-3 bg-blue-600 text-white rounded-md flex items-center gap-2 shadow-lg"
          role="status"
        >
          <div className="animate-spin h-5 w-5 rounded-full border-2 border-white border-t-transparent" />
          <span>Uploading {uploadingFiles.size} file{uploadingFiles.size > 1 ? "s" : ""}...</span>
        </div>
      )}

      <div
        id="editorjs"
        ref={editorHolderRef}
        className="editorjs-container min-h-[400px] bg-white rounded border border-gray-200 p-4"
      />

      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded">
          <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
};

export default EditorJsFirebase;
