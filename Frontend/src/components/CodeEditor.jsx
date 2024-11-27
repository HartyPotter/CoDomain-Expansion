import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client"; // Import socket.io-client
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from 'react-helmet';
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


const CodeEditor = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { state } = useLocation(); // Get the state from the location
    const editorRef = useRef()
    const [value, setValue] = useState("")
    const [fileStructure, setFileStructure] = useState([]);
    const [language, setLanguage] = useState('javascript')
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
                // setLoaded(true);
                setFileStructure(mainDirContent);
            });
        }
    }, [socket]);

    const onMount = (editor) => {
        setValue(CODE_SNIPPETS[language]);
        editorRef.current = editor;
        editor.focus();
    };

    // const onSelect = (language) => {
    //     setLanguage(language);
    //     setValue(CODE_SNIPPETS[language]);
    // };

    const onSelect = (file) => {
        if (file.type === 'dir') {
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
            socket.emit("fetchContent", { path: file.path }, (data) => {
                file.content = data;
                setSelectedFile(file);
            });
        }
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('accessToken');
        logout(token);
        navigate("/");
    }

    const onChange = async (newCode) => {
        // console.log(value);
        const diffs = dmp.patch_make(value, newCode);
        // console.log(diffs);
        socket.emit('updateFileData', diffs);
        setValue(newCode);
    }

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <Container>
            {/* <ButtonContainer>
                <button onClick={() => setShowOutput(!showOutput)}>See output</button>
            </ButtonContainer> */}
            <Workspace>
                <LeftPanel>
                <Box w="50%">
                        <LanguageSelector language={language} onSelect={onSelect}/>
                        <Editor
                        height="75vh"
                        theme="vs-dark"
                        language={language}
                        defaultValue={CODE_SNIPPETS[language]}
                        onMount={onMount}
                        value={value}
                        onChange={(value) => onChange(value)} />
                    </Box>
                </LeftPanel>
                <RightPanel>
                    <Box w="50%">
                        <TerminalComponent volume={volume} image={image} code={value} socket={socket}/>
                    </Box>
                </RightPanel>
            </Workspace>
        </Container>
        
        // <>
        //     <Helmet>
        //         <title>Code Editor - CoDom</title>
        //         <meta name="description" content="Write and execute code online!" />
        //     </Helmet>
        //     <Box>
        //         <HStack justifyContent="space-between" p={4}>
        //             <Text>Welcome, {user.username}!</Text>
        //             <Button colorScheme="blue" onClick={handleLogout}>Logout</Button>
        //         </HStack>
        //         <HStack spacing={4}>
        //             <Box w="50%">
        //                 <LanguageSelector language={language} onSelect={onSelect}/>
        //                 <Editor
        //                 height="75vh"
        //                 theme="vs-dark"
        //                 language={language}
        //                 defaultValue={CODE_SNIPPETS[language]}
        //                 onMount={onMount}
        //                 value={value}
        //                 onChange={(value) => onChange(value)} />
        //             </Box>
        //             <Box w="50%">
        //                 <TerminalComponent volume={volume} image={image} code={value} socket={socket}/>
        //             </Box>
        //         </HStack>
        //     </Box>
        // </>
    )
}

export default CodeEditor;