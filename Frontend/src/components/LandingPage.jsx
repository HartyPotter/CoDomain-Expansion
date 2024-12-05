import { Box, Heading, Text, Grid, GridItem, Button, VStack, HStack, Center, Image,
  FormControl, FormLabel, Input, Select, RadioGroup, Radio, useDisclosure, Modal, 
  ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
 } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

function LandingPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Add user and logout from useAuth
  const [projects, setProjects] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Form state for new project
  const [projectName, setProjectName] = useState('');
  const [projectLanguage, setProjectLanguage] = useState('Java');
  const [projectPrivacy, setProjectPrivacy] = useState('Public');

  const getUserProjects = async () => {
    if (user) {
      // console.log("USER: ", user);
      try {
        const response = await axios.get(`http://localhost:3001/users/${user.id}/projects`, {
          withCredentials: true,
        });
        console.log("User Projects: ", response.data);
        setProjects(response.data);
      }
      catch (err) {
        console.error(err);
      }
    }
  };

  const createProject = async () => {
    try {
      let privacy = false;
      if (projectPrivacy == 1) {
        privacy = true;
      }
      
      const response = await axios.post(`http://localhost:3001/projects/${user.id}`, {
        name: projectName, 
        language: projectLanguage, 
        isPublic: privacy
      }, 
        {
          withCredentials: true,
        }
      );
      await axios.post('http://localhost:3001/execute/volume', {
        volumeName: response.data.volumeName,
        image: response.data.language
      },
      { withCredentials: true });
      
      openProject(response.data.volumeName, response.data.language);
    }
    catch (err) {
      console.log(err);
    }
  };

  const openProject = async (volume, image) => {
      // const response = await axios.post(`http://localhost:3001/execute/open`, 
      // {
      //   volume: volume,
      //   image: image
      // },
      // { withCredentials: true });

      // const websocketUrl = response.data.websocketUrl;
      navigate('/coding-page', { state: { volume, image } });
  }

  useEffect(() => {
    getUserProjects();
  }, [user]);

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
              {!user && (
                <>
                  <Button colorScheme="blue" size="lg" onClick={() => navigate('/register')}>Get Started</Button>
                  <Button variant="outline" colorScheme="blue" size="lg" onClick={() => navigate('/login')}>Login</Button>
                </>
              )}
            </HStack>
          </VStack>
        </Center>
      </Box>

      {/* User Projects Section */}
      {user && projects.length > 0 && (
        <Box as="section" py={20}>
          <Center>
            <VStack spacing={6} maxW="800px" textAlign="center">
              <Heading as="h2" size="xl">Your Projects</Heading>
              {projects.map((Wrapper) => (
                <Box key={Wrapper.project.id} borderWidth="1px" borderRadius="lg" p={4} w="100%">
                  <Heading size="md">{Wrapper.project.name}</Heading>
                  <Text fontSize="sm" color="gray.500">{Wrapper.project.language}</Text>
                  {/*<Text fontSize="sm" color="gray.500">{Wrapper.project.volumeName}</Text>*/}
                  <Button mt={2} colorScheme="blue" onClick={() => openProject(Wrapper.project.volumeName, Wrapper.project.language)}>
                    Open Project
                  </Button>
                </Box>
              ))}
            </VStack>
          </Center>
        </Box>
      )}

      {user && (
        <Box>
        <Center>
          {/* Create Project Button */}
          <Button colorScheme="blue" mt={8} onClick={onOpen}>
            Create Project
          </Button>
        </Center>
      </Box>
      )}
      

      {/* Modal for Creating a Project */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a New Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl id="project-name" isRequired>
                <FormLabel>Project Name</FormLabel>
                <Input
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </FormControl>

              <FormControl id="project-language" isRequired>
                <FormLabel>Project Language</FormLabel>
                <Select
                  placeholder="Select project language"
                  value={projectLanguage}
                  onChange={(e) => setProjectLanguage(e.target.value)}
                >
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                </Select>
              </FormControl>

              <FormControl id="project-privacy" isRequired>
                <FormLabel>Project Privacy</FormLabel>
                <RadioGroup value={projectPrivacy} onChange={setProjectPrivacy}>
                  <HStack spacing={4}>
                    <Radio value="1">Public</Radio>
                    <Radio value="0">Private</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={createProject}>
              Create Project
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
