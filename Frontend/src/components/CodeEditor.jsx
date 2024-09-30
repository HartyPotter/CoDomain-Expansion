import { Box, Button, HStack, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { useAuth } from '../contexts/AuthContext';

const CodeEditor = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const editorRef = useRef()
    const [value, setValue] = useState("")
    const [language, setLanguage] = useState('javascript')

    const bgColor = useColorModeValue("background.primary", "gray.800");
    const editorBgColor = useColorModeValue("background.secondary", "gray.700");

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
            <Box bg={bgColor} minH="100vh" p={4}>
                <VStack spacing={4} align="stretch">
                    <HStack justifyContent="space-between">
                        <Text fontSize="2xl" fontWeight="bold">Welcome, {user.username}!</Text>
                        <Button colorScheme="blue" onClick={handleLogout}>Logout</Button>
                    </HStack>
                    <HStack spacing={4} align="stretch">
                        <Box w="50%" bg={editorBgColor} borderRadius="md" overflow="hidden">
                            <VStack align="stretch" h="full">
                                <LanguageSelector language={language} onSelect={onSelect}/>
                                <Box flex={1}>
                                    <Editor
                                        height="100%"
                                        theme="vs-dark"
                                        language={language}
                                        defaultValue={CODE_SNIPPETS[language]}
                                        onMount={onMount}
                                        value={value}
                                        onChange={(value) => setValue(value)}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            lineNumbers: 'on',
                                            roundedSelection: false,
                                            scrollBeyondLastLine: false,
                                            readOnly: false
                                        }}
                                    />
                                </Box>
                            </VStack>
                        </Box>
                        <Output editorRef={editorRef} language={language} />
                    </HStack>
                </VStack>
            </Box>
        </>
    )
}

export default CodeEditor;