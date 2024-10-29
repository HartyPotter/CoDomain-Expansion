import { useState, useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useLocation } from 'react-router-dom'; // Import useLocation
import 'xterm/css/xterm.css';

const TerminalComponent = () => {
    const [terminal, setTerminal] = useState(null);

    const { state } = useLocation(); // Get the state from the location
    const websocketUrl = state?.websocketUrl; // Access websocketUrl from state


    const terminalRef = useRef(null);
    const socketRef = useRef(null);
    const fitAddonRef = useRef(null);

    useEffect(() => {
        const term = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#1e1e1e',
                foreground: '#ffffff'
            }
        });

        fitAddonRef.current = new FitAddon();
        term.loadAddon(fitAddonRef.current);

        term.open(terminalRef.current);
        fitAddonRef.current.fit();
        setTerminal(term);

        term.writeln('Connecting to Docker container...');

        if (websocketUrl) {
            // socketRef.current = new WebSocket('ws://localhost:4000');
            socketRef.current = new WebSocket(websocketUrl);

            socketRef.current.onopen = () => {
                term.writeln('Connected to Docker container');
                term.write('\r\n$ ');
            };

            socketRef.current.onmessage = async ({ data }) => {
                if (data instanceof Blob) {
                    console.log("TRUEEEEEEEEEEE\n");
                    const text = await data.text(); // Convert Blob to text
                    term.write(text);
                } 
                else {
                    term.write(data); // If it's already a string
                }
            };

            socketRef.current.onclose = () => {
                term.writeln('Disconnected from Docker container');
            };

            window.addEventListener('resize', () => fitAddonRef.current.fit());

            return () => {
                term.dispose();
                if (socketRef.current)
                    socketRef.current.close();
                window.removeEventListener('resize', () => fitAddonRef.current.fit());
            };
        }

    }, [websocketUrl]);

    useEffect(() => {
        if (terminal && socketRef.current) {
            console.log("TERMINALLLLL")
            let currentLine = '';
            let currentPosition = 0;

            terminal.onKey(({ key, domEvent }) => {
                const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

                if (domEvent.key === 'Enter') { // Enter
                    console.log("ENTERRRR");
                    socketRef.current.send(currentLine + '\n');
                    currentLine = '';
                    currentPosition = 0;
                    terminal.write('\r\n$ ');
                }
                else if (domEvent.key === 'Backspace') { // Backspace
                    console.log("Backspaceeeeeeee")
                    if (currentPosition > 0) {
                        currentLine = currentLine.slice(0, currentPosition - 1) + currentLine.slice(currentPosition);
                        currentPosition--;
                        terminal.write('\b \b');
                    }
                } else if (printable) {
                    currentLine = currentLine.slice(0, currentPosition) + key + currentLine.slice(currentPosition);
                    currentPosition++;
                    terminal.write(key);
                }
            });
        }
    }, [terminal]);

    return (
        <div style={{ width: '100%', height: '400px' }} ref={terminalRef}></div>
    );
};

export default TerminalComponent;