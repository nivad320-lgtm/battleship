class Ship {
    constructor(length, hitCount, isSunk) {
    this.length;
    this.hitCount = 0;
    this.isSunk;   
    }
    hit() {
        this.hitCount++
    }
}

export default Ship