import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Function to initialize AudioContext on user interaction
    const getAudioContext = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioContextRef.current;
    };

    // Function to play different sounds
    const playSound = (type: 'click' | 'success' | 'error') => {
        const audioContext = getAudioContext();
        if (!audioContext) return;
        
        // Resume context if it's suspended (common in modern browsers)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const now = audioContext.currentTime;

        if (type === 'click') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(150, now);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
        } else if (type === 'success') {
            oscillator.type = 'triangle';
            gainNode.gain.setValueAtTime(0.2, now);
            oscillator.frequency.setValueAtTime(440, now); // A4
            oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
            oscillator.start(now);
            oscillator.stop(now + 0.4);
        } else if (type === 'error') {
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(110, now); // A2
            gainNode.gain.setValueAtTime(0.25, now);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
        }
    };
    
    useEffect(() => {
        if (result) {
            if (result === 'NAPAKA') {
                playSound('error');
            } else {
                playSound('success');
            }
        }
    }, [result]);


    const valueMap: { [key: string]: string } = {
        'h': '1',
        'po': '84',
        'br': '35',
        'pa': '91',
        'ba': '56',
        'f': '9'
    };

    const handleSubmit = () => {
        playSound('click');
        const key = inputValue.trim().toLowerCase();
        const mappedValue = valueMap[key];
        
        if (mappedValue) {
            setResult(mappedValue);
        } else {
            setResult('NAPAKA');
        }
    };

    const handleBack = () => {
        playSound('click');
        setInputValue('');
        setResult(null);
    };
    
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    if (result) {
        return (
            <div className="result-view">
                <h2 className={result === 'NAPAKA' ? 'error' : ''}>{result}</h2>
                <button onClick={handleBack} aria-label="Go back to the input screen">Nazaj</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Vnesi Kodo</h1>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="...?"
                aria-label="Vnosna koda"
                autoFocus
            />
            <button onClick={handleSubmit}>Potrdi</button>
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}