import { 
    Box, Button, Input, VStack, Text, Alert, AlertIcon, FormControl, 
    FormLabel, FormErrorMessage, ScaleFade, Slide, Container, Heading, useColorModeValue
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

function LoginForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login, user } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const bgColor = useColorModeValue("background.primary", "gray.800");
    const cardBgColor = useColorModeValue("background.secondary", "gray.700");

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
                <meta name="description" content="Log in to CoDom and start collaborating on code!" />
            </Helmet>

            <Box bg={bgColor} minH="100vh" py={10}>
                <Container maxW="md">
                    <MotionBox
                        bg={cardBgColor}
                        p={8}
                        borderRadius="lg"
                        boxShadow="xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <VStack spacing={6}>
                            <Heading as="h1" size="xl">Log in</Heading>

                            {showSuccess && (
                                <ScaleFade initialScale={0.9} in={showSuccess}>
                                    <Alert status="success">
                                        <AlertIcon />
                                        {successMessage}
                                    </Alert>
                                </ScaleFade>
                            )}

                            {showError && (
                                <Slide direction="bottom" in={showError}>
                                    <Alert status="error">
                                        <AlertIcon />
                                        {errorMessage}
                                    </Alert>
                                </Slide>
                            )}

                            <VStack spacing={4} as="form" onSubmit={handleSubmit(onSubmit)} w="100%">
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
                                    w="100%"
                                >
                                    Login
                                </Button>

                                <Button variant="link" onClick={() => navigate("/register")}>
                                    Don't have an account? Register
                                </Button>
                            </VStack>
                        </VStack>
                    </MotionBox>
                </Container>
            </Box>
        </>
    );
}

export default LoginForm;