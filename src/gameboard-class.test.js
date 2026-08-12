import GameBoard from "./gameboard-class.js";

describe("GameBoard class test", () => {
    let myBoard;
    beforeEach(() => {
        myBoard = new GameBoard();
    });
    test("myBoard class is defined", () => {
        expect(myBoard).toBeInstanceOf(GameBoard);
    });
    test("myBoard generates 10x10 grid", () => {
        expect(myBoard.board.length).toBe(10);
        expect(
            myBoard.board.every((element) => {
                return element.length === 10;
            }),
        ).toBe(true);
    });

    test("myBoard only have 0", () => {
        expect(
            myBoard.board.every((element) => {
                return element.every((element) => element === 0);
            }),
        ).toBe(true);
    });
});

describe("GameBoard initiates ships", () => {
    let myBoard;
    beforeEach(() => {
        myBoard = new GameBoard();
    });
    test("Ship constructor exists", () => {
        const myShips = Array.from(myBoard.ships.keys())
        console.log(myShips)
        const shouldHave = ['Carrier', 'BattleShip', 'Cruiser', 'Submarine', 'Destroyer'];

        shouldHave.map((m) => expect(myShips).toContain(m));
    });
});

describe("GameBoard places ships at specific coordinates", () => {
    let myBoard;
    beforeEach(() => {
        myBoard = new GameBoard();
    });
    test("Can place Destroyer", () => {
        myBoard.placeShip("Destroyer", 0, 0, "westHead");
        expect(myBoard.board[0][0]).toBe("H");
        expect(myBoard.board[0][1]).toBe("T");
    });
    test("Can place BattleShip", () => {
        myBoard.placeShip("BattleShip", 0, 1, "northHead");
        expect(myBoard.checkBoard(0,1)).toBe("H");
        expect(myBoard.board[2][0]).toBe("B");
        expect(myBoard.board[3][0]).toBe("B");
        expect(myBoard.board[4][0]).toBe("B");
        expect(myBoard.board[5][0]).toBe("T");
    });
    test("Can place Carrier", () => {
        myBoard.placeShip("Carrier", 5, 7, "eastHead");
        expect(myBoard.board[7][5]).toBe("H");
        expect(myBoard.board[7][4]).toBe("B");
        expect(myBoard.board[7][3]).toBe("B");
        expect(myBoard.board[7][2]).toBe("B");
        expect(myBoard.board[7][1]).toBe("B");
        expect(myBoard.board[7][0]).toBe("T");
    });
});
