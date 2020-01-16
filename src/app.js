const DEBUG = true
const log = (...args) => DEBUG && console.info(args)

const ButtonCheck   = document.getElementById('check-button')
const TextboxHeight = document.getElementById('textbox-height')
const TextboxWeight = document.getElementById('textbox-weight')
const Title         = document.getElementById('h1-title')
const ImagePokemon  = document.getElementById('img-pokemon')
const Spinner       = document.getElementById('spinner')

const API_URL = 'https://pokeapi.co/api/v2/'
let pokemons = []


/**
 * @todo 
 * Finish findPokemon implementation by selecting the best match
 * Fetch sprite from some api and load image in ImagePokemon
 * Implement caching of pokemon list
 * (optional) add accuracy slidebar
 */


const findPokemon = (height = 0, weight = 0) => {
  const results = []

  if(height > 0 && weight > 0){
    pokemons.forEach(pokemon => {
      if(Math.abs(height - pokemon.height) <= 10 && Math.abs(weight - pokemon.weight) <= 5){ // Didn't want to use ternary for code legibility
        if(results.length <=3) {
          results.push(pokemon)
          log('Pushing pokemon in result list with: ', Math.abs(height - pokemon.height), ' ', Math.abs(weight - pokemon.weight))
        }
      }
    })
  } else if(DEBUG) console.error('Height and weight are 0')
  results.sort((a,b) => a>b)
  log('Pokemons: ', results)
}

const onCheckButtonClick = (evt) => {
  log(evt)
  const height = TextboxHeight.value
  const weight = TextboxWeight.value
  Title.textContent = '...'
  ImagePokemon.className = 'img-fluid responsive__image invisible'
  Spinner.className = ''
  findPokemon(height, weight)
}

const onHeightInput = (evt) => log(evt)
const onWeightInput = (evt) => log(evt)

const _fetchPokemons = async () =>{
  const response = await fetch(`${API_URL}pokemon/?limit=964`).catch(error => console.error('Error in fetching pokemon list: ', error))
  const data = await response.json()
  
    data.results.forEach(async (entry) =>{
      const pokemon = await fetch(entry.url).catch(error => console.error('Error in fetching pokemon stats: ', error))
      const {weight, height} = await pokemon.json()
    
      pokemons.push({
          name: entry.name,
          weight: weight / 10,
          height: height * 10
        })  
    })  

}

const _init = () => {
  log('Initializing events')

  ButtonCheck.addEventListener('click', onCheckButtonClick)
  TextboxHeight.addEventListener('keypress', onHeightInput)
  TextboxWeight.addEventListener('keypress', onWeightInput)

  _fetchPokemons().then(() => console.log(pokemons))
}


export const App = {
  init: () => {
    _init()
  } 
}