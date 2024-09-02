import {Box, Button, HStack} from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import { useLocation } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import axios from "axios";


const CodeEditor = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { accessToken } = location.state || {};  // Retrieve the accessToken
    const editorRef = useRef()
    const [value, setValue] = useState("")
    const [language, setLanguage] = useState('javascript')

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    };

    const onSelect = (language) => {
        setLanguage(language);
        setValue(CODE_SNIPPETS[language]);
    };

    const handleLogout = async() => {
        console.log("1");
        await axios.post("http://localhost:3001/auth/logout", {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        localStorage.removeItem('accessToken');
        console.log("2");
        navigate("/");
    }

    return (
        <Box>
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
                <Output editorRef={editorRef} language={language} accessToken={accessToken}/>
            </HStack>
            <Button colorScheme="blue" onClick={handleLogout}>Logout</Button>
        </Box>
    )
}

export default CodeEditor;