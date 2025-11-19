import { useState, useEffect } from 'react';
import './Dogs.css';

const BREEDS_DATA = {
    "affenpinscher": [],
    "african": ["wild"],
    "airedale": [],
    "akita": [],
    "appenzeller": [],
    "australian": ["kelpie", "shepherd"],
    "bakharwal": ["indian"],
    "basenji": [],
    "beagle": [],
    "bluetick": [],
    "borzoi": [],
    "bouvier": [],
    "boxer": [],
    "brabancon": [],
    "briard": [],
    "buhund": ["norwegian"],
    "bulldog": ["boston", "english", "french"],
    "bullterrier": ["staffordshire"],
    "cattledog": ["australian"],
    "cavapoo": [],
    "chihuahua": [],
    "chippiparai": ["indian"],
    "chow": [],
    "clumber": [],
    "cockapoo": [],
    "collie": ["border"],
    "coonhound": [],
    "corgi": ["cardigan"],
    "cotondetulear": [],
    "dachshund": [],
    "dalmatian": [],
    "dane": ["great"],
    "danish": ["swedish"],
    "deerhound": ["scottish"],
    "dhole": [],
    "dingo": [],
    "doberman": [],
    "elkhound": ["norwegian"],
    "entlebucher": [],
    "eskimo": [],
    "finnish": ["lapphund"],
    "frise": ["bichon"],
    "gaddi": ["indian"],
    "german": ["shepherd"],
    "greyhound": ["indian", "italian"],
    "groenendael": [],
    "havanese": [],
    "hound": ["afghan", "basset", "blood", "english", "ibizan", "plott", "walker"],
    "husky": [],
    "keeshond": [],
    "kelpie": [],
    "kombai": [],
    "komondor": [],
    "kuvasz": [],
    "labradoodle": [],
    "labrador": [],
    "leonberg": [],
    "lhasa": [],
    "malamute": [],
    "malinois": [],
    "maltese": [],
    "mastiff": ["bull", "english", "indian", "tibetan"],
    "mexicanhairless": [],
    "mix": [],
    "mountain": ["bernese", "swiss"],
    "mudhol": ["indian"],
    "newfoundland": [],
    "otterhound": [],
    "ovcharka": ["caucasian"],
    "papillon": [],
    "pariah": ["indian"],
    "pekinese": [],
    "pembroke": [],
    "pinscher": ["miniature"],
    "pitbull": [],
    "pointer": ["german", "germanlonghair"],
    "pomeranian": [],
    "poodle": ["medium", "miniature", "standard", "toy"],
    "pug": [],
    "puggle": [],
    "pyrenees": [],
    "rajapalayam": ["indian"],
    "redbone": [],
    "retriever": ["chesapeake", "curly", "flatcoated", "golden"],
    "ridgeback": ["rhodesian"],
    "rottweiler": [],
    "rough": ["collie"],
    "saluki": [],
    "samoyed": [],
    "schipperke": [],
    "schnauzer": ["giant", "miniature"],
    "segugio": ["italian"],
    "setter": ["english", "gordon", "irish"],
    "sharpei": [],
    "sheepdog": ["english", "indian", "shetland"],
    "shiba": [],
    "shihtzu": [],
    "spaniel": ["blenheim", "brittany", "cocker", "irish", "japanese", "sussex", "welsh"],
    "spitz": ["indian", "japanese"],
    "springer": ["english"],
    "stbernard": [],
    "terrier": ["american", "andalusian", "australian", "bedlington", "border", "boston", "cairn", "dandie", "fox", "irish", "kerryblue", "lakeland", "norfolk", "norwich", "patterdale", "russell", "scottish", "sealyham", "silky", "tibetan", "toy", "welsh", "westhighland", "wheaten", "yorkshire"],
    "tervuren": [],
    "vizsla": [],
    "waterdog": ["spanish"],
    "weimaraner": [],
    "whippet": [],
    "wolfhound": ["irish"]
};

function Dogs() {
    const [dog, setDog] = useState<string | null>(null);
    const [selectedBreed, setSelectedBreed] = useState<string>('');
    const [selectedSubBreed, setSelectedSubBreed] = useState<string>('');
    const [breedImages, setBreedImages] = useState<string[]>([]);
    const [loadingImages, setLoadingImages] = useState<boolean>(false);

    const breeds = Object.keys(BREEDS_DATA);
    const subBreeds = selectedBreed ? BREEDS_DATA[selectedBreed as keyof typeof BREEDS_DATA] || [] : [];

    const getRandomDog = async () => {
        let url = 'https://dog.ceo/api/breeds/image/random';
        
        if (selectedBreed) {
            if (selectedSubBreed) {
                url = `https://dog.ceo/api/breed/${selectedBreed}/${selectedSubBreed}/images/random`;
            } else {
                url = `https://dog.ceo/api/breed/${selectedBreed}/images/random`;
            }
        }
        
        const response = await fetch(url);
        const data = await response.json();
        setDog(data.message);
    };

    const fetchBreedImages = async (breed: string, subBreed?: string) => {
        if (!breed) {
            setBreedImages([]);
            return;
        }

        setLoadingImages(true);
        try {
            let url;
            if (subBreed) {
                url = `https://dog.ceo/api/breed/${breed}/${subBreed}/images`;
            } else {
                url = `https://dog.ceo/api/breed/${breed}/images`;
            }
            
            const response = await fetch(url);
            const data = await response.json();
            if (data.status === 'success' && Array.isArray(data.message)) {
                setBreedImages(data.message);
            } else {
                setBreedImages([]);
            }
        } catch (error) {
            console.error('Error fetching breed images:', error);
            setBreedImages([]);
        } finally {
            setLoadingImages(false);
        }
    };

    const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newBreed = e.target.value;
        setSelectedBreed(newBreed);
        setSelectedSubBreed('');
        fetchBreedImages(newBreed);
    };

    const handleSubBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSubBreed = e.target.value;
        setSelectedSubBreed(newSubBreed);
        if (selectedBreed) {
            fetchBreedImages(selectedBreed, newSubBreed || undefined);
        }
    };

    const handleImageClick = (imageUrl: string) => {
        setDog(imageUrl);
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
            
            <div className="breed-selector-container">
                <h2 className="breed-selector-title">Select Breed</h2>
                <div className="breed-selectors">
                    <div className="select-group">
                        <label htmlFor="breed-select">Breed:</label>
                        <select 
                            id="breed-select"
                            className="breed-select"
                            value={selectedBreed}
                            onChange={handleBreedChange}
                        >
                            <option value="">Random (All Breeds)</option>
                            {breeds.map(breed => (
                                <option key={breed} value={breed}>
                                    {breed.charAt(0).toUpperCase() + breed.slice(1).replace(/([A-Z])/g, ' $1')}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {subBreeds.length > 0 && (
                        <div className="select-group">
                            <label htmlFor="subbreed-select">Sub-breed:</label>
                            <select 
                                id="subbreed-select"
                                className="breed-select"
                                value={selectedSubBreed}
                                onChange={handleSubBreedChange}
                            >
                                <option value="">Random (All Sub-breeds)</option>
                                {subBreeds.map(subBreed => (
                                    <option key={subBreed} value={subBreed}>
                                        {subBreed.charAt(0).toUpperCase() + subBreed.slice(1).replace(/([A-Z])/g, ' $1')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                
                {selectedBreed && (
                    <div className="breed-images-container">
                        {loadingImages ? (
                            <div className="loading-message">Loading images...</div>
                        ) : breedImages.length > 0 ? (
                            <div className="breed-images-scroll">
                                {breedImages.map((imageUrl, index) => (
                                    <div 
                                        key={index} 
                                        className="breed-image-item"
                                        onClick={() => handleImageClick(imageUrl)}
                                    >
                                        <img 
                                            src={imageUrl} 
                                            alt={`${selectedBreed} ${selectedSubBreed || ''}`}
                                            className="breed-thumbnail"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-images-message">No images available for this breed</div>
                        )}
                    </div>
                )}
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