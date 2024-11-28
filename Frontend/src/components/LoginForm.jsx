import { 
    Box, Button, Input, VStack, Center, Text, Alert, AlertIcon, FormControl, 
    FormLabel, FormErrorMessage, ScaleFade, Slide 
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../contexts/AuthContext';

function LoginForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    // const [username, setUsername] = useState('');
    // const [password, setPassword] = useState('');
    const { login, user } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        
        try {
            const {username, password} = data;
            const response = await axios.post("http://localhost:3001/auth/login",
            { username, password }, {withCredentials: true });
            if (response.status === 200) {
                login(response.data);
                setSuccessMessage('Logged in successfully, redirecting...');
                setErrorMessage('');
                setShowSuccess(true);
                setShowError(false);

                setTimeout(() => navigate('/'), 3000);

            }
            else {
                throw new Error('Log in failed');
            }
        }
        catch (error) {
            console.error('Log in Failed: ', error);
            setErrorMessage('Log in failed. Please try again.');
            setSuccessMessage('');
            setShowSuccess(false);
            setShowError(true);
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Helmet>
                <title>Login - CoDom</title>
                <meta name="description" content="Log in to MyApp and start collaborating on code!" />
            </Helmet>

            <Box maxW="sm" mx="auto" mt="10">
                <Center>
                    <Text as='b' fontSize='5xl'>
                        Log in
                    </Text>
                </Center>

                {/* Success message with ScaleFade animation */}
                {showSuccess && (
                    <ScaleFade in={showSuccess} initialScale={0.9}>
                        <Alert status="success" mt={4}>
                            <AlertIcon />
                            {successMessage}
                        </Alert>
                    </ScaleFade>
                )}

                {/* Error message with Slide animation */}
                {showError && (
                    <Slide direction="bottom" in={showError} style={{ zIndex: 10 }}>
                        <Alert status="error" mt={4}>
                            <AlertIcon />
                            {errorMessage}
                        </Alert>
                    </Slide>
                )}
               

                <VStack spacing={4} as='form' onSubmit={handleSubmit(onSubmit)} mt={4}>

                    <FormControl isInvalid={errors.username}>
                        <FormLabel>Username</FormLabel>
                        <Input {...register('username', { required: 'Username is required' })} />
                        {errors.username && <FormErrorMessage>{errors.username.message}</FormErrorMessage>}
                    </FormControl>

                    <FormControl isInvalid={errors.password}>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" {...register('password', { required: 'Password is required' })} />
                        {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
                    </FormControl>


                    <Button
                        colorScheme="blue"
                        type="submit"
                        isLoading={isLoading}
                        loadingText="Logging in..."
                        isDisabled={isLoading}
                    >
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

