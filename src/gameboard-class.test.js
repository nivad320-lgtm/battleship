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
        const myShips = Array.from(myBoard.ships.keys());
        console.log(myShips);
        const shouldHave = [
            "Carrier",
            "BattleShip",
            "Cruiser",
            "Submarine",
            "Destroyer",
        ];

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
        expect(myBoard.checkBoard(0, 1)).toBe("H");
        expect(myBoard.board[2][0]).toBe("B");
        expect(myBoard.board[3][0]).toBe("B");
        expect(myBoard.board[4][0]).toBe("T");
    });
    test("Can place Carrier", () => {
        myBoard.placeShip("Carrier", 5, 7, "eastHead");
        expect(myBoard.board[7][5]).toBe("H");
        expect(myBoard.board[7][4]).toBe("B");
        expect(myBoard.board[7][3]).toBe("B");
        expect(myBoard.board[7][2]).toBe("B");
        expect(myBoard.board[7][1]).toBe("T");
    });
});

describe("isItLegal works", () => {
    let myBoard;
    beforeEach(() => {
        myBoard = new GameBoard();
    });
    test("Block duplicate ships", () => {
        myBoard.placeShip("Destroyer", 5, 7, "eastHead");
        expect(myBoard.checkBoard(5, 7)).toBe("H");
        expect(myBoard.checkBoard(4, 7)).toBe("T");
        expect(() => myBoard.placeShip("Destroyer", 0, 0, "northHead")).toThrow(
            "You cannot have duplicates!",
        );
        expect(myBoard.checkBoard(0, 0)).toBe(0);
    });
    test("printBlocks function work", () => {
        expect(() => myBoard.printBlock([3, 2], [4, 5])).toThrow("1D Only");
        myBoard.placeShip("Carrier", 7, 1, "northHead");
        expect(myBoard.printBlock([7, 1], [7, 5])).toStrictEqual([
            "H",
            "B",
            "B",
            "B",
            "T",
        ]);
        expect(myBoard.printBlock([3, 4], [8, 4])).toStrictEqual([
            0,
            0,
            0,
            0,
            "B",
            0,
        ]);
    });

    test("Block overlapping", () => {
        myBoard.placeShip("Carrier", 7, 1, "northHead");
        expect(() => myBoard.placeShip("Cruiser", 5, 5, "westHead")).toThrow(
            "You cannot have overlaps!",
        );
        expect(() => myBoard.placeShip("Destroyer", 7, 1, "northHead")).toThrow(
            "You cannot have overlaps!",
        );
    });

    test("Blocks out of bound coordinates", () => {
        expect(() => myBoard.placeShip("Submarine", -3, 0, "eastHead")).toThrow(
            "You cannot place outside the board!"
        )
        expect(() => myBoard.placeShip("BattleShip", 0, -2, "northHead")).toThrow(
            "You cannot place outside the board!"
        )
        expect(() => myBoard.placeShip("Submarine", -3, 0, "eastHead")).toThrow(
            "You cannot place outside the board!"
        )
        expect(() => myBoard.placeShip("BattleShip", 0, 9, "northHead")).toThrow(
            "You cannot place outside the board!"
        )
        expect(() => myBoard.placeShip("Submarine", 9, 1, "southHead")).toThrow(
            "You cannot place outside the board!"
        )
    })
});

describe("receiveAttack", () => {
    let myBoard;
    beforeEach(() => {
        myBoard = new GameBoard();
        myBoard.placeShip("Cruiser", 3, 3, "eastHead") 
    });
    test("receiveAttack function exists", () => {
        expect(myBoard.receiveAttack(3,3)).toBeDefined();
    })
    test("determine whether or not attack hit the ship" , () => {
        expect(myBoard.receiveAttack(3,3)).toBe("Hit!")
        expect(myBoard.receiveAttack(4,3)).toBe("Miss!")
    })
    test("cannot attack same coordinate twice", () => {
        expect(myBoard.receiveAttack(9,9)).toBe("Miss!")
        expect(() => myBoard.receiveAttack(9,9)).toThrow(
            "You cannot attack same coordinate twice!"
        )
    })
})
