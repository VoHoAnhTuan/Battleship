let view = {
    displayMessage(msg) {
        let messageArea = document.getElementById("messageArea");
        messageArea.textContent = msg;
    },

    displayMiss(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    },

    displayHit(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
}

let model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    //object arrays
    ships: [{locations: ["0", "0", "0"], hits: ["", "", ""]},
            {locations: ["0", "0", "0"], hits: ["", "", ""]},
            {locations: ["0", "0", "0"], hits: ["", "", ""]}],

    fire(guess) {
        for(let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];      
            let locations = ship.locations;
            let index = locations.indexOf(guess);  // If found return index, else return -1
            if (index >= 0) {
                // Hit
                ship.hits[index] = "hit"
                view.displayHit(guess);
                view.displayMessage("HIT");
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },

    isSunk(ship) {
        // If there's a location that doesn't have a hit, then the ship
        // is still floating, so return false; otherwise, return true.
        return (!ship.hits.includes(""));
    },

    generateShipLocations() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },

    generateShip() {
        let direction = Math.floor(Math.random() * 2);
        let row;
        let col;
        if (direction === 1) {
            // Generate a starting location for a horizontal ship
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * ((this.boardSize - this.shipLength) + 1));
        } else {
            // Generate a starting location for a vertical ship
            row = Math.floor(Math.random() * ((this.boardSize - this.shipLength) + 1));
            col = Math.floor(Math.random() * this.boardSize);
        }

        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                // add location to array for new horizontal ship
                newShipLocations.push(`${row}${(col + i)}`);
            } else {
                // add location to array for new vertical ship
                newShipLocations.push(`${(row + i)}${col}`);
            }
        }
        return newShipLocations;
    },

    collision(locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.includes(locations[j])) {
                    return true;
                }
            }
        }
        return false;
    }
}

let controller = {
    guesses: 0,

    processGuess(guess) {
        let location = this.parseGuess(guess); // Use parseGuess to validate the player's guess
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            // if the guess was a hit, and the number of ships that are sunk is equal to the number of ships in the game
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage(`You sank all my battleships, in ${this.guesses} guesses`);
            }
        }
    },

    parseGuess(guess) {
        const alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    
        if (guess === null || guess.length !== 2) {
            alert("Oops, please enter a letter and a number on the board.");
        } else {
            let firstChar = guess.charAt(0); // we grab the first character of the guess
            let row = alphabet.indexOf(firstChar); // using indexOf, we get back a number bwt 0 and 6 that corresponds to the letter, or -1 if firstChar doesn't match any of the letters in the array.
            let column = guess.charAt(1);
    
            if (isNaN(column)) {
                alert("Oops, that isn't on the board.");
            } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
                alert("Oops, that's off the board!");
            } else {
                return row + column;
            }
        }
        return null;
    },
}

function init() {
    let fireButton = document.getElementById("fireButton");
    fireButton.addEventListener("click", function() {
        let guessInput = document.getElementById("guessInput");
        let guess = guessInput.value;
        controller.processGuess(guess);
        // To reset the input
        guessInput.value = "";

        model.generateShipLocations();
    });

    let guessInput = document.getElementById("guessInput");
    guessInput.addEventListener("keypress", handleKeyPress);
}

function handleKeyPress(event) {
    let fireButton = document.getElementById("fireButton");
        if (event.keyCode === 13) {
            event.preventDefault(); // prevent page reload
            fireButton.click();
            return false;
        }
}

window.onload = init;




