import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client"; // Import socket.io-client
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { useAuth } from '../contexts/AuthContext';
import TerminalComponent from './Terminal';
import DiffMatchPatch from 'diff-match-patch';


const CodeEditor = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const editorRef = useRef()
    const [value, setValue] = useState("")
    const [language, setLanguage] = useState('javascript')
    const [socket, setSocket] = useState(null); // State to hold socket
    const { volume, image } = location.state || {};
    const dmp = new DiffMatchPatch();

    useEffect(() => {
        // Initialize socket when component mounts
        const newSocket = io('http://localhost:3001/code-execution');
        setSocket(newSocket);

        // Cleanup socket on component unmount
        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);

    const onMount = (editor) => {
        setValue(CODE_SNIPPETS[language]);
        editorRef.current = editor;
        editor.focus();
    };

    const onSelect = (language) => {
        setLanguage(language);
        setValue(CODE_SNIPPETS[language]);
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
        <>
            <Helmet>
                <title>Code Editor - CoDom</title>
                <meta name="description" content="Write and execute code online!" />
            </Helmet>
            <Box>
                <HStack justifyContent="space-between" p={4}>
                    <Text>Welcome, {user.username}!</Text>
                    <Button colorScheme="blue" onClick={handleLogout}>Logout</Button>
                </HStack>
                <HStack spacing={4}>
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
                    <Box w="50%">
                        <TerminalComponent volume={volume} image={image} code={value} socket={socket}/>
                    </Box>
                </HStack>
            </Box>
        </>
    )
}

export default CodeEditor;