const catchContainer = document.getElementById("catchContainer");
const randomPokeinfo = document.getElementById("randomPoke-info");
const generatePoke = document.getElementById("generatePoke");
const pokedexContainer = document.getElementById("pokedex-container");
const url = "https://pokeapi.co/api/v2/";
const apiEndpoint = "http://localhost:8080/api/pokedex";
const pokemonDetails = document.getElementById('pokemon-details');

export function consolelog() {
    console.log("Syns detta?");
}

export async function generateRandomPokemon() {
    let id = Math.floor(Math.random()*1000);
    const radomPokemonRespone = await fetch(`${url}pokemon/${id}`);

    const pokeData = await radomPokemonRespone.json();
    console.log('Fetched data', pokeData);
    displayGeneratedPokemon(pokeData);
    return pokeData;
}

export function displayGeneratedPokemon(pokeData) {
    const typeNames = pokeData.types
        .map(typeInfo => typeInfo.type.name.toUpperCase())
        .join(', ');
    
    const stats = pokeData.stats
        .map(statInfo => `<li>${statInfo.stat.name.toUpperCase()}: ${statInfo.base_stat}</li>`)
        .join('')

    randomPokeinfo.innerHTML =`
        <div>
            <img src="${pokeData.sprites.other['official-artwork'].front_default}" alt="${pokeData.name}">
        </div>
        <ul>
            <li>NAMN: ${pokeData.name.toUpperCase()}</li>
            <li>TYP: ${typeNames}</li>
            <li>BAS EXP: ${pokeData.base_experience}</li>
            <li>STATS:
                <ul>
                    ${stats}
                </ul>
            </li>
        </ul>
  
    `;
    return pokeData;
}

export function fetchCatchAPokemon(pokeData) {
    console.log('Vad som skickas till min backend:', pokeData);
    return fetch(`${apiEndpoint}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pokeData)
    })
    .then(response => {
        if(!response.ok) {
            throw new Error(`Error! Kolla status: ${response.status}`);
        }
        return response.json();
    })
}

export async function postCatchAPokemon(pokeData) {
        console.log('Received pokeData:', pokeData);

        
        if (!pokeData || !pokeData.stats) {
            throw new Error('Data saknas');
        }
        const statMapping = {
            'hp': 'health',
            'attack': 'attack',
            'defene': 'defence',
            'special-attack': 'specialAttack',
            'special-defense': 'specialDefence',
            'speed': 'speed'
        };

        const stats = Object.fromEntries(
            pokeData.stats.map(stat => [
                statMapping[stat.stat.name],
                stat.base_stat
            ])
        );
        const pokemonToCatch = {
            name: pokeData.name,
            type: pokeData.types.map(type => type.type.name).join(', '),
            baseExperience: pokeData.base_experience,
            imageURL: pokeData.sprites.other['official-artwork'].front_default,
            health: stats.health,
            attack: stats.attack,
            defence: stats.defence,
            specialAttack: stats.special_attack,
            specialDefence: stats.special_defence,
            speed: stats.speed
        }

        const response = await fetchCatchAPokemon(pokemonToCatch)
        return response
}

export async function getYourPokemon() {
    const myPokemons = await fetch(apiEndpoint);
    const Pokedex = await myPokemons.json();
    console.table('Hämtad data från PokeDex backEnd', Pokedex);
    displayPokeDex(Pokedex);
    return Pokedex;
 
}

export function displayPokeDex(Pokedex) {
    pokedexContainer.innerHTML = Pokedex.map(pokemon => `
           <div class="pokemon-card">
            <img src="${pokemon.imageURL}" alt="${pokemon.name}">
            <h3>${pokemon.name.toUpperCase()}</h3>
            ${pokemon.comments ? `<h3>${pokemon.comments}</h3>` : ''}
            <a href="../HTML/pokemonDetails.html?id=${pokemon.id}" class="pokemon-details-button">Detaljer</a>
        </div>
    `).join('');
}

export async function getPokemonDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    console.log(id);

    const response = await fetch(`${apiEndpoint}/${id}`);
    const pokemon = await response.json();

    console.table('Hämtad data från pokemon by id', pokemon);

    displayPokemonDetails(pokemon);

}

function displayPokemonDetails(pokemon) {
    pokemonDetails.innerHTML = `
        <div class="pokemon-detail-card">
            <img src="${pokemon.imageURL}" alt="${pokemon.name}">
            <h2>${pokemon.name.toUpperCase()}</h2>
            <div class="stats">
                <p>Type: ${pokemon.type}</p>
                <p>Base Experience: ${pokemon.baseExperience}</p>
                <h3>Stats:</h3>
                <ul>
                    <li>Health: ${pokemon.health}</li>
                    <li>Attack: ${pokemon.attack}</li>
                    <li>Defence: ${pokemon.defence}</li>
                    <li>Special Attack: ${pokemon.specialAttack}</li>
                    <li>Special Defence: ${pokemon.specialDefence}</li>
                    <li>Speed: ${pokemon.speed}</li>
                </ul>
                ${pokemon.comments ? `<p>Kommentar: ${pokemon.comments}</p>` : ''}
            </div>
        </div>
    `;
}
if (document.getElementById('pokemon-details')) {
    getPokemonDetails();
}
