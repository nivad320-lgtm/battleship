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

        ships.set("Carrier", new Ship(6));
        ships.set("BattleShip", new Ship(5));
        ships.set("Cruiser", new Ship(3));
        ships.set("Submarine", new Ship(3));
        ships.set("Destroyer", new Ship(2));

        return ships;
    }
    placeShip(shipType, x, y, headDirection) {
        const thisShip = this.ships.get(shipType);
        console.log(thisShip);

        // we need isItLegal function
        this.#isItLegal(thisShip, x, y, headDirection);

        this.#headDirectionLogic(thisShip, x, y, headDirection);

        this.#changeShipStatusToTrue(thisShip);
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
            }
            else {
                for (let i = 0; i <= Math.abs(startY - endY); i++) {
                    blocks.push(this.checkBoard(startX, startY + i));
                }
            }
        }
        // If Y difference is 0
        // BUG: This does not care which direction.
        // For example eastHead Carrier should decrease X but it always increase
        else if (Math.abs(startY) - Math.abs(endY) === 0) {
            if(startX >= endX) {
                for (let i = 0; i <= Math.abs(startX - endX); i++) {
                    blocks.push(this.checkBoard(startX - i, startY));
                }
            }
            else {
                for (let i = 0; i <= Math.abs(startX - endX); i++) {
                    blocks.push(this.checkBoard(startX + i, startY));
                }
            }
        }
        return blocks;
    }
    #isItLegal(ship, x, y, headDirection) {
        // Check for duplicates
        if (ship.status === true) {
            throw new Error("You cannot have duplicates!");
        }

        // Check for overlaps
        const preview = this.printBlock(
            [x, y],
            this.#tailPosition(ship, x, y, headDirection),
        );
        console.log(preview)
        console.log(this.#tailPosition(ship, x, y, headDirection))
        if (preview.some((element) => element !== 0)) {
            throw new Error("You cannot have overlaps!");
            // }
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

    #changeShipStatusToTrue(ship) {
        ship.status = true;
    }

    #headDirectionLogic(ship, x, y, headDirection) {
        // Note: Need to check if it's legal!
        const shipLength = ship.length;
        const bodyMark = "B";
        const tailMark = "T";
        // Set Head
        this.#changeMark(x, y, "H");

        let tempX = x;
        let tempY = y;
        // eastHead

        if (headDirection === "eastHead") {
            // Set Body
            for (let i = 0; i < shipLength - 2; i++) {
                this.#changeMark((tempX -= 1), tempY, bodyMark);
            }
            // Set Tail
            this.#changeMark(x - shipLength + 1, y, tailMark);
        }

        // westHead
        if (headDirection === "westHead") {
            // Set Body
            for (let i = 0; i < shipLength - 2; i++) {
                this.#changeMark((tempX += 1), tempY, bodyMark);
            }
            // Set Tail
            this.#changeMark(x + shipLength - 1, y, tailMark);
        }

        // northHead
        if (headDirection === "northHead") {
            // Set Body
            for (let i = 0; i < shipLength - 2; i++) {
                this.#changeMark(tempX, (tempY += 1), bodyMark);
            }
            // Set Tail
            this.#changeMark(x, y + shipLength - 1, tailMark);
        }

        // southHead
        if (headDirection === "southHead") {
            // Set Body
            for (let i = 0; i < shipLength - 2; i++) {
                this.#changeMark(tempX, (tempY -= 1), bodyMark);
            }
            // Set Tail
            this.#changeMark(x, y - shipLength + 1, tailMark);
        }
    }
    #changeMark(x, y, mark) {
        this.board[y][x] = mark;
    }
    checkBoard(x, y) {
        return this.board[y][x];
    }
}

export default GameBoard;
