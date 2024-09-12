import { useState } from "react";
import { Box, Button, Text, Input, useToast } from "@chakra-ui/react"
import axios from "axios";
import { LANGUAGE_VERSIONS } from "../constants.js";

const Output = ({ editorRef, language, accessToken }) => {
    const [output, setOutput] = useState(null);
    const [command, setCommand] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const toast = useToast();

    const runCode = async () => {
        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return;
        try {

            setIsLoading(true);
            const version = LANGUAGE_VERSIONS[language];
            let config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
            const { data: result } = await axios.post("http://localhost:3001/execute", { language, version, sourceCode}, config);
            console.log("RESPONSE FROM THE frontend TRY BLOCK //")
            setOutput(result.output.split('\n'));
            // if (result.run.stderr) {
            //     setError(true);
            //     toast({
            //         title: "Error compiling the code",
            //         description: "Check the code for errors.",
            //         status: "error",
            //         duration: 6000,
            //     })
            // } else setError(false);

        } catch (error){

            console.log("RESPONSE FROM THE frontend CATCH BLOCK //")
            console.log(error);
            toast({
                title: "Error occurred",
                description: (error.response.data.message || "Unable to run code") + ", try again later.",
                status: "error",
                duration: 6000,
            })

        } finally {
            setIsLoading(false);
        }
    }

    const runCommand = async () => {
        if (!command)
            return;

        try {
            setIsLoading(true);
            let config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
            console.log("Command, ", command);
            const { data: result } = await axios.post("http://localhost:3001/execute/terminal", { command }, config);
            setOutput(result.output.split('\n'));
        }
        catch (error) {
            console.log(error);
            // toast({
            //     title: "FFFFFFFF",
            //     description: error.response.data.message || "Error executing command",
            //     status: "error",
            //     duration: 6000,
            // });
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <Box w="50%">
            <Text mb={2} fontSize='lg'>Output:</Text>
            
            <Button variant="outline" colorScheme="green" mb={4} isLoading={isLoading} onClick={runCode}> Run Code </Button>
            <Box height='74vh' p={2} color={error ? "red.400" : ""} border= '1px solid' borderRadius={4} borderColor={ error ? "red.500": "#333"}>
                {output ? output.map( (line, i) => <Text key={i}>{line}</Text> ) : "Click 'Run code' to see the output"}
            </Box>

            <Input
                placeholder="Enter terminal command"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                mb={4}
            />
            <Button variant="outline" colorScheme="blue" mb={4} isLoading={isLoading} onClick={runCommand}>
                Run Command
            </Button>
        </Box>
    )
}

export default Output;