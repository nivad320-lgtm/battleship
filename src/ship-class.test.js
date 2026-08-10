    import Ship from "./ship-class.js";

    // Begin your app by creating the Ship class/factory (your choice).

    describe("Ship class tests", () => {
        let myShip;
        beforeEach(() => {
            myShip = new Ship();
        });

        test("Ship class exists", () => {
            expect(myShip).toBeDefined();
        });
        // Ships should have a hit() function that increases the number of ‘hits’ in your ship.
        test("hit() function exists", () => {
            expect(myShip.hit).toBeDefined();
        });

        test("hit() increases the number of hits in your ship", () => {
            myShip.hit();
            expect(myShip.hitCount).toBe(1);
        });

        test("isSunk() works", () => {
            //  isSunk() should calculates whether a ship is considered sunk based on its length and the number of hits it has received.
            console.log(typeof(myShip.isSunk))
            expect(myShip.isSunk()).toBeDefined();
        });
    });
