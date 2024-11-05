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
                foreground: "#00FF00",      // Bright green text for a "hacker" look
                background: "rgba(20, 20, 20, 0.9)",  // Dark, slightly translucent background
                cursor: "#FF5722",          // Bright orange cursor
                selection: "#666666",       // Grey for selected text
                black: "#000000",           // Standard color palette
                red: "#FF5555",
                green: "#50FA7B",
                yellow: "#F1FA8C",
                blue: "#BD93F9",
                magenta: "#FF79C6",
                cyan: "#8BE9FD",
                white: "#F8F8F2",
                brightBlack: "#4D4D4D",
                brightRed: "#FF6E6E",
                brightGreen: "#69FF94",
                brightYellow: "#FFFFA5",
                brightBlue: "#D6ACFF",
                brightMagenta: "#FF92DF",
                brightCyan: "#A4FFFF",
                brightWhite: "#FFFFFF"
            }
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