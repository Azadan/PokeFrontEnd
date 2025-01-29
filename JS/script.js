import { consolelog, generateRandomPokemon, displayGeneratedPokemon} from './ModulesAPI/PokeApi.js';
const generatePoke = document.getElementById("generatePoke");
const catchContainer = document.getElementById("catchContainer");

consolelog();

generatePoke.addEventListener("click", () => {
    generateRandomPokemon();

    let capturePokemon = document.getElementById("capturePokemonButton");
    if (!capturePokemon) {
        capturePokemon = document.createElement("button");
        capturePokemon.id = "capturePokemonButton"; 
        capturePokemon.innerText = "Fånga Pokemon";
        catchContainer.appendChild(capturePokemon);

    }
})
