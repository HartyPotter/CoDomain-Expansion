import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { Editor } from "./Editor";
import { useRef, useState, useEffect } from "react";
import { Type } from './utils/file-manager'
import { io } from "socket.io-client"; // Import socket.io-client
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import TerminalComponent from './Terminal';
import DiffMatchPatch from 'diff-match-patch';
import styled from '@emotion/styled';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* Aligns children (button) to the right */
  padding: 10px; /* Adds some space around the button */
`;

const Workspace = styled.div`
  display: flex;
  margin: 0;
  font-size: 16px;
  width: 100%;
`;

const LeftPanel = styled.div`
  flex: 1;
  width: 60%;
`;

const RightPanel = styled.div`
  flex: 1;
  width: 40%;
`;


const CodingPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { state } = useLocation(); // Get the state from the location
    const [value, setValue] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [fileStructure, setFileStructure] = useState([]);
    const [selectedFile, setSelectedFile] = useState(undefined);

    const [socket, setSocket] = useState(null); // State to hold socket
    const volume = state?.volume;
    const image = state?.image;
    const dmp = new DiffMatchPatch();

    useEffect(() => {
        // Initialize socket when component mounts
        
        const newSocket = io('http://localhost:3001/code-execution', {
            query: {
                volumeName: volume,
                image: image
            }
        });
        setSocket(newSocket);

        // Cleanup socket on component unmount
        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('connected', (mainDirContent) => {
                
                // console.log("Connected to server");
                setLoaded(true);
                setFileStructure(mainDirContent);
                console.log('Connected to WebSocket server');
                socket.emit('start');
            });

            socket.on('fileCreated', (newFile) => {
                console.log("File created: ", newFile);
                // setFileStructure((prev) => [...prev, newFile]);
            });
    
            socket.on('dirCreated', (newDir) => {
                console.log("File created: ", newFile);
                // setFileStructure((prev) => [...prev, newDir]);
            });
        }

    }, [socket]);
    const onSelect = (file) => {
        console.log("Called onSelect: ", file);
        if (file.type === Type.DIRECTORY) {
            socket.emit("fetchDir", file.path, (data) => {
                setFileStructure(prev => {
                    const allFiles = [...prev, ...data];
                    return allFiles.filter((file, index, self) => 
                        index === self.findIndex(f => f.path === file.path)
                    );
                });
            });
        }
        else {
            socket.emit("fetchContent", file.path, (data) => {
                // console.log("File content: ", data);
                file.content = data;
                setSelectedFile(file);
                setValue(data);
            });
        }
    };

    // const handleLogout = async () => {
    //     const token = localStorage.getItem('accessToken');
    //     logout(token);
    //     navigate("/");
    // }

    const onChange = async (newCode, path) => {
        const diffs = dmp.patch_make(value, newCode);
        socket.emit('updateFileData', diffs, path);
        setValue(newCode);
    }

    const handleCreateFile = () => {
        const fileName = prompt("Enter the new file name:");
        if (fileName) {
            const currentPath = selectedFile.path.slice(0, selectedFile.path.lastIndexOf('/'));
            socket.emit('createFile',  fileName, currentPath);
        }
        else {
            console.log("No file name entered");
        }
    };

    const handleCreateDir = () => {
        const dirName = prompt("Enter the new directory name:");
        if (dirName) {
            const currentPath = selectedFile.path.slice(0, selectedFile.path.lastIndexOf('/'));
            socket.emit('createDir', dirName, currentPath);
        }
        else {
            console.log("No file name entered");
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    if (!loaded) {
        return "Loading...";
    }

    return (
        <Container>
            {/* <ButtonContainer>
                <button onClick={() => setShowOutput(!showOutput)}>See output</button>
            </ButtonContainer> */}
            <Workspace>
                <LeftPanel>
                    <Editor 
                    socket={socket} 
                    selectedFile={selectedFile} 
                    onSelect={onSelect} 
                    files={fileStructure}
                    onChange={onChange}   
                    onCreateFile={handleCreateFile}
                    onCreateDir={handleCreateDir} 
                    />
                </LeftPanel>
                <RightPanel>
                    <TerminalComponent volume={volume} image={image} code={value} socket={socket}/>
                </RightPanel>
            </Workspace>
        </Container>
    )
}

export default CodingPage;