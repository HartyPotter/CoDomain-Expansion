import { useState, useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { io } from 'socket.io-client';
import { FitAddon } from 'xterm-addon-fit';
import { useLocation } from 'react-router-dom'; // Import useLocation
import 'xterm/css/xterm.css';

import { termOptions } from './termOptions.js';

const TerminalComponent = ({code}) => {
    const [terminal, setTerminal] = useState(null);

    const { state } = useLocation(); // Get the state from the location
    const volume = state?.volume;
    const image = state?.state;

    const terminalRef = useRef(null);
    const socketRef = useRef(null);
    const fitAddonRef = useRef(null);

    useEffect(() => {
        const terminal = new Terminal(termOptions);

        fitAddonRef.current = new FitAddon();
        terminal.loadAddon(fitAddonRef.current);

        terminal.open(terminalRef.current);
        fitAddonRef.current.fit();
        setTerminal(terminal);

        terminal.writeln('Connecting to Docker container...');

        const socket = io('http://localhost:3001/code-execution');
        socketRef.current = socket;

        socket.on('connect', () => {
          console.log('Connected to WebSocket server');

          // Start the Docker process
          socket.emit('start', { volume, image });
        });

        // Display output from the server
        socket.on('output', (data) => {
          terminal.write(data);
        });

        // Send input to the server
        terminal.onData((data) => {
          socket.emit('input', data);
        });

        // Cleanup on component unmount
        return () => {
          terminal.dispose();
          socket.disconnect();
        };
        

    }, [volume, image]);

    useEffect(() => {
        if (socketRef.current && code) {
            console.log()

            // send the whole new code to the backend
            // I think this can be optimized
            socketRef.current.emit('saveFileData', code);

        }
    }, [code])

    return (
        <div style={{ width: '100%', height: '400px' }} ref={terminalRef}></div>
    );
};

export default TerminalComponent;