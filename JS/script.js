import { consolelog, generateRandomPokemon, displayGeneratedPokemon, fetchCatchAPokemon, postCatchAPokemon, apiEndpoint} from './ModulesAPI/PokeApi.js';
const generatePoke = document.getElementById("generatePoke");
const catchContainer = document.getElementById("catchContainer");
consolelog();

generatePoke.addEventListener("click", async () => {
    const pokeData = await generateRandomPokemon();
    

   let capturePokemon = document.getElementById("capturePokemonButton");
    if (!capturePokemon) {
        capturePokemon = document.createElement("button");
        capturePokemon.id = "capturePokemonButton"; 
        capturePokemon.innerText = "Fånga Pokemon";
        catchContainer.appendChild(capturePokemon);

        capturePokemon.addEventListener("click", () => {
            postCatchAPokemon(pokeData)
            .then(response => {
                console.log('Fångat Pokémon', response)
            })
            .catch(error => {
                console.error('Misslyckats att fånga Pokémon: ', error);
            })
        })
    } 
})

