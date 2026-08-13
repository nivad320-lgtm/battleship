import GameBoard from "./gameboard-class.js";

class Player {
    constructor(type) {
        this.gameBoard = new GameBoard()
        this.type = type
    }
}