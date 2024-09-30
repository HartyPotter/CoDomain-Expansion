import { Box, Heading, Text, Button, VStack, HStack, Center, Image, Container, useColorModeValue } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

function LandingPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const bgColor = useColorModeValue("background.primary", "gray.800");
  const headerBgColor = useColorModeValue("brand.700", "brand.800");

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Header Section */}
      <Box as="header" bg={headerBgColor} color="white" py={4} boxShadow="md">
        <Container maxW="container.xl">
          <HStack justify="space-between">
            <Heading size="lg">Codomain Expansion</Heading>
            <HStack spacing={4}>
              <Link to="/">Home</Link>
              {user ? (
                <>
                  <Text>Welcome, {user.username}!</Text>
                  <Button onClick={logout} variant="outline" colorScheme="whiteAlpha">Logout</Button>
                </>
              ) : (
                <>
                  <Button onClick={() => navigate('/register')} variant="ghost">Register</Button>
                  <Button onClick={() => navigate('/login')} variant="solid" colorScheme="blue">Login</Button>
                </>
              )}
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Hero Section */}
      <MotionBox
        as="section"
        py={20}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container maxW="container.xl">
          <VStack spacing={6} align="center" textAlign="center">
            <Heading as="h1" size="2xl">Welcome to Codomain Expansion</Heading>
            <Text fontSize="xl" maxW="2xl">
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
        </Container>
      </MotionBox>

      {/* Features Section */}
      <Box as="section" py={20}>
        <Container maxW="container.xl">
          <VStack spacing={10}>
            <Heading as="h2" size="xl">Why Choose Us?</Heading>
            <HStack spacing={8} alignItems="flex-start">
              {[
                {
                  title: "Real-time Collaboration",
                  description: "Collaborate on code in real time with your peers. Share code snippets and learn together.",
                  icon: "🤝",
                },
                {
                  title: "Cloud Code Execution",
                  description: "Write and execute code directly in the cloud without setting up any local environment.",
                  icon: "☁️",
                },
                {
                  title: "Wide Language Support",
                  description: "Supports a wide range of programming languages including Python, JavaScript, C++, and more.",
                  icon: "🌐",
                },
              ].map((feature, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  maxW="sm"
                >
                  <VStack align="center" spacing={4}>
                    <Text fontSize="5xl">{feature.icon}</Text>
                    <Text fontWeight="bold" fontSize="lg">{feature.title}</Text>
                    <Text textAlign="center">{feature.description}</Text>
                  </VStack>
                </MotionBox>
              ))}
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Call-to-Action Section */}
      <Box as="section" bg="brand.700" color="white" py={10}>
        <Container maxW="container.xl">
          <Center>
            <VStack spacing={4}>
              <Heading as="h3" size="lg">Ready to start coding?</Heading>
              <Button colorScheme="whiteAlpha" size="lg" onClick={() => navigate('/register')}>Sign Up for Free</Button>
            </VStack>
          </Center>
        </Container>
      </Box>

      {/* Footer */}
      <Box as="footer" bg="background.secondary" color="white" py={10}>
        <Container maxW="container.xl">
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
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;