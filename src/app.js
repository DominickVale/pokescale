/* eslint-disable no-useless-escape */
import GiratinaImage from '../assets/img/giratina.png'

const DEBUG = true
const log = (...args) => DEBUG && console.info.apply(console, args)


const ButtonCheck   = document.getElementById('check-button')
const ImagePokemon  = document.getElementById('img-pokemon')
const Spinner       = document.getElementById('spinner')
const TextboxHeight = document.getElementById('textbox-height')
const TextboxWeight = document.getElementById('textbox-weight')
const Title         = document.getElementById('h1-title')

const API_URL         = 'https://pokeapi.co/api/v2/'
const SPRITES_API_URL = 'https://pokeres.bastionbot.org/images/pokemon/'
const STORAGE_KEY     = 'pokemonsList'
const API_LIMIT = 964

let pokemons = []

/**
 * @todo 
 * The app is not going to be able to work because of the inevitable 964 requests it has to start
 * in order to fetch all the Pokèmon and list for them
 * (optional) add accuracy slidebar
 */



const setTitle = (text) => Title.textContent = text
const toggleSpinner = () => Spinner.className === '' ? Spinner.className = 'd-none' : Spinner.className = ''  


/**
 * Just sorts by closest matching entry. Entry with the smaller difference from the input bubbles up.
 * @param {array} array - The array to sort
 * @param {number} height - The input height
 * @param {number} weight - The input weight
 */
const sortByDifference = (array, height, weight) =>{
  array.sort((pokemonA, pokemonB) => 
  Math.abs(height - pokemonA.height) > Math.abs(height - pokemonB.height) 
  && Math.abs(weight - pokemonA.weight) > Math.abs(weight - pokemonB.weight))
}



/**
 * Fetches the Pokèmon list, then fills the result with objects containing the name, height, weight and sprite of each of them.
 * Then waits until all the promises are fulfilled.
 * @async
 * @returns {(promise|array)} the array of Pokèmons. 
 */
const _fetchPokemons = async () =>{
  let result = []
  let promises = []

  if(!window.localStorage.getItem(STORAGE_KEY)){
    setTitle('Fetching Pokèmons...')
    toggleSpinner()
    try{
      const response = await fetch(`${API_URL}pokemon/?limit=${API_LIMIT}`)
      const data = await response.json()

      for(let entry of data.results){
        const pokemon = await fetch(entry.url)
        const {id, weight, height} = await pokemon.json()
        promises.push(pokemon)

        result.push({
            name: entry.name,
            weight: weight / 10,
            height: height * 10,
            sprite: `${SPRITES_API_URL}${id}.png`
          })  
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result))

    }
    catch(error) {  DEBUG && console.error('Error in fetching pokèmon list: ', error)  }

    await Promise.all(promises)  // wait for all the requests to be fullfilled
    setTitle('Input your height and weight!')
    toggleSpinner()
  } else {
    log('Retrieving local storage data...')
    result = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
  }

  return result
}



/**
 * Finds the correct Pokèmon by traversing the list and calculating the difference of the input height and weight against Pokèmons.
 * @param {number} [Height=0] - The input height
 * @param {number} [Weight=0] - The input weight
 * @returns {object} the best matching Pokèmon.
 */
const findPokemon = async (height = 0, weight = 0) => {
  const results = []
  const MAX_RESULTS = 2
  const MAX_OFFSET = 30

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



/**
 * Checks if the input is a number or the key 'Enter'. 
 * 
 * When 'Enter' is pressed submit the form...
 * (Note: this is a workaround. Forms should automatically have this functionality but i don't know why it's not working)
 */
const inputValidation = (evt) => {
  if (evt.keyCode == 13 && TextboxHeight.value + TextboxWeight.value >= 2) ButtonCheck.click()
  if(!(evt.charCode >= 48 && evt.charCode <= 57)){
    evt.preventDefault()
  }
}



const onCheckButtonClick = async () => {
  const height = TextboxHeight.value
  const weight = TextboxWeight.value
  setTitle('...')
  ImagePokemon.className = 'img-fluid responsive__image invisible'
  toggleSpinner()
  
  const matchingPokemon = await findPokemon(height, weight)
  log('Matching pokemon: ', matchingPokemon)
  toggleSpinner()

  if(matchingPokemon){ 
    Title.className += 'text-center mx-auto'
    setTitle(`You are ${matchingPokemon.name}!`)
    ImagePokemon.setAttribute('src', matchingPokemon.sprite)
    ImagePokemon.setAttribute('alt', `An image of ${matchingPokemon.name}`)
    ImagePokemon.className = 'img-fluid responsive__image'
  } else {
    Title.innerHTML = 'No Pokèmon found... Try&nbsp;again!'
    Title.className += ' text-danger'
    ImagePokemon.className = 'img-fluid responsive__image'
    ImagePokemon.setAttribute('alt', 'The mighty giratina weighing 750 kilograms!')
    ImagePokemon.setAttribute('src', GiratinaImage)
  }
}






const _init = async () => {
  ButtonCheck.addEventListener('click', onCheckButtonClick)
  TextboxHeight.addEventListener('keypress', inputValidation)
  TextboxWeight.addEventListener('keypress', inputValidation)
  pokemons = await _fetchPokemons()
}


export const App = {
  init: () => {
    _init()
  } 
}