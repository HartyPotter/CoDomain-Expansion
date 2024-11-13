import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { useAuth } from '../contexts/AuthContext';
import TerminalComponent from './Terminal';

const CodeEditor = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const editorRef = useRef()
    const [value, setValue] = useState("")
    const [language, setLanguage] = useState('javascript')
    const { volume, image } = location.state || {};

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    };

    const onSelect = (language) => {
        setLanguage(language);
        setValue(CODE_SNIPPETS[language]);
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('accessToken');
        console.log(token)
        logout(token);
        navigate("/");
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
                        onChange={(value) => setValue(value)} />
                    </Box>
                    <Box w="50%">
                        <TerminalComponent volume={volume} image={image} code={value}/>
                    </Box>
                </HStack>
            </Box>
        </>
    )
}

export default CodeEditor;