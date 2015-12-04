

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
        });
        //If any of the pieces become dead then remove from the inplay
        clearDead();
    };

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
    };

    this.getPlayerName = function () {
        return this._playerName;
    };

    this.setNextMove = function (nextMove) {
        this._nextMove = nextMove;
    };

    this.getNextMove = function () {
        return this._nextMove;
    };

    this.toString = function () {
        clearDead();
        return null;
    };

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
    this._location=null;
    this._program=[];
    this._moveCount=0;
    this._isDead=false;
    this._nodesEaten=0;

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
        return moveOrder.indexof(Direction.UP)>-1 && moveOrder.inedxOf(Direction.DOWN)>-1 &&
                moveOrder.indexOf(Direction.LEFT)>-1 && moveOrder.indexOf(Direction.RIGHT)>-1;
    }

    this.advance=function(){
        if(this._isDead == false) {
            var numberOfDirection = 4;
            Object.freeze(numberOfDirection) ;
            if (this._location != null && isValidProgram(this._program)) {
                //Search for valid move
                for (i = this._moveCount; i < this._moveCount + numberOfDirection; i++) {
                    var nextMove = this._program.get((i) % numberOfDirection);

                    if (this._location.canMove(nextMove)) {
                        this._location.move(nextMove);
                        this._moveCount = i + 1;
                        return nextMove;
                    }
                }

                //If no valid move available then the piece is dead
                this._isDead = true;
                return null;
            }
        }
        return null;
    }

    this.placeOnNode=function( node){
        this._location = node;
        this._nodesEaten++;
    }

    this.getPlayerId=function(){
        return this._playerId;
    }

    this.getNodesEaten=function(){
        return this._nodesEaten;
    }

    this.isDead=function(){
        return this._isDead;
    }

    this.getPreviousDirection=function(){
        if(this._moveCount > 0 ){
            return this._program.get((this._moveCount - 1) % 4);
        }else{
            return null;
        }

    }

    this.killPiece=function(){
        this._isDead = true;
    }

    this.isNewPiece=function(){
        //System.out.println(moveCount);
        return this.__moveCount == 0;
    }

}

var  Node=function(id, xLoc,  yLoc) {
    this.id=id;
    this.id = id;
    this.xLoc = xLoc;
    this.yLoc = yLoc;
    this._status = Status.FREE;
   // @JsonIgnore
    this.up;
   // @JsonIgnore
    this.down;
    //@JsonIgnore
    this.left;
   // @JsonIgnore
    this.right;

    this._occupant;
    this._desireOccupancy = [];





    this.getId=function(){
        return this.id;
    }

    this.toString=function(){
        var up = nullCheck(this.up);
        var  down = nullCheck(this.down);
        var left = nullCheck(this.left);
        var right= nullCheck(this.right);

        return this.id + "," + this.xLoc + "," + this.yLoc + "," + this._status + "," + this.up + "," + this.down + "," + this.left + "," + this.right;
    }

    this.nullCheck=function(node){
        if(node == null){
            return "null";
        }else {
            return node.getId();
        }
    }

    this.canMove=function(direction){

        switch (direction){
            case Direction.UP:
                if(up == null){
                    return false;
                }else{
                    return up.isFree();
                }
            case Direction.DOWN:
                if(down == null){
                    return false;
                }else{
                    return down.isFree();
                }
            case Direction.LEFT:
                if(left == null){
                    return false;
                }else{
                    return left.isFree();
                }
            case Direction.RIGHT:
                if(right == null){
                    return false;
                }else{
                    return right.isFree();
                }
            default:return false;
        }
    }

    this.connect=function(node, direction){
        switch (direction){
            case Direction.UP:
                up = node;
            case Direction.DOWN:
                down = node;
            case Direction.LEFT:
                left = node;
            case Direction.RIGHT:
                right = node;
        }
    }

    this.isFree=function(){
        return this._status.equals(Status.FREE);
    }

    this.move=function(direction){
            switch (direction){
                case Direction.UP:
                    up.place(this._occupant);
                    this._occupantplaceOnNode(up);
                    break;
                case Direction.DOWN:
                    down.place(this._occupant);
                    this._occupant.placeOnNode(down);
                    break;
                case Direction.LEFT:
                    left.place(this._occupant);
                    this._occupant.placeOnNode(left);
                    break;
                case Direction.RIGHT:
                    right.place(this._occupant);
                    this._occupant.placeOnNode(right);
                    break;
            }
    }

    this.place=function(piece){
        this._desireOccupancy.add(piece);
    }

    /**
     * After all pieces have moved onto thier desired node decide which ones to keep and which ones to eject
     */
    this.moveTime=function(playerWithPriority){
        //First check if the node is currently occupied. If so then move the occupant along
        if(this._occupant != null){
            if(this._occupant.getPlayerId()==(PlayerId.ONE)){
                this._status = Status.EATEN_P1;
            }else{
                this._status = Status.EATEN_P2;
            }
        }

        var occuopantSelected = false;
        var newPieces = [];

        this._desireOccupancy.map(function(piece){

            if(piece.getPreviousDirection() != null){
                //First order is piece that moved up to get here
                if(piece.getPreviousDirection()==(Direction.UP)){
                    occupy(piece);
                    occuopantSelected = true;
                }

                //Second is piece that moved left
                if(piece.getPreviousDirection()==(Direction.LEFT)){
                    if(occuopantSelected){
                        piece.killPiece();
                    }else{
                        occupy(piece);
                        occuopantSelected = true;
                    }
                }

                //Third is a piece that moved down
                if(piece.getPreviousDirection()==(Direction.DOWN)){
                    if(occuopantSelected){
                        piece.killPiece();
                    }else{
                        occupy(piece);
                        occuopantSelected = true;
                    }
                }

                //Fourth is a piece that moved right
                if(piece.getPreviousDirection()==(Direction.RIGHT)){
                    if(occuopantSelected){
                        piece.killPiece();
                    }else{
                        occupy(piece);
                        occuopantSelected = true;
                    }
                }
            }

            //Fifth is a new piece
            if(piece.isNewPiece()){
                newPieces.push(piece);
            }
        }
        );
        newPieces.map(function(piece){
            if(occuopantSelected ||(newPieces.length > 1 && piece.getPlayerId() != playerWithPriority)){
                piece.killPiece();
            }else{
                occupy(piece);
                occuopantSelected = true;
            }
        }  )

        this._desireOccupancy.clear();

    }

   this.getxLoc=function(){
        return this.xLoc;
    }

   this.getyLoc=function(){
        return this.yLoc;
    }

    /**
     * Used to connect two nodes. Calculates if the given node is up, down, left, or right of the current node.
     * Returns the direction.
     * @param node
     * @return
     */
    this.connect=function(node){

        //If same x then node is above or below
        if(node.getxLoc() == this.xLoc){
            if(node.getyLoc() > this.yLoc){
                this.up = node;
              //  System.out.println("UP: current:" + this.yLoc + " above: " + node.getyLoc());
                return Direction.UP;
            }else{
                this.down = node;
           //     System.out.println("DOWN: current:" + this.yLoc + " below: " + node.getyLoc());
                return Direction.DOWN;

            }
        }else{
            //If same Y then node is left or right
            if(node.getxLoc() > this.xLoc){
                this.right = node;
             //   System.out.println("Right: current:" + this.xLoc + " right: " + node.getxLoc());
                return Direction.RIGHT;
            }else{
                this.left = node;
              //  System.out.println("Left: current:" + this.xLoc + " left: " + node.getxLoc());
                return Direction.LEFT;
            }
        }
    }

    var occupy=function(piece){
        this._occupant = piece;
        if(piece.getPlayerId() == PlayerId.ONE){
            this._status = Status.OCCUPIED_P1;
        }else{
            this._status = Status.OCCUPIED_P2;
        }
    };

    this.getStatus=function(){
        return this._status;
    }


};