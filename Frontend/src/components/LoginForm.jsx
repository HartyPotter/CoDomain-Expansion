import { Box, Button, Input, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import CodeEditor from "./CodeEditor.jsx";

function LoginForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async() => {
        try {
            const {data : result} = await axios.post("http://localhost:3001/auth/login", {username, password});
            // Redirect to Code Editor
            navigate("/code-editor", { state: {accessToken: result.accessToken} });

        }
        catch (error) {
            console.log('Login Failed: ', error);
        }
    }

    return (
        <Box maxW="sm" mx="auto" mt="10">
            <VStack spacing={4}>
                <Input placeholder="Username" size="md" value={username}
                       onChange={(e) => setUsername(e.target.value)} />
                <Input placeholder="Password" size="md" type="password" value={password}
                       onChange={(e) => setPassword(e.target.value)} />
                <Button colorScheme="blue" onClick={handleLogin}>
                    Login
                </Button>
                <Button variant="link" onClick={() => navigate("/register")}>
                    Don't have an account? Register
                </Button>
            </VStack>
        </Box>
    );
}

export default LoginForm;