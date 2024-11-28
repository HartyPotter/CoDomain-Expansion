import React, { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { File } from "../utils/file-manager";
import { Socket } from "socket.io-client";

export const Code = ({ selectedFile, socket, onChange }: { selectedFile: File | undefined, socket: Socket, onChange: (value: string) => void }) => {
  if (!selectedFile) {
    return <div>No file selected</div>;
  }

  const code = selectedFile.content
  let language = selectedFile.name.split('.').pop()

  if (language === "js" || language === "jsx")
    language = "javascript";
  else if (language === "ts" || language === "tsx")
    language = "typescript"
  else if (language === "py" )
    language = "python"

    function debounce(func: (value: string) => void, wait: number) {
      let timeout: number;
      return (value: string) => {
        clearTimeout(timeout);
        setTimeout(() => {
          func(value);
        }, wait);
      };
    }

  return (
      <Editor
        height="100vh"
        language={language}
        value={code}
        theme="vs-dark"
      />
  )
}
