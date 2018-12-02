# Phaser + ES6 + Webpack + React
#### A bootstrap project to create games with Phaser + ES6 + Webpack + React / Redux for UI

The starting point of this project was forked from  [this repository](https://github.com/lean/phaser-es6-webpack.git)

In this project i will attempt to create a gui system using React, the main goal is to make it the less intrusive on game code as posible.

## Features
All features from the original repo + :

- possibility to show a simple message from your game.
- React + Redux + React Router 4 integration.


### Example for showing a message : 
On this example a message is shown when you click on the rotating mushroom : 

```javascript
import Phaser from 'phaser'

import { show } from '../gui-system/SimpleMessage'

export default class extends Phaser.Sprite {
  onClick() {
    show('Hello boys and girls', () => {
      console.log('Message is closed')
    })
  }
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)

    this.inputEnabled = true;

    this.events.onInputDown.add(this.onClick, this);
  }

  update () {
    this.angle += 1
  }
}

```

Here i isolate the code responsible for showing the message : 

```javascript
...
    import { show } from '../gui-system/SimpleMessage'
...

    show('Hello boys and girls', () => {
      console.log('Message is closed')
    })
```

Notice that no DOM manipulation was done from the game code, we want to keep the possibility to replace the whole gui system if needed in the future.


# Setup
To use this bootstrap you’ll need to install a few things before you have a working copy of the project.

## 1. Clone this repo:

Navigate into your workspace directory.

Run:

```git clone https://github.com/bmarwane/phaser-es6-webpack-react``

## 2. Install node.js and npm:

https://nodejs.org/en/


## 3. Install dependencies (optionally you could install [yarn](https://yarnpkg.com/)):

Navigate to the cloned repo’s directory.

Run:

```npm install``` 

or if you choose yarn, just run ```yarn```

## 4. Run the development server:

Run:

```npm run dev```

This will run a server so you can run the game in a browser.

Open your browser and enter localhost:3000 into the address bar.

Also this will start a watch process, so you can change the source and the process will recompile and refresh the browser


## Build for deployment:

Run:

```npm run deploy```

This will optimize and minimize the compiled bundle.

## Credits
Big thanks to this great repos:

https://github.com/belohlavek/phaser-es6-boilerplate

https://github.com/cstuncsik/phaser-es6-demo
