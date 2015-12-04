

var Direction =Object.freeze({
        UP:0,
        DOWN:1,
        LEFT:2,
        RIGHT:3
});

var Status =Object.freeze({
    EATEN_P1:0,
        EATEN_P2:1,
        FREE:2,
        OCCUPIED_P1:3,
        OCCUPIED_P2:4
});

var PlayerId =Object.freeze({
    ONE:0,
        TWO:1
});


var Player;
Player = function (playerId, pieces, playerName) {

    this._playerId = playerId;
    this._playerName = playerName;

    this._unused = [];
    this._inPlay = [];
    this._dead = [];

    this._nextMove = "";


    for (i = 0; i < pieces; i++) {
        var piece = new Piece(playerId);
        this._unused.push(piece);
    }

    this.advanceTime = function () {
        //For all inplay pieces move them
        this._inPlay.forEach(function (piece) {
            piece.advance()
        })
        //If any of the pieces become dead then remove from the inplay
        clearDead();
    }

    /**
     * Used to make the initial move for a an unused piece, requires the node and the program for the piece
     */
    this.place = function (node, program) {
        if (node.isFree() && this._unused.length > 0) {
            var nextPiece = this._unused.splice(0, 1);
            nextPiece.programPiece(program);
            nextPiece.placeOnNode(node);
            node.place(nextPiece);
            this._inPlay.add(nextPiece);
            return true;
        } else {
            return false;
        }
    }

    this.getPlayerName = function () {
        return this._playerName;
    }

    this.setNextMove = function (nextMove) {
        this._nextMove = nextMove;
    }

    this.getNextMove = function () {
        return this._nextMove;
    }

    this.toString = function () {
        clearDead();
        return null;
    }

    var clearDead = function () {
        var i = this._inPlay.length;
        while (i--) {
            if (this._inPlay[i].isDead()) {
                var piece = this._inPlay.splice(i, 1);
                this._dead.push(piece);
            }
        }
    }

    this.getPlayerId = function () {
        return this._playerId.name();
    }

    this.unusedCount = function () {
        return this._unused.length;
    }

    this.deadCount = function () {
        return this._dead.length;
    }

    this.inPlayCount = function () {
        return this._inPlay.length;
    }

    this.getScore = function () {
        var score = 0;
        this._inPlay.map(function (piece) {
            score = score + piece.getNodesEaten();
        });
        this._dead.map(function (piece) {
            score = score + piece.getNodesEaten();
        });

        return score;
    }
}

var  Piece = function(playerId) {
    this._playerId=playerid;
    this._location;
    this._program=[];
    this._moveCount;
    this._isDead;
    this._nodesEaten;






    var programPiece=function(moveOrder){
        if(isValidProgram(moveOrder)){
            this._program=moveOrder;
        }
    }

    var  isValidProgram=function(moveOrder){
        if(moveOrder == null){
            return false;
        }

        //Should have 4 moves
        if(moveOrder.length != 4){
            return false;
        }

        //Should have each move type
        return moveOrder.contains(Direction.UP) && moveOrder.contains(Direction.DOWN) &&
                moveOrder.contains(Direction.LEFT) && moveOrder.contains(Direction.RIGHT);
    }

    public Direction advance(){
        if(isDead == false) {
            final int numberOfDirection = 4;

            if (location != null && isValidProgram(program)) {
                //Search for valid move
                for (int i = moveCount; i < moveCount + numberOfDirection; i++) {
                    Direction nextMove = program.get((i) % numberOfDirection);

                    if (location.canMove(nextMove)) {
                        location.move(nextMove);
                        moveCount = i + 1;
                        return nextMove;
                    }
                }

                //If no valid move available then the piece is dead
                isDead = true;
                return null;
            }
        }
        return null;
    }

    public void placeOnNode(Node node){
        this.location = node;
        nodesEaten++;
    }

    public PlayerId getPlayerId(){
        return this.playerId;
    }

    public int getNodesEaten(){
        return this.nodesEaten;
    }

    public boolean isDead(){
        return this.isDead;
    }

    public Direction getPreviousDirection(){
        if(moveCount > 0 ){
            return program.get((moveCount - 1) % 4);
        }else{
            return null;
        }

    }

    public void killPiece(){
        this.isDead = true;
    }

    public boolean isNewPiece(){
        //System.out.println(moveCount);
        return moveCount == 0;
    }

}