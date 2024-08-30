import { Box } from '@chakra-ui/react';
import {BrowserRouter, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import LoginForm from './components/LoginForm';
import CodeEditor from "./components/CodeEditor.jsx";
import RegisterForm from './components/RegisterForm';

function App() {
    return (
    <Box minH="100vh" bg="#0f0a19" color="gray.500" px={6} py={8}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/code-editor" element={<CodeEditor/>} />
            </Routes>
        </BrowserRouter>
    </Box>
    );
}

export default App;
