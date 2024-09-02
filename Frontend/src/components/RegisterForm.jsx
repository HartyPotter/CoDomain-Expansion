import { Box, Button, Input, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import CodeEditor from "./CodeEditor.jsx";

function RegisterForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleRegister = async() => {
        try {
            const {data : result} = await axios.post("http://localhost:3001/auth/register", {username, email, password});
            // Redirect to Code Editor
            navigate("/code-editor", { state: {accessToken: result.accessToken} });
        }
        catch (error) {
            console.log('SignUp Failed: ', error);
        }
    }

    return (
        <Box maxW="sm" mx="auto" mt="10">
            <VStack spacing={4}>
                <Input placeholder="Username" size="md" value={username}
                       onChange={(e) => setUsername(e.target.value)} />
                <Input placeholder="Email" size="md" value={email}
                       onChange={(e) => setEmail(e.target.value)} />/
                <Input placeholder="Password" size="md" type="password" value={password}
                       onChange={(e) => setPassword(e.target.value)} />
                <Button colorScheme="blue" onClick={handleRegister}>
                    Register
                </Button>
                <Button variant="link" onClick={() => navigate("/register")}>
                    Already have an account? Login
                </Button>
            </VStack>
        </Box>
    );
}

export default RegisterForm;