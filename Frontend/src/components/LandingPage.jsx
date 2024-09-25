import { Box, Heading, Text, Button, VStack, HStack, Center, Image } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LandingPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Add user and logout from useAuth

  return (
    <Box>
      {/* Header Section */}
      <Box as="header" bg="blue.500" color="white" py={4}>
        <HStack justify="space-between" maxW="1200px" mx="auto" px={4}>
          <Heading size="lg">Codomain Expansion</Heading>
          <HStack spacing={4}>
            <Link to="/">Home</Link>
            {user ? (
              <>
                <Text>Welcome, {user.username}!</Text>
                <Button onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
              </>
            )}
          </HStack>
        </HStack>
      </Box>

      {/* Hero Section */}
      <Box as="section" bg="gray.100" py={20}>
        <Center>
          <VStack spacing={6} maxW="800px" textAlign="center">
            <Heading as="h1" size="2xl">Welcome to Codomain Expansion</Heading>
            <Text fontSize="xl">
              A collaborative coding platform where you can write, share, and execute code online.
              {user ? " Start coding now!" : " Sign up to start collaborating today!"}
            </Text>
            <HStack spacing={4}>
              {user ? (
                <Button colorScheme="blue" size="lg" onClick={() => navigate('/code-editor')}>Go to Code Editor</Button>
              ) : (
                <>
                  <Button colorScheme="blue" size="lg" onClick={() => navigate('/register')}>Get Started</Button>
                  <Button variant="outline" colorScheme="blue" size="lg" onClick={() => navigate('/login')}>Login</Button>
                </>
              )}
            </HStack>
          </VStack>
        </Center>
      </Box>

      {/* Features Section */}
      <Box as="section" py={20}>
        <Center>
          <VStack spacing={10} maxW="1000px">
            <Heading as="h2" size="xl">Why Choose us?</Heading>
            <HStack spacing={8}>
              <VStack>
                <Image
                  boxSize="150px"
                  src="https://via.placeholder.com/150"
                  alt="Feature 1"
                />
                <Text fontWeight="bold" fontSize="lg">Real-time Collaboration</Text>
                <Text textAlign="center">
                  Collaborate on code in real time with your peers. Share code snippets and learn together.
                </Text>
              </VStack>

              <VStack>
                <Image
                  boxSize="150px"
                  src="https://via.placeholder.com/150"
                  alt="Feature 2"
                />
                <Text fontWeight="bold" fontSize="lg">Cloud Code Execution</Text>
                <Text textAlign="center">
                  Write and execute code directly in the cloud without setting up any local environment.
                </Text>
              </VStack>

              <VStack>
                <Image
                  boxSize="150px"
                  src="https://via.placeholder.com/150"
                  alt="Feature 3"
                />
                <Text fontWeight="bold" fontSize="lg">Wide Language Support</Text>
                <Text textAlign="center">
                  Supports a wide range of programming languages including Python, JavaScript, C++, and more.
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </Center>
      </Box>

      {/* Call-to-Action Section */}
      <Box as="section" bg="blue.500" color="white" py={10}>
        <Center>
          <VStack spacing={4}>
            <Heading as="h3" size="lg">Ready to start coding?</Heading>
            <Button colorScheme="whiteAlpha" size="lg" onClick={() => navigate('/register')}>Sign Up for Free</Button>
          </VStack>
        </Center>
      </Box>

      {/* Footer */}
      <Box as="footer" bg="gray.900" color="white" py={10}>
        <Center>
          <VStack spacing={4}>
            <Text>&copy; {new Date().getFullYear()} Peter + Harty. All rights reserved.</Text>
            <HStack spacing={4}>
              <Link to="/">Home</Link>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </HStack>
          </VStack>
        </Center>
      </Box>
    </Box>
  );
}

export default LandingPage;
