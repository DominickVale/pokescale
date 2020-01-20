# Pokèscale - [See it live on pokescale.netlify.com](https://pokescale.netlify.com/)

## What is this?

> Ever wondered what your spirit Pokèmon would be? Well, now you can know it based off your height and weight! <br />
> N.B Also works for your favorite pets!


## What is my motivation for creating this project?

> I really wanted to know what Pokèmon i and my cats were in relation to my height and weight... <br />

## How will users interact with your web site?

* User is welcomed by the app's pitch description.
* User can click on "go" or use the top right navigation.
* User can input their height and weight, click on check and the result should appear.

## What 3rd Party API(s) will you integrate with?

* [Pokèapi](https://pokeapi.co)  (check note)
* [Pokeres](https://pokeres.bastionbot.org/images/pokemon/)

## Tech Stack

* node.js
* webpack
* eslint
* CSS (SASS):
  * Bootstrap

## "Stretch" features

* Use a web browser API like geolocation, battery / device, gamepad etc.
* Use a linter (eslint)
* Mobile first approach
* SEO friendly tags
* Build process withwebpack / sass
* Settings persistence in the browser with Local Storage or IndexDB
* Structure your javascript code in an MV* pattern (No 3rd party libraries)
* Use a state management pattern in your JavaScript code (No 3rd party libraries)
* Document JavaScript with JSDoc
* PWA
* 100% lighthouse score

## Process

* I started by defining my idea of what the app should do and look like.
* Proceeded to lay down some wireframes and searching for inspiration on the web. (The color palette is the official Pokèmons one)
* Started defining the skeleton HTML and basic IN-HTML styling using Bootstrap's utilities.
* Redefined the sass as i felt like more customization was needed.
* I then started to define how the actual app's functionality should behave in more detail and put down into code.
* While developing this app i've been investing much of the time prioritizing learning, but i tried to push commits at least twice a day.

[Wireframes / Design - Figma](https://www.figma.com/file/CVhXqtclIVVRhrRsv8DrqE/Untitled?node-id=0%3A1)

### Note
> There's a branch called `alt` which contains an alternate `app.js` version which is the one actually supposed to use the REST Pokèapi.
>I stopped using that method because i had to make ***964*** requests in order to correctly get a list of pokèmons with their respective height and weight. I decided then to just do it once, paste the content into `pokemonList.json` and simply use that instead of the aforementioned method. 
> </br>
> *964 = ~100mb in +~6minutes.* 