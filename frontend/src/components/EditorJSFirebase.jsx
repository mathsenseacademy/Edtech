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

// Firebase utils
import { uploadToFirebase, deleteFromFirebase } from "../utils/firebaseStorage";

// Load Editor CSS (important)
import "../styles/editor.css";

const EditorJsFirebase = ({ data, onChange, blogId, readOnly = false }) => {
  const editorRef = useRef(null);
  const instanceRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!editorRef.current || instanceRef.current) return; // ⛔ Prevent double initialization

    const editor = new EditorJS({
      holder: editorRef.current,
      readOnly,
      autofocus: !readOnly,
      data: data || { blocks: [] },

      onChange: async () => {
        if (!readOnly && onChange) {
          const content = await editor.save();
          onChange(content);
        }
      },

      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            placeholder: "Enter a heading",
          },
        },

        list: { class: List, inlineToolbar: true },
        checklist: { class: Checklist, inlineToolbar: true },
        quote: { class: Quote, inlineToolbar: true },
        code: { class: Code },
        inlineCode: { class: InlineCode },
        delimiter: Delimiter,
        marker: Marker,
        table: { class: Table, inlineToolbar: true },

        warning: { class: Warning },

        embed: {
          class: Embed,
          config: { services: { youtube: true } },
        },

        // -----------------------------
        // IMAGE UPLOADER (with REPLACE)
        // -----------------------------
        image: {
          class: ImageTool,
          inlineToolbar: true,

          config: {
            uploader: {
              async uploadByFile(file) {
                setUploading(true);

                // Find previous file path (for replacement)
                const currentBlock =
                  instanceRef.current?.blocks.getCurrentBlock();
                const prevPath = currentBlock?.data?.file?.path;

                // Upload new file
                const uploaded = await uploadToFirebase(
                  file,
                  "blog-images",
                  blogId || "temp"
                );

                // Delete previous file if replaced
                if (prevPath) {
                  try {
                    await deleteFromFirebase(prevPath);
                  } catch (err) {
                    console.warn("Failed to delete previous image:", err);
                  }
                }

                setUploading(false);

                return {
                  success: 1,
                  file: {
                    url: uploaded.url,
                    name: uploaded.name,
                    size: uploaded.size,
                    path: uploaded.path,
                  },
                };
              },
            },

            captionPlaceholder: "Add caption",
          },
        },

        // -----------------------------
        // FILE UPLOADER (PDFs, Docs)
        // -----------------------------
        attaches: {
          class: AttachesTool,

          config: {
            uploader: {
              async uploadByFile(file) {
                setUploading(true);

                const currentBlock =
                  instanceRef.current?.blocks.getCurrentBlock();
                const prevPath = currentBlock?.data?.file?.path;

                const uploaded = await uploadToFirebase(
                  file,
                  "blog-files",
                  blogId || "temp"
                );

                if (prevPath) {
                  try {
                    await deleteFromFirebase(prevPath);
                  } catch (err) {
                    console.warn("Failed to delete old file:", err);
                  }
                }

                setUploading(false);

                return {
                  success: 1,
                  file: {
                    url: uploaded.url,
                    name: uploaded.name,
                    size: uploaded.size,
                    extension: uploaded.name.split(".").pop(),
                    path: uploaded.path,
                  },
                };
              },
            },
          },
        },
      },

      placeholder: "Start writing your blog post...",
    });

    instanceRef.current = editor;

    return () => {
      if (instanceRef.current?.destroy) {
        instanceRef.current.destroy();
      }
      instanceRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* Uploading Indicator */}
      {uploading && (
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-20">
          Uploading...
        </div>
      )}

      <div
        ref={editorRef}
        className="editorjs-container min-h-[400px]"
      ></div>
    </div>
  );
};

export default EditorJsFirebase;
