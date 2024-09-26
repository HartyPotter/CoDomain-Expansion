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

function RegisterForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const { user } = useAuth();

    // Redirect to home page if user is already logged in
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const { username, email, password, first_name, last_name, age } = data;
            const response = await axios.post('http://localhost:3001/auth/register', {
                first_name,
                last_name,
                age: parseInt(age),
                username,
                email,
                password,
            });

            if (response.status === 201) {
                setSuccessMessage('User created successfully. You can now login.');
                setErrorMessage('');
                setShowSuccess(true);
                setShowError(false);

                // Optionally navigate to login page after a delay
                setTimeout(() => navigate('/login'), 3000);
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error('Registration Failed: ', error);
            setErrorMessage('Registration failed. Please try again.');
            setSuccessMessage('');
            setShowSuccess(false);
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Register - CoDom</title>
                <meta name="description" content="Sign up for MyApp and start collaborating on code!" />
            </Helmet>

            <Box maxW="sm" mx="auto" mt="10">
                <Center>
                    <Text as="b" fontSize="5xl">
                        Sign up
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

                <VStack spacing={4} as="form" onSubmit={handleSubmit(onSubmit)} mt={6}>
                    <FormControl isInvalid={errors.first_name}>
                        <FormLabel>First Name</FormLabel>
                        <Input {...register('first_name', { required: 'First name is required' })} />
                        {errors.first_name && <FormErrorMessage>{errors.first_name.message}</FormErrorMessage>}
                    </FormControl>

                    <FormControl isInvalid={errors.last_name}>
                        <FormLabel>Last Name</FormLabel>
                        <Input {...register('last_name', { required: 'Last name is required' })} />
                        {errors.last_name && <FormErrorMessage>{errors.last_name.message}</FormErrorMessage>}
                    </FormControl>

                    <FormControl isInvalid={errors.age}>
                        <FormLabel>Age</FormLabel>
                        <Input {...register('age', {
                            required: 'Age is required',
                            pattern: { value: /^[0-9]+$/, message: 'Age must be a number' },
                        })} />
                        {errors.age && <FormErrorMessage>{errors.age.message}</FormErrorMessage>}
                    </FormControl>

                    <FormControl isInvalid={errors.username}>
                        <FormLabel>Username</FormLabel>
                        <Input {...register('username', { required: 'Username is required' })} />
                        {errors.username && <FormErrorMessage>{errors.username.message}</FormErrorMessage>}
                    </FormControl>

                    <FormControl isInvalid={errors.email}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /\S+@\S+\.\S+/, message: 'Email is invalid' },
                            })}
                        />
                        {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
                    </FormControl>

                    <FormControl isInvalid={errors.password}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
                    </FormControl>

                    {/* Show Spinner when form is submitting */}
                    <Button
                        colorScheme="blue"
                        type="submit"
                        isLoading={isLoading}
                        loadingText="Submitting..."
                        isDisabled={isLoading}
                    >
                        Register
                    </Button>

                    {/* Link to navigate to login */}
                    <Button variant="link" onClick={() => navigate('/login')}>
                        Already have an account? Login
                    </Button>
                </VStack>
            </Box>
        </>
    );
}

export default RegisterForm;
