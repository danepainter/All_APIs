import { useState, useEffect } from 'react';
import './Dogs.css';

function Dogs() {
    const [dog, setDog] = useState<string | null>(null);

    const getRandomDog = async () => {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();
        setDog(data.message);
    };

    useEffect(() => {
        getRandomDog();
    }, []);

    return (
        <div className="dogs-page">
            <div className="page-header">
                <h1>Dogs API</h1>
                <p>Get random dog images from the Dog CEO API</p>
            </div>
            {dog && (
                <div className="dog-container">
                    <h2 className="dog-title">Random Dog</h2>
                    <img src={dog} alt="Random Dog" className="dog-image" />
                    <button className="random-dog-button" onClick={getRandomDog}>
                        Get Random Dog
                    </button>
                </div>
            )}
        </div>
    );
}


export default Dogs;