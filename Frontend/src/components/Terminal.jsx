import { useState, useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useLocation } from 'react-router-dom';
import 'xterm/css/xterm.css';

import { termOptions } from './termOptions.js';

const TerminalComponent = ({ code, socket}) => {
    const [terminal, setTerminal] = useState(null);
    const { state } = useLocation(); // Get the state from the location
    const terminalRef = useRef(null);
    const socketRef = useRef(null);
    const fitAddonRef = useRef(null);
    const volume = state?.volume;
    const image = state?.image;

    useEffect(() => {
        if (!socket) return;
        const terminal = new Terminal(termOptions);

        fitAddonRef.current = new FitAddon();
        terminal.loadAddon(fitAddonRef.current);

        terminal.open(terminalRef.current);
        fitAddonRef.current.fit();
        setTerminal(terminal);

        terminal.writeln('Connecting to Docker container...');

        socketRef.current = socket;

        socket.on('output', (data) => {
            terminal.write(data);
        });

        terminal.onData((data) => {
            socket.emit('input', data);
        });

        return () => {
            terminal.dispose();
            // socket.disconnect();
        };
    }, [socket, volume, image]);

    // useEffect(() => {
    //     if (socketRef.current && code) {
    //     }
    // }, [code]);

    return (
        <div style={{ width: '100%', height: '400px' }} ref={terminalRef}></div>
    );
};

export default TerminalComponent;