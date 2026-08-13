ToDo
- [x] isItLegal() function
    - [x] Is the ship outside of boundary
    - [x] Is the ship overlapping
    - [x] Has the ship already been placed

- [] Check if every ship has been placed

- [x] receiveAttack function that takes a pair of coordinates
    - [x] determines whether or not the attack hit a ship 
    - [x]  sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
    // Note: Do I have to save the array of missed shots? 
    // Wondering because #returnCoordinateValue() is already returning it

- [x] Gameboards should be able to report whether or not all of their ships have been sunk.

- [x] Create a Player class/factory.
    - [x] There will be two types of players in the game, ‘real’ players and ‘computer’ players.
    - [x] Each player object should contain its own gameboard.