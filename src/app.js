const DEBUG = true
const log = (...args) => DEBUG && console.info.apply(console, args)

const ButtonCheck   = document.getElementById('check-button')
const TextboxHeight = document.getElementById('textbox-height')
const TextboxWeight = document.getElementById('textbox-weight')
const Title         = document.getElementById('h1-title')
const ImagePokemon  = document.getElementById('img-pokemon')
const Spinner       = document.getElementById('spinner')

const API_URL = 'https://pokeapi.co/api/v2/'
const SPRITES_API_URL = 'https://pokeres.bastionbot.org/images/pokemon/'
const STORAGE_KEY = 'pokemonsList'
/**
 * @todo 
 * Implement caching of pokemon list and images
 * (optional) add accuracy slidebar
 */



// Just sorts by closest matching entry. Entry with the smaller difference from the input bubbles up
const sortByDifference = (array, height, weight) =>{
  array.sort((pokemonA, pokemonB) => 
  Math.abs(height - pokemonA.height) > Math.abs(height - pokemonB.height) 
  && Math.abs(weight - pokemonA.weight) > Math.abs(weight - pokemonB.weight))
}


const fetchPokemons = async () =>{
  let result = []
  if(!window.localStorage.getItem(STORAGE_KEY)){
    try{
      const response = await fetch(`${API_URL}pokemon/?limit=200`).catch(error => console.error('Error in fetching pokèmon list: ', error))
      const data = await response.json()

      for(let entry of data.results){
        const pokemon = await fetch(entry.url)
        const {id, weight, height} = await pokemon.json()
      
        result.push({
            name: entry.name,
            weight: weight / 10,
            height: height * 10,
            sprite: `${SPRITES_API_URL}${id}.png`
          })  
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result))

    }
    catch(error) {  DEBUG && console.error('Error in fetching pokèmon stats: ', error)  }
  } else {
    log('Retrieving local storage data...')
    result = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
  }

  return result || 'No Pokèmons found...'
}


const findPokemon = async (height = 0, weight = 0) => {
  const results = []
  const MAX_RESULTS = 2
  const MAX_OFFSET = 30

  let pokemons = await fetchPokemons()

  for(let pokemon of pokemons){
    if(Math.abs(height - pokemon.height) <= MAX_OFFSET && Math.abs(weight - pokemon.weight) <= MAX_OFFSET){ // Didn't want to use ternary for code legibility
    if(results.length <=MAX_RESULTS) {
      results.push(pokemon)
      log('Pushing Pokèmon in result list with: ', Math.abs(height - pokemon.height), ' ', Math.abs(weight - pokemon.weight))
      }
    }
  }
  sortByDifference(results, height, weight)
  log('Pokèmons: ', results)
  return results[0] //Return the best matching pokemon
}


const onCheckButtonClick = async () => {
  const height = TextboxHeight.value
  const weight = TextboxWeight.value
  Title.textContent = '...'
  ImagePokemon.className = 'img-fluid responsive__image invisible'
  Spinner.className = ''
  
  const matchingPokemon = await findPokemon(height, weight)
  log('Matching pokemon: ', matchingPokemon)
  
  Title.textContent = matchingPokemon.name
  ImagePokemon.setAttribute('src', matchingPokemon.sprite)
  ImagePokemon.setAttribute('alt', `An image of ${matchingPokemon.name}`)
  ImagePokemon.className = 'img-fluid responsive__image'
  Spinner.className = 'd-none'
}


const onHeightInput = (evt) => log(evt)
const onWeightInput = (evt) => log(evt)

const _init = () => {
  log('Initializing events')

  ButtonCheck.addEventListener('click', onCheckButtonClick)
  TextboxHeight.addEventListener('keypress', onHeightInput)
  TextboxWeight.addEventListener('keypress', onWeightInput)
}


export const App = {
  init: () => {
    _init()
  } 
}