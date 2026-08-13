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
            "You cannot place outside the board!",
        );
        expect(() =>
            myBoard.placeShip("BattleShip", 0, -2, "northHead"),
        ).toThrow("You cannot place outside the board!");
        expect(() => myBoard.placeShip("Submarine", -3, 0, "eastHead")).toThrow(
            "You cannot place outside the board!",
        );
        expect(() =>
            myBoard.placeShip("BattleShip", 0, 9, "northHead"),
        ).toThrow("You cannot place outside the board!");
        expect(() => myBoard.placeShip("Submarine", 9, 1, "southHead")).toThrow(
            "You cannot place outside the board!",
        );
    });
});

describe("receiveAttack", () => {
    let myBoard;
    beforeEach(() => {
        myBoard = new GameBoard();
        myBoard.placeShip("Cruiser", 3, 3, "eastHead");
    });
    test("receiveAttack function exists", () => {
        expect(myBoard.receiveAttack(3, 3)).toBeDefined();
    });
    test("determine whether or not attack hit the ship", () => {
        expect(myBoard.receiveAttack(3, 3)).toBe("Hit!");
        expect(myBoard.receiveAttack(4, 3)).toBe("Miss!");
    });
    test("cannot attack same coordinate twice", () => {
        expect(myBoard.receiveAttack(9, 9)).toBe("Miss!");
        expect(() => myBoard.receiveAttack(9, 9)).toThrow(
            "You cannot attack same coordinate twice!",
        );
    });
    test("records the coordinate of the missed shot", () => {
        myBoard.receiveAttack(9, 9);
        expect(myBoard.checkBoard(9, 9)).toBe("#");
    });
    test("coordinateToShip returns ship on a specific coordinate", () => {
        expect(myBoard.coordinateToShip(3, 3)).toBe("Cruiser");
    });
    test("sends the `hit` function to the correct ship", () => {
        myBoard.receiveAttack(3, 3);
        const cruiser = myBoard.ships.get("Cruiser");
        expect(cruiser.hitCount).toBe(1);
    });
    test("sends the `hit` function to the correct ship 2", () => {
        myBoard.placeShip("Carrier", 6, 4, "southHead");
        myBoard.receiveAttack(6, 2);
        const carrier = myBoard.ships.get("Carrier");
        expect(carrier.hitCount).toBe(1);
    });
});

describe("allSunk", () => {
    // Gameboards should be able to report whether or not all of their ships have been sunk.
    let myBoard;
    beforeEach(() => {
        myBoard = new GameBoard();
        myBoard.placeShip("Submarine", 4, 6, "northHead");
        myBoard.placeShip("Destroyer", 8, 9, "westHead");
        myBoard.placeShip("Cruiser", 3, 3, "eastHead");
        myBoard.placeShip("BattleShip", 8, 5, "southHead");
        myBoard.placeShip("Carrier", 6, 4, "southHead");
    });
    test("allSunk function exists", () => {
        expect(myBoard.allSunk()).toBeDefined();
    });

    test("allSunk returns false if a ship is not sank", () => {
        const attackCoordinates = [
            // Submarine (x: 4, y: 6 -> northHead)
            [4, 6],
            [4, 7],
            [4, 8],
            // Destroyer (x: 8, y: 9 -> westHead)
            [8, 9],
            [9, 9],
            // Cruiser (x: 3, y: 3 -> eastHead)
            [3, 3],
            [2, 3],
            [1, 3],
            // Battleship (x: 8, y: 5 -> southHead)
            [8, 2],
            [8, 3],
            [8, 4],
            [8, 5],
        ];
        attackCoordinates.forEach(([x,y])=>myBoard.receiveAttack(x,y))
        expect(myBoard.allSunk()).toBe(false);
    });
    test("allSunk returns true if every ships sank", () => {
        const attackCoordinates = [
            // Submarine (x: 4, y: 6 -> northHead)
            [4, 6],
            [4, 7],
            [4, 8],
            // Destroyer (x: 8, y: 9 -> westHead)
            [8, 9],
            [9, 9],
            // Cruiser (x: 3, y: 3 -> eastHead)
            [3, 3],
            [2, 3],
            [1, 3],
            // Battleship (x: 8, y: 5 -> southHead)
            [8, 2],
            [8, 3],
            [8, 4],
            [8, 5],
            // Carrier (x: 6, y: 4 -> southHead)
            [6, 0],
            [6, 1],
            [6, 2],
            [6, 3],
            [6, 4],
        ];
        attackCoordinates.forEach(([x,y])=>myBoard.receiveAttack(x,y))
        expect(myBoard.allSunk()).toBe(true);
    });
    //Loop through ship and see isSunk() is true for all
    // if all of them return true, then it is true

    /* 

    */
});
