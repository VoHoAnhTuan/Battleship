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
    shipsSunkn: 0,

    //object arrays
    ships: [{locations: ["06", "16", "26"], hits: ["", "", ""]},
            {locations: ["24", "34", "44"], hits: ["", "", ""]},
            {locations: ["10", "11", "12"], hits: ["", "", ""]}],

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
    }
}

model.fire("53");
model.fire("06");
model.fire("16");
model.fire("26");
model.fire("34");
model.fire("24");
model.fire("44");
model.fire("12");
model.fire("11");
model.fire("10");