const catchContainer = document.getElementById("catchContainer");
const randomPokeinfo = document.getElementById("randomPoke-info");
const generatePoke = document.getElementById("generatePoke");
const url = "https://pokeapi.co/api/v2/";

export function consolelog() {
    console.log("Syns detta?");
}

export async function generateRandomPokemon() {
    let id = Math.floor(Math.random()*1000);
    const radomPokemonRespone = await fetch(`${url}pokemon/${id}`);

    const pokeData = await radomPokemonRespone.json();
    console.log('Fetched data', pokeData);
    displayGeneratedPokemon(pokeData);
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
}
