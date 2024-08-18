import { useState } from "react";
import { Box, Button, Text, useToast } from "@chakra-ui/react"
import {executeCode} from "../api.js"
import axios from "axios";
import { LANGUAGE_VERSIONS } from "../constants.js";

const Output = ({ editorRef, language }) => {

    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const toast = useToast();

    const runCode = async () => {
        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return;
        try {

            setIsLoading(true);
            const version = LANGUAGE_VERSIONS[language];
            const { data: result } = await axios.post("http://localhost:3001/execute", { language, version, sourceCode});
            // console.log('Response from backend:', result);
            console.log("RESPONSE FROM THE frontend TRY BLOCK //")
            // console.log(result)
            setOutput(result.run.output.split('\n'));
            if (result.run.stderr) {
                setError(true);
                toast({
                    title: "Error compiling the code",
                    description: "Check the code for errors.",
                    status: "error",
                    duration: 6000,
                })
            } else setError(false);

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

    return (
        <Box w="50%">
            <Text mb={2} fontSize='lg'>Output:</Text>
            
            <Button variant="outline" colorScheme="green" mb={4} isLoading={isLoading} onClick={runCode}> Run Code </Button>
            <Box height='74vh' p={2} color={error ? "red.400" : ""} border= '1px solid' borderRadius={4} borderColor={ error ? "red.500": "#333"}>
                {output ? output.map( (line, i) => <Text key={i}>{line}</Text> ) : "Click 'Run code' to see the output"}
            </Box>
        </Box>
    )
}

export default Output;