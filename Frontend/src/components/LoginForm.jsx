import { Box, Button, Input, VStack, color , Text, Center} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { Helmet } from 'react-helmet';


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
        <>
        <Helmet>
            <title>Login - CoDom</title>
            <meta name="description" content="Sign up for MyApp and start collaborating on code!" />
        </Helmet>

        <Box maxW="sm" mx="auto" mt="10">
            <Center>
                <Text as='b' fontSize='5xl'>Log in</Text>
            </Center>
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
        </>
    );
}

export default LoginForm;