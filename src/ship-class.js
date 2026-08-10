class Ship {
    constructor(length, hitCount = 0, status = false) {
    this.length = length;
    this.hitCount = hitCount;
    this.status = status;   
    }
    hit() {
        this.hitCount++
    }

    isSunk() {
        if(this.hitCount >= this.length) {
            return true
        } else {
            return false
        }
    }
}

export default Ship