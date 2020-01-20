import GiratinaImage from '../public/assets/img/giratina.png'
import pokemonsList from '../public/assets/pokemonsList.json'

const DEBUG = true
const NOT_LOADED = 'NOT_LOADED'
const log = (...args) => DEBUG && console.info.apply(console, args)
const getElementById = (id) => document.getElementById(id) || NOT_LOADED

const ButtonCheck   = getElementById('check-button')
const ImagePokemon  = getElementById('img-pokemon')
const Spinner       = getElementById('spinner')
const TextboxHeight = getElementById('textbox-height')
const TextboxWeight = getElementById('textbox-weight')
const Title         = getElementById('h1-title')



/**
 * @todo 
 * The app is not going to be able to work because of the inevitable 964 requests it has to start
 * in order to fetch all the Pokèmon and list for them
 * (optional) add accuracy slidebar
 */



const setTitle = (text) => Title.textContent = text
const toggleSpinner = () => Spinner.className === '' ? Spinner.className = 'd-none' : Spinner.className = ''  


/**
 * Just sorts by closest matching entry. Entries with smaller difference from the input bubbles up.
 * @param {array} array - The array to sort
 * @param {number} height - The input height
 * @param {number} weight - The input weight
 */
const sortByDifference = (array, height, weight) =>{
  array.sort((pokemonA, pokemonB) => 
    Math.abs(weight - pokemonA.weight) > Math.abs(weight - pokemonB.weight)
    || Math.abs(height - pokemonA.height) > Math.abs(height - pokemonB.height) ? 1 : -1)
}



/**
 * Finds the correct Pokèmon by traversing the list and calculating the difference of the input height and weight against Pokèmons.
 * @param {number} [Height=0] - The input height
 * @param {number} [Weight=0] - The input weight
 * @returns {object} the best matching Pokèmon.
 */
const findPokemon = async (height = 0, weight = 0) => {
  const results = []
  const MAX_RESULTS = 50
  const MAX_OFFSET = 20

  for(let pokemon of pokemonsList){
    if(Math.abs(height - pokemon.height) < MAX_OFFSET && Math.abs(weight - pokemon.weight) < MAX_OFFSET){ // Didn't want to use ternary for code legibility
    if(results.length < MAX_RESULTS) {
      results.push(pokemon)
      log('Pushing Pokèmon in result list with offsets: ', Math.abs(height - pokemon.height), ' ', Math.abs(weight - pokemon.weight))
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
  const height = parseInt(TextboxHeight.value)
  const weight = parseInt(TextboxWeight.value)
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
  if(ButtonCheck   !== NOT_LOADED) ButtonCheck.addEventListener('click', onCheckButtonClick)
  if(TextboxHeight !== NOT_LOADED) TextboxHeight.addEventListener('keypress', inputValidation)
  if(TextboxWeight !== NOT_LOADED) TextboxWeight.addEventListener('keypress', inputValidation)
  log('Total Pokèmons count: ', pokemonsList.length)
}


export const App = {
  init: () => {
    _init()
  } 
}