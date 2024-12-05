import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./utils/sidebar";
import { Code } from "./utils/code";
import styled from "@emotion/styled";
import { File, buildFileTree, RemoteFile } from "./utils/file-manager";
import { FileTree } from "./utils/file-tree";
import { Socket } from "socket.io-client";

// credits - https://codesandbox.io/s/monaco-tree-pec7u
// 
export const Editor = ({
    files,
    onSelect,
    selectedFile,
    socket,
    onChange,
    onCreateFile,
    onCreateDir
}: {
    files: RemoteFile[];
    onSelect: (file: File) => void;
    selectedFile: File | undefined;
    socket: Socket;
    onChange: (value: string | undefined, path : string) => void;
    onCreateFile: () => void;
    onCreateDir: () => void;
}) => {
  const rootDir = useMemo(() => {
    return buildFileTree(files);
  }, [files]);

  useEffect(() => {
    if (!selectedFile) {
      // console.log("Selecting first file");
      // console.log(rootDir);
      onSelect(rootDir.files[0])
    }
  }, [selectedFile])

  return (
    <div>
      <Main>
        <Sidebar>
          <FileTree
            rootDir={rootDir}
            selectedFile={selectedFile}
            onSelect={onSelect}
            onCreateFile={onCreateFile}
            onCreateDir={onCreateDir}
          />
        </Sidebar>
        <Code 
        socket={socket} 
        selectedFile={selectedFile} 
        onChange={onChange}
        />
      </Main>
    </div>
  );
};

const Main = styled.main`
  display: flex;
`;