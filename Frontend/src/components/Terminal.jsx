import { useState, useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { io } from 'socket.io-client';
import { FitAddon } from 'xterm-addon-fit';
import { useLocation } from 'react-router-dom'; // Import useLocation
import 'xterm/css/xterm.css';

const TerminalComponent = () => {
    const [terminal, setTerminal] = useState(null);

    const { state } = useLocation(); // Get the state from the location
    const volume = state?.volume;
    const image = state?.image;

    const terminalRef = useRef(null);
    const socketRef = useRef(null);
    const fitAddonRef = useRef(null);

    useEffect(() => {
        const terminal = new Terminal({
            useStyle: true,
            screenKeys: true,
            cursorBlink: true,
            cols: 100,
            theme: {
                foreground: "#D3D7CF",        // Soft light gray for text
                background: "#2E3436",        // Dark, calm gray for background
                cursor: "#A6ACAF",            // Subtle, lighter gray cursor
                selection: "#555753",         // Dark gray for selected text
                black: "#2E3436",             // Dark gray
                red: "#CC6666",               // Muted red
                green: "#B5BD68",             // Muted olive green
                yellow: "#F0C674",            // Soft gold
                blue: "#81A2BE",              // Muted blue
                magenta: "#B294BB",           // Soft lavender
                cyan: "#8ABEB7",              // Calm teal
                white: "#D3D7CF",             // Light gray
                brightBlack: "#4F5B66",       // Slightly lighter gray
                brightRed: "#D87B7B",         // Muted bright red
                brightGreen: "#C8D07A",       // Brighter muted olive
                brightYellow: "#FFEB95",      // Soft yellow
                brightBlue: "#9AB6D3",        // Brighter muted blue
                brightMagenta: "#C0A3C5",     // Soft lavender
                brightCyan: "#A7CBCB",        // Brighter calm teal
                brightWhite: "#EEEEEC"        // Very light gray
            },
            fontFamily: "'JetBrains Mono', monospace",  // Specify your preferred font family here
            fontSize: 14                           // Adjust font size as desired
        });

        fitAddonRef.current = new FitAddon();
        terminal.loadAddon(fitAddonRef.current);

        terminal.open(terminalRef.current);
        fitAddonRef.current.fit();
        setTerminal(terminal);

        terminal.writeln('Connecting to Docker container...');

        const socket = io('http://localhost:3001/code-execution');

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

    return (
        <div style={{ width: '100%', height: '400px' }} ref={terminalRef}></div>
    );
};

export default TerminalComponent;