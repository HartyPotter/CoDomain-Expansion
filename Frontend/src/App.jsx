import { Box } from '@chakra-ui/react';
import {BrowserRouter, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import LoginForm from './components/LoginForm';
import CodeEditor from "./components/CodeEditor.jsx";
import RegisterForm from './components/RegisterForm';
import LandingPage from './components/LandingPage.jsx';

function App() {
    return (
    <Box minH="100vh" bg="#0f0a19" color="gray.500" px={6} py={8}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/code-editor" element={<CodeEditor/>} />
            </Routes>
        </BrowserRouter>
    </Box>
    );
}

export default App;
