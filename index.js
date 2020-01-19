/**
 * Hi, thank you for checking out my repository.
 * I'm always looking for ways to improve, so i would really appreciate any kind of feedback.
 *
 * @copyright Dominick Vale 2020
 */


// eslint-disable-next-line no-unused-vars
import main from './styles/main.sass'
import {App} from './src/app'

window.addEventListener('load', () => {
  App.init()
  if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').then(
    () => console.info('Correctly installed service worker!'),
    error => console.error('Couldn\'t install service worker... ', error)
  )
})
