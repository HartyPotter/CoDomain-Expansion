import { Box, Button, Input, VStack, Center, Text, Alert, AlertIcon, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { Helmet } from 'react-helmet';



function RegisterForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (data) => {
        try {
            const { username, email, password, first_name, last_name, age } = data;
            const { data: result } = await axios.post('http://localhost:3001/auth/register', {
                username,
                email,
                password,
                first_name,
                last_name,
                age: Number(age),
            });
            // Redirect to Code Editor
            navigate('/code-editor', { state: { accessToken: result.accessToken } });
        } catch (error) {
            console.log('SignUp Failed: ', error);
            setErrorMessage('Registration failed. Please try again.');
        }
    };

    return (
        <>
      {/* React Helmet for changing the page title and meta tags */}
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
            {errorMessage && (
                <Alert status="error">
                    <AlertIcon />
                    {errorMessage}
                </Alert>
            )}
            <VStack spacing={4} as="form" onSubmit={handleSubmit(onSubmit)}>
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
                    <Input {...register('age', { required: 'Age is required', pattern: { value: /^[0-9]+$/, message: 'Age must be a number' } })} />
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

                <Button colorScheme="blue" type="submit">
                    Register
                </Button>
                <Button variant="link" onClick={() => navigate('/login')}>
                    Already have an account? Login
                </Button>
            </VStack>
        </Box>
        </>
    );
}

export default RegisterForm;
