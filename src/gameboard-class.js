import Ship from "./ship-class.js";

class GameBoard {
    constructor() {
        this.board = this.#generateBoard();
        this.ships = this.#initiateShips();
    }

    #generateBoard() {
        // Note: You could turn these into a parameter
        const rows = 10;
        const cols = 10;

        const board = Array.from({ length: rows }, () =>
            new Array(cols).fill(0),
        );
        return board;
    }

    #initiateShips() {
        // create map of ships for constructor
        const ships = new Map();

        ships.set("Carrier", new Ship(5));
        ships.set("BattleShip", new Ship(4));
        ships.set("Cruiser", new Ship(3));
        ships.set("Submarine", new Ship(3));
        ships.set("Destroyer", new Ship(2));

        return ships;
    }

    placeShip(shipType, x, y, headDirection) {
        const thisShip = this.ships.get(shipType);
        // console.log(thisShip);

        // we need isItLegal function
        this.#isItLegal(thisShip, x, y, headDirection);

        const updatedCor = this.#headDirectionLogic(
            thisShip,
            x,
            y,
            headDirection,
        );

        // console.log(updatedCor);
        this.#setShipStatus(thisShip, updatedCor);
    }

    receiveAttack(x, y) {
        // If it includes H, B or T
        // X - Been Hit
        // # - Missed
        // return hit

        const coordinate = this.checkBoard(x, y);
        const corValue = this.#returnCoordinateValue(coordinate);
        if (corValue === "ship") {
            // Find which ship it is
            const hitShipType = this.coordinateToShip(x, y);
            // console.log(coordinate)
            // console.log('Checking coordinate ' + x, y)
            // console.log('called ' + hitShipType)

            // Update hitCount of the ship
            const hitShip = this.ships.get(hitShipType);
            // console.log('called ' + hitShip)
            hitShip.hit();

            // mutate the board
            this.#changeMark(x, y, "X");

            return "Hit!";
        } else if (corValue === "ocean") {
            // mutate the board
            this.#changeMark(x, y, "#");

            return "Miss!";
        } else if (corValue === "hit" || corValue === "miss") {
            // console.log("Line executed");
            throw new Error("You cannot attack same coordinate twice!");
        }

        // send hit() function to the correct ship
        // this.ships is a map of ships
        /* 
            for ship of ships map

         */
    }
    coordinateToShip(x, y) {
        //Gets coordinate and returns the ship
        const searchCor = [x, y];
        // Check the board
        for (const [key, value] of this.ships) {
            // console.log("key: " + key);
            // console.log("value: ", value.status.coordinates);
            if (value.status.coordinates) {
                if (
                    value.status.coordinates.some(
                        (e) => e.toString() === searchCor.toString(),
                    )
                ) {
                    console.log(key)
                    return key;
                }
            }
        }
        return;
    }

    allSunk(){
        for (const [key] of this.ships) {
        if(!this.ships.get(key).isSunk()) {
            return false
        }
    } 
        return true
    }

    #returnCoordinateValue(value) {
        const shipSign = ["H", "B", "T"];
        const hit = "X";
        const miss = "#";
        const ocean = 0;
        if (shipSign.some((e) => e === value)) {
            return "ship";
        } else if (hit === value) {
            return "hit";
        } else if (miss === value) {
            return "miss";
        } else if (ocean === value) {
            return "ocean";
        }
    }

    // Note: There is something wrong with this logic
    printBlock([startX, startY], [endX, endY]) {
        const blocks = [];
        if (
            Math.abs(startX) - Math.abs(endX) !== 0 &&
            Math.abs(startY) - Math.abs(endY) !== 0
        ) {
            throw new Error("1D Only");
        }

        // NOTE: I don't like how I'm repeating myself

        // If X difference is 0
        if (Math.abs(startX) - Math.abs(endX) === 0) {
            if (startY >= endY) {
                for (let i = 0; i <= Math.abs(startY - endY); i++) {
                    blocks.push(this.checkBoard(startX, startY - i));
                }
            } else {
                for (let i = 0; i <= Math.abs(startY - endY); i++) {
                    blocks.push(this.checkBoard(startX, startY + i));
                }
            }
        }
        // If Y difference is 0
        // (SOLVED) BUG: This does not care which direction.
        // For example eastHead Carrier should decrease X but it always increase
        else if (Math.abs(startY) - Math.abs(endY) === 0) {
            if (startX >= endX) {
                for (let i = 0; i <= Math.abs(startX - endX); i++) {
                    blocks.push(this.checkBoard(startX - i, startY));
                }
            } else {
                for (let i = 0; i <= Math.abs(startX - endX); i++) {
                    blocks.push(this.checkBoard(startX + i, startY));
                }
            }
        }
        return blocks;
    }

    #isItLegal(ship, x, y, headDirection) {
        // Check for duplicates
        const tailCoordinate = this.#tailPosition(ship, x, y, headDirection);
        if (ship.status.placed === true) {
            throw new Error("You cannot have duplicates!");
        }

        // Check of out of bounds
        if (
            !this.#outOfBoundsCheck(x, y, tailCoordinate[0], tailCoordinate[1])
        ) {
            throw new Error("You cannot place outside the board!");
        }

        // Preview of its route
        const preview = this.printBlock([x, y], tailCoordinate);
        // console.log(preview)
        // console.log(tailCoordinate)

        // Check for overlaps
        if (preview.some((element) => element !== 0)) {
            throw new Error("You cannot have overlaps!");
        }
    }

    #tailPosition(ship, x, y, headDirection) {
        const length = ship.length;
        if (headDirection === "eastHead") {
            return [x - length + 1, y];
        } else if (headDirection === "westHead") {
            return [x + length - 1, y];
        } else if (headDirection === "northHead") {
            return [x, y + length - 1];
        } else if (headDirection === "southHead") {
            return [x, y - length + 1];
        }
    }

    #setShipStatus(ship, shipCoordinate) {
        ship.status = {
            placed: true,
            coordinates: shipCoordinate,
        };
    }

    #headDirectionLogic(ship, x, y, headDirection) {
        // Note: Need to check if it's legal!
        const shipLength = ship.length;
        const bodyMark = "B";
        const tailMark = "T";
        // Save and return coordinates that changed
        const changedCor = [];
        // Set Head
        this.#changeMark(x, y, "H");
        changedCor.push([x, y]);
        let tempX = x;
        let tempY = y;
        // eastHead

        if (headDirection === "eastHead") {
            // Set Body
            for (let i = 0; i < shipLength - 2; i++) {
                this.#changeMark((tempX -= 1), tempY, bodyMark);
                changedCor.push([tempX, tempY]);
            }
            // Set Tail
            this.#changeMark(x - shipLength + 1, y, tailMark);
            changedCor.push([x - shipLength + 1, y]);
        }

        // westHead
        if (headDirection === "westHead") {
            // Set Body
            for (let i = 0; i < shipLength - 2; i++) {
                this.#changeMark((tempX += 1), tempY, bodyMark);
                changedCor.push([tempX, tempY]);
            }
            // Set Tail
            this.#changeMark(x + shipLength - 1, y, tailMark);
            changedCor.push([x + shipLength - 1, y]);
        }

        // northHead
        if (headDirection === "northHead") {
            // Set Body
            for (let i = 0; i < shipLength - 2; i++) {
                this.#changeMark(tempX, (tempY += 1), bodyMark);
                changedCor.push([tempX, tempY]);
            }
            // Set Tail
            this.#changeMark(x, y + shipLength - 1, tailMark);
            changedCor.push([x, y + shipLength - 1]);
        }

        // southHead
        if (headDirection === "southHead") {
            // Set Body
            for (let i = 0; i < shipLength - 2; i++) {
                this.#changeMark(tempX, (tempY -= 1), bodyMark);
                changedCor.push([tempX, tempY]);
            }
            // Set Tail
            this.#changeMark(x, y - shipLength + 1, tailMark);
            changedCor.push([x, y - shipLength + 1]);
        }
        return changedCor;
    }

    #changeMark(x, y, mark) {
        this.board[y][x] = mark;
    }

    checkBoard(x, y) {
        return this.board[y][x];
    }
    #outOfBoundsCheck(startX, startY, tailX, tailY) {
        if (
            startX < 0 ||
            startY < 0 ||
            tailX < 0 ||
            tailY < 0 ||
            startX > 9 ||
            startY > 9 ||
            tailX > 9 ||
            tailY > 9
        ) {
            return false;
        }
        return true;
    }
}

export default GameBoard;
