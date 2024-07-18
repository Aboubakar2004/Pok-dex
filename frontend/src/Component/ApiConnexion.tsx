import { useEffect, useState } from 'react';


function ApiConnexion() {
    const [loading, setLoading] = useState(true);
    const [pokemonText, setPokemonText] = useState([]);
    const [entries, setEntries] = useState([]);
    const [fraName, setFrName] = useState([]);
    const [count , SetCount] = useState(0)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${count}&limit=20`);
                const data = await response.json();
                const pokemonDetails = await Promise.all(
                    data.results.map(async (pokemon : any) => {
                        const response = await fetch(pokemon.url);
                        const finalResponse = await response.json();
                        return finalResponse;
                    })
                );

                const pokemonDesc : any = await Promise.all(
                    pokemonDetails.map(async (pokemonDetail) => {
                        const textResponse = await fetch(pokemonDetail.species.url);
                        const finalTextResponse = await textResponse.json();
                        return finalTextResponse;
                    })
                );

                console.log(pokemonDesc);
                setPokemonText(pokemonDesc);
                setLoading(false);
            } catch (error) {
                console.error("Une erreur est survenue lors de la récupération des données", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [count]);

    // Fonction pour récupérer la description en français d'un Pokémon spécifique
    const getFrPokemonDes = async (item : any) => {
        const goodDesc = item.flavor_text_entries.filter((entry : any) => entry.language.name === "fr");
        const lastEntry = goodDesc.length > 0 ? goodDesc[goodDesc.length - 1].flavor_text : "Pas de description disponible en Français";
        return lastEntry;
    };

    useEffect(() => {
        // Fonction pour récupérer les descriptions en français pour tous les Pokémon
        const fetchFrDescriptions = async () => {
            const frEntries : any = await Promise.all(pokemonText.map((item) => getFrPokemonDes(item)));
            setEntries(frEntries);
        };

        if (!loading) {
            fetchFrDescriptions();
        }
    }, [pokemonText, loading]);

    // Fonction pour récupérer le nom d'un seul Pokémon en Francais
    const getFrPokemonName = async (item : any) => {
        const GoodName = item.names.find((name : any) => name.language.name === "fr");
        return GoodName ? GoodName.name : "Nom non disponible en Français";
    };


    // Fonction pour récupérer tout les noms des Pokémon en Francais et les afficher
    useEffect(() => {
        const fetchFrName = async () => {
            const frNames : any = await Promise.all(pokemonText.map((item) => getFrPokemonName(item)));
            setFrName(frNames);
        };

        if (!loading) {
            fetchFrName();
        }
    }, [pokemonText, loading]);

    const handlePreviousPage = () => {
        console.clear();
        SetCount(count - 20);
    };

    const handleNextPage = () => {
        console.clear();
        SetCount(count + 20);
    };

    return (
        <>
            <div className='grid grid-cols-4 gap-4 p-8'>
                {loading ? ( <h1>Chargement ...</h1>
                ) : (
                    pokemonText.map((item : any, index) => (
                        <div key={index} className=' max-w-sm bg-white -600 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-8 flex flex-col space-y-4'>
                            <p>#{item.id}</p>
                            <img className='object-scale-down h-48 w-96' src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`} alt={`Pokemon ${item.id}`} />
                            <h1 className='text-xl'>{fraName[index]}</h1>
                            <p className='text-sm'>{entries[index]}</p>
                        </div>
                    ))
                )}
            </div>
            <div className='flex justify-center'>
            {(count >= 20) ? <><button type="button" onClick={handlePreviousPage} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Page précédente</button><button type="button" onClick={handleNextPage} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Page suivante</button></> : <button type="button"  onClick={handleNextPage} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Page suivante</button> }
            </div>
        </>
    );
}

export default ApiConnexion;
