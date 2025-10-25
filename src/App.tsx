import React, { useState } from 'react';

const App = () => {
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState<string | null>(null);

    const valueMap: { [key: string]: string } = {
        'H': '1',
        'Po': '84',
        'Br': '35',
        'Pa': '91',
        'Ba': '56',
        'F': '9'
    };

    const handleSubmit = () => {
        const trimmedInput = inputValue.trim();
        
        // Find the key in a case-insensitive way
        const foundKey = Object.keys(valueMap).find(
            key => key.toLowerCase() === trimmedInput.toLowerCase()
        );

        if (foundKey) {
            setResult(valueMap[foundKey]);
        } else {
            setResult('NAPAKA');
        }
    };

    const handleBack = () => {
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

export default App;
