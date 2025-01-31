import { getPokemonDetails, deletePokemon, generateRandomPokemon, postCatchAPokemon, changeComment } from './ModulesAPI/PokeApi.js';
const removeBtn = document.getElementById("remove-button");
const changeBtn = document.getElementById("change-button");
const comment = document.getElementById("comment-field");
const urlParams = new URLSearchParams(window.location.search);
const pokemonId = urlParams.get('id');

getPokemonDetails();

removeBtn.addEventListener("click", async () => {
    try {
        await deletePokemon(pokemonId)
        window.location.href = "./pokedex.html";
        
    } catch (error) {
        console.error('Ej lyckat att ta bort: ', error)
        
    } 
})

changeBtn.addEventListener("click", async () => {
    try {
        let newComment = comment.value;
        console.log('Min kommentar:', newComment);


        await changeComment(pokemonId, newComment)
        await getPokemonDetails();
        
    } catch (error) {
        console.error('Ej lyckat att uppdatera kommentar: ', error)
        
    } 
})