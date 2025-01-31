const catchContainer = document.getElementById("catchContainer");
const randomPokeinfo = document.getElementById("randomPoke-info");
const generatePoke = document.getElementById("generatePoke");
const pokedexContainer = document.getElementById("pokedex-container");
const pokemonDetails = document.getElementById('pokemon-details');


/**
 * API-endpoints som används i applikationen
 */
const url = "https://pokeapi.co/api/v2/"; // Extern PokeAPI endpint
const apiEndpoint = "http://localhost:8080/api/pokedex"; // Min backend endpoint

export function consolelog() {
    console.log("Syns detta?");
}

/**
 * En funktion för att hantera JSON-formaterade kommentarer
 * @param {string} commentJson - JSON-sträng som innehåller en kommentar i formatet {"comment": "text"}
 * @returns {string} efter att den har blivit parse med @function JSON.parse
 */
function parseComment(commentJson) {
    try {
        // Kontrollerar om det finns en kommentar (commenJson) och parsar den
        return commentJson ? JSON.parse(commentJson).comment : '';
    } catch (error) {
        console.error('Error med att parsa kommentaren:', error);
        return commentJson || '';
    }
}

/**
 * Genererar en slumpmässig Pokémon från det externa API:et PokeAPI
 * Processen:
 * 1. Genererar slumpmässigt ID (0-999)
 * 2. Hämtar data från PokeAPI
 * 3. Visar Pokémon på sidan
 * 4. Returnerar data för vidare användning
 */
export async function generateRandomPokemon() {
    //Slumpar ett id mellan 0-999
    let id = Math.floor(Math.random()*1000);
    const radomPokemonRespone = await fetch(`${url}pokemon/${id}`);

    // Hämtar Pokémon-data från API:et
    const pokeData = await radomPokemonRespone.json();

    // Logg för debugging. Tillåter mig att se ifall det har blivit fetch korrekt
    console.log('Fetched data', pokeData);

    // Visar den hämtade Pokémon och returnerar datan
    displayGeneratedPokemon(pokeData);
    return pokeData;
}

/**
 * Visar den genererade Pokémon med all relevant information
 * @param {Object} pokeData - Komplett Pokémon-data från PokeAPI
 * 
 * Datapunkter som visas:
 * - Officiell artwork
 * - Namn (i versaler)
 * - Typer
 * - Bas-erfarenhet
 * - Alla statsen
 */
export function displayGeneratedPokemon(pokeData) {
    // Extraherar och formaterar alla typer för Pokémon från ett array till text.
    // Processen är att med .map() så itterar den igenom varje typ-objekt i arrayen type
    // typeInfo.type.name.toUpperCase() extraherar namnet från den strukturen och konvererar till versaler
    // .jon(', ') kombinerar alla pokemon typer i arrayen till en sträng med komma tecken mellan
    const typeNames = pokeData.types
        .map(typeInfo => typeInfo.type.name.toUpperCase())
        .join(', ');
    
    // Samma pricip som ovan då statsen också var i ett array.
    const stats = pokeData.stats
        .map(statInfo => `<li>${statInfo.stat.name.toUpperCase()}: ${statInfo.base_stat}</li>`)
        .join('')

    // Skapar och infogar en HTML-struktur där informationen visas
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

/**
 * Skickar en "fångad" Pokémon till min backend för lagring
 */
export function fetchCatchAPokemon(pokeData) {
    // Log som hjäler med debug
    console.log('Vad som skickas till min backend:', pokeData);

    // Gör POST-request till backend
    return fetch(`${apiEndpoint}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pokeData)
    })
    .then(response => {
         // Kontrollerar om requesten lyckades
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

        // Här mappas stat-namn till matcha formatet i min backend
        // Key är PokeAPI format och value är mitt backend format 
        const statMapping = {
            'hp': 'health',
            'attack': 'attack',
            'defene': 'defence',
            'special-attack': 'specialAttack',
            'special-defense': 'specialDefence',
            'speed': 'speed'
        };

        // Konverterar stats-array till ett objekt med mappade namn.
        // Object.fromEntries() skapar ett objekt från vår array av i nyckel och värde par
        // .map() - konverterar varje "stat" till rätt format
        // Exempelvis så blir [{stat:{name:"hp"}, base_stat:78}] till {health: 78}
        const stats = Object.fromEntries(
            pokeData.stats.map(stat => [
                statMapping[stat.stat.name], // Mappar om namnet enligt statMapping ovan
                stat.base_stat // behåller original värdet
            ])
        );
        
        // Skapar det slutgiltiga objektet som vi faktiskt ska posta till backenden
        // Formatet ovan matchar min backend modell
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
    // Skapar HTML för varje Pokemon i Pokedex
    pokedexContainer.innerHTML = Pokedex.map(pokemon => `
           <div class="pokemon-card">
            <img src="${pokemon.imageURL}" alt="${pokemon.name}">
            <h3>${pokemon.name.toUpperCase()}</h3>
            ${pokemon.comments ? `<h3>${parseComment(pokemon.comments)}</h3>` : ''}
            <a href="../HTML/pokemonDetails.html?id=${pokemon.id}" class="pokemon-details-button">Detaljer</a>
        </div>
    `).join('');
}

/**
 * Hämtar detaljerad information om en specifik Pokémon
 * Genom att extrahera ID från själva URL:en
 * Hämtar därefter data från Backend
 * Visar hämtad information
 */
export async function getPokemonDetails() {
    // Hämtar id från parametern urlParams som är min url länk
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // debug log för att se ifall det har lyckats
    console.log(id);

     // Hämtar Pokémon-data från vår backend
    const response = await fetch(`${apiEndpoint}/${id}`);
    const pokemon = await response.json();

    //Log för debugging
    console.table('Hämtad data från pokemon by id', pokemon);

    // Visar informationen som har hämtats från backend
    displayPokemonDetails(pokemon);

}

/**
 * Visar detaljerad information om en specifik Pokémon
 * 
 * Skapar en detaljerad vy med:
 * - Stor bild
 * - Namn i versaler
 * - Alla stats i en lista
 * - Eventuella kommentarer om det finns annars syns ingenting
 */
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
            ${pokemon.comments ? `<p>Anteckningar: ${parseComment(pokemon.comments)}</p>` : ''}
            </div>
        </div>
    `;
}
if (document.getElementById('pokemon-details')) {
    getPokemonDetails();
}

/**
 * Tar bort en Pokémon från användarens Pokedex (backend)
 * 
 * @param {number} id - ID för Pokémon som ska tas bort
 * 
 * En DELETE-req skickas till backenden
 * Sedan väntas det på en bekräftelse
 * Därefter returneraas svaret
 * 
 * @throws {Error} Om borttagningen misslyckas
 */
export async function deletePokemon(id) {

    const response = await fetch(`${apiEndpoint}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log('Detta skickar jag till backend', response)
    return await response.json();
}

/**
 * Uppdaterar kommentaren för en specifik Pokémon
 * 
 * @param {number} id - ID för Pokémon som ska uppdateras
 * @param {string} newComment - Den nya kommentaren som ska sparas i backend
 * 
 * Först formateras kommentaren som JSON
 * En PUT-req skickas till backend
 * Därefter returneras uppdaterad data
 * 
 * @throws {Error} Om uppdateringen misslyckas
 */
export async function changeComment(id, newComment) {
    console.log('Skickar kommentar:', newComment); 
    
    try {
        const response = await fetch(`${apiEndpoint}/${id}/comments`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comment: newComment })
        });

        return await response.json();
        
    } catch (error) {
        console.error('Error in changeComment:', error);
        throw error;
    }
}

