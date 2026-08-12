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
        expect(()=>myBoard.printBlock([3,2],[4,5])).toThrow('1D Only')
        myBoard.placeShip("Carrier", 7, 1, "northHead");
        expect(myBoard.printBlock([7,1], [7,6])).toStrictEqual(['H', 'B', 'B', 'B', 'B', 'T'])
        expect(myBoard.printBlock([3,4], [8,4])).toStrictEqual([0,0,0,0,'B',0])
    });
    
    // test("Block overlapping", () => {
    //     myBoard.placeShip("Carrier", 7, 1, "northHead");
    //     expect(() => myBoard.placeShip("Cruiser", 4, 6, "westHead")).toThrow(
    //         "You cannot have overlaps!",
    //     );
    // });
});
