

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


var Player = function (playerId, pieces, playerName) {

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
    };

    this.getPlayerId = function () {
        return this._playerId.name();
    };

    this.unusedCount = function () {
        return this._unused.length;
    };

    this.deadCount = function () {
        return this._dead.length;
    };

    this.inPlayCount = function () {
        return this._inPlay.length;
    };

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
    this._playerId = playerId;
    this._location = null;
    this._program = [];
    this._moveCount = 0;
    this._isDead = false;
    this._nodesEaten = 0;
    this._isValidProgram=function(moveOrder){
        var that = this;
           if(moveOrder == null){
               return false;
           }
           //Should have 4 moves
           if(moveOrder.length != 4){
               return false;
           }

           //Should have each move type
           return moveOrder.indexOf(Direction.UP)>-1 && moveOrder.indexOf(Direction.DOWN)>-1 &&
                   moveOrder.indexOf(Direction.LEFT)>-1 && moveOrder.indexOf(Direction.RIGHT)>-1;
       }

       this.advance=function(){
           if(this._isDead == false) {
               var numberOfDirection = 4;
               Object.freeze(numberOfDirection) ;
               if (this._location != null && that._isValidProgram(this._program)) {
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
}


    Piece.prototype.programPiece=function(moveOrder){
        if(_isValidProgram(moveOrder)){
            this._program=moveOrder;
        }
    }


    Piece.prototype.placeOnNode=function( node){
        this._location = node;
        this._nodesEaten++;
    }

   Piece.prototype.getPlayerId=function(){
        return this._playerId;
    }

   Piece.prototype.getNodesEaten=function(){
        return this._nodesEaten;
    }

    Piece.prototype.isDead=function(){
        return this._isDead;
    }

    Piece.prototype.getPreviousDirection=function(){
        if(this._moveCount > 0 ){
            return this._program.get((this._moveCount - 1) % 4);
        }else{
            return null;
        }

    }

    Piece.prototype.killPiece=function(){
        this._isDead = true;
    }

    Piece.prototype.isNewPiece=function(){
        //System.out.println(moveCount);
        return this._moveCount == 0;
    }



var  Node=function(id, xLoc,  yLoc) {
    this.id = id;
    this._xLoc = xLoc;
    this._yLoc = yLoc;
    this._status = Status.FREE;
    // @JsonIgnore
    this.up = null;
    // @JsonIgnore
    this.down = null;
    //@JsonIgnore
    this.left = null;
    // @JsonIgnore
    this.right = null;

    this._occupant = null;
    this._desireOccupancy = [];
}
    Node.prototype.getId=function(){
        return this.id;
    }

    Node.prototype.toString=function(){
        var up = _nullCheck(this.up);
        var  down = _nullCheck(this.down);
        var left = _nullCheck(this.left);
        var right= _nullCheck(this.right);

        return this.id + "," + this._xLoc+ "," + this._yLoc + "," + this._status + "," + this.up + "," + this.down + "," + this.left + "," + this.right;
    }

    Node.prototype._nullCheck=function(node){
        if(node == null){
            return "null";
        }else {
            return node.getId();
        }
    }

    Node.prototype.canMove=function(direction){

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

    Node.prototype.connect=function(node, direction){
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

    Node.prototype.isFree=function(){
        return this._status.equals(Status.FREE);
    }

    Node.prototype=function(direction){
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

    Node.prototype.place=function(piece){
        this._desireOccupancy.add(piece);
    }

    /**
     * After all pieces have moved onto thier desired node decide which ones to keep and which ones to eject
     */
    Node.prototype.moveTime=function(playerWithPriority){
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
                    _occupy(piece);
                    occuopantSelected = true;
                }

                //Second is piece that moved left
                if(piece.getPreviousDirection()==(Direction.LEFT)){
                    if(occuopantSelected){
                        piece.killPiece();
                    }else{
                        _occupy(piece);
                        occuopantSelected = true;
                    }
                }

                //Third is a piece that moved down
                if(piece.getPreviousDirection()==(Direction.DOWN)){
                    if(occuopantSelected){
                        piece.killPiece();
                    }else{
                        _occupy(piece);
                        occuopantSelected = true;
                    }
                }

                //Fourth is a piece that moved right
                if(piece.getPreviousDirection()==(Direction.RIGHT)){
                    if(occuopantSelected){
                        piece.killPiece();
                    }else{
                        _occupy(piece);
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
                _occupy(piece);
                occuopantSelected = true;
            }
        }  )

        this._desireOccupancy.clear();

    }

   Node.prototype.getxLoc=function(){
        return this._xLoc;
    }

   Node.prototype.getyLoc=function(){
        return this._yLoc;
    }

    /**
     * Used to connect two nodes. Calculates if the given node is up, down, left, or right of the current node.
     * Returns the direction.
     * @param node
     * @return
     */
    Node.prototype.connect=function(node){

        //If same x then node is above or below
        if(node.getxLoc() == this._xLoc){
            if(node.getyLoc() > this._yLoc){
                this.up = node;
              //  System.out.println("UP: current:" + this._yLoc + " above: " + node.getyLoc());
                return Direction.UP;
            }else{
                this.down = node;
           //     System.out.println("DOWN: current:" + this._yLoc + " below: " + node.getyLoc());
                return Direction.DOWN;

            }
        }else{
            //If same Y then node is left or right
            if(node.getxLoc() > this._xLoc){
                this.right = node;
             //   System.out.println("Right: current:" + this._xLoc+ " right: " + node.getxLoc());
                return Direction.RIGHT;
            }else{
                this.left = node;
              //  System.out.println("Left: current:" + this._xLoc+ " left: " + node.getxLoc());
                return Direction.LEFT;
            }
        }
    }

    Node.prototype._occupy=function(piece){
        this._occupant = piece;
        if(piece.getPlayerId() == PlayerId.ONE){
            this._status = Status.OCCUPIED_P1;
        }else{
            this._status = Status.OCCUPIED_P2;
        }
    };

    Node.prototype.getStatus=function(){
        return this._status;
    }




function Game (){

    this._game= null;
    this.nodes = [];

    //public static Map<Integer, Node> nodes = new HashMap<Integer, Node>();
    //private List<Game.Node> nodes;
    var player1;
    var player2;
    var timeStep;

    //We have to decide who lives in each round if two people choose the same space.
    //That is decided by this advantage number.
    //private PlayerId advantage = PlayerId.ONE;

    var  p1_nextMove;
    var p2_nextMove;

    var player1Messages = [];
    var player2Messages =[];


    this.getInstance=function(){
        if(game == null){
           this._game = new Game();
        }
        return this._game;
    }


    /****************************************************************************************
     * Commands from the players
     ****************************************************************************************/
   this.registerPlayer=function( playerId, playerName, numPieces){
        if(playerId == 1){
            player1 = new Player(PlayerId.ONE, numPieces,playerName);
            return this.toString();
        }else{
            player2 = new Player(PlayerId.TWO, numPieces, playerName);
            return this.toString();
        }
    }

    this.receiveMoves=function( player, move){

        if(player1 != null && player == 1){
            p1_nextMove = move;
            player1.setNextMove(p1_nextMove);
        }else if(player2 != null && player == 2){
            p2_nextMove = move;
            player2.setNextMove(p2_nextMove);
        }

        if(player1 != null && player2 != null){
            if(player1.getNextMove() != null && player2.getNextMove() != null){
                makeMove();
                p1_nextMove = null;
                p2_nextMove = null;
            }
        }
    }


    function makemove(){
        var a = advantage();
        if(a===(PlayerId.ONE)){
            move(player1);
            move(player2);
            advanceTime(a);
            this.player1Messages.push(this.toString());
            this.player2Messages.push(this.toString());
        }else{
            move(player2);
            move(player1);
            _advanceTime(a);
            this.player1Messages.push(this.toString());
            this.player2Messages.push(this.toString());
        }
    }

     function advantage(){
        var  player = Math.random();
        if(player>(0.5)){
            return PlayerId.ONE;
        }else{
            return PlayerId.TWO;
        }
    }

    function advanceTime(advantage){

        nodes.map(function(node){
           node.moveTime(advantage);
        }) ;



        player1.advanceTime();
        player2.advanceTime();
        timeStep++;
    }

    function move(player){
        if(player.getNextMove() != null){
            var nextMove = player.getNextMove();
            //If pass then do nothing
            if(nextMove.toLowerCase().trim()===("pass")){
                player.setNextMove(null);
                return;
            }

            //Otherwise make all the moves
            var moves = nextMove.split("\\|");
              moves.map(function(singleMove){
                var move = singleMove.split(",");
                var nodeId =move[0]  ;

                var program = [];

                for( i = 1; i < 5; i++){
                    var value = move[i].toLowerCase().trim();

                    if(value==="up"){
                        program.push(Direction.UP);
                    }else if(value==="down"){
                        program.push(Direction.DOWN);
                    }else if(value=="left"){
                        program.push(Direction.LEFT);
                    }else if(value==="right"){
                        program.push(Direction.RIGHT);
                    }
                }

                var node = nodes.indexOf(nodeId);

                player.place(node, program);

            } )
        }

        if(player == player1){
            player1.setNextMove(null);
        }else if (player == player2){
            player2.setNextMove(null);
        }

    }

    /****************************************************************************************
     * Functions at application startup
     ****************************************************************************************/


    this.createBoard=function(board){

        var reader = new BufferedReader(new FileReader(board));
        var nextLine;
        var  nodes = [];
        var  edges = [];

        while((nextLine = reader.readLine()) != null){
            var  splitString = nextLine.split(",");
            if(splitString.length == 3 && splitString[0]!=="nodeid"){
                nodes.add(splitString);
            }

            if(splitString.length  == 2 && splitString[0]!=="nodeid1" ){
                edges.add(splitString);
            }
        }

        createNodes(nodes);
        connectNodes(edges);
    }


    function createNodes(nodes){
            nodes.map(function(rep){
            node = new Node(parseInt(rep[0]), parseInt(rep[1]),parseInt(rep[2]));
            this.nodes.push(node.getId(), node);
        } );
    }

    function connectNodes(edges){
           edges.map(function(rep){
            var nodeId1 = parseInt(rep[0]);
            var nodeId2 = parseInt(rep[1]);
            var node1 = nodes.indexOf(nodeId1);
            var node2 = nodes.indexOf(nodeId2);
            node1.connect(node2);
            node2.connect(node1);
        });
    }

    function getsortedNodes(){
         var hashkeys = this.nodes.keys();
         var sortedNodes = hashkeys.map(function (node){  return nodes.hashkeys.node;});

         sortedNodes.sort(function (o1,o2) {
                 return o1.getId() - o2.getId();
         });
        return sortedNodes;
    }
    this.toString=function(){

        var player_1_score=0;
        var player_2_score = 0;

        var builder = [];
        builder.push("nodeid,xLoc,yLoc,status,up,down,left,right\n");
        var sortedNodes = getsortedNodes();
        for( i = 0; i < sortedNodes.length; i++){
            builder.push(sortedNodes.indexOf(i).toString() + "\n");
            var status = sortedNodes.indexOf(i).getStatus();

            if(status===Status.EATEN_P1 || status===Status.OCCUPIED_P1){
                player_1_score++;
            }else if(status===Status.EATEN_P2 || status===Status.OCCUPIED_P2){
                player_2_score++;
            }
        }
        if(player1 != null){
            builder.push("\n\nPlayerID,PlayerName,unused,dead,inPlay,score\n");
            builder.push(player1.getPlayerId() + "," + player1.getPlayerName() + "," + player1.unusedCount() +
                    "," + player1.deadCount() + "," + player1.inPlayCount() + "," + player_1_score + "\n");

            if(player2 != null){
                builder.push(player2.getPlayerId() + "," + player2.getPlayerName() + "," + player2.unusedCount() +
                        "," + player2.deadCount() + "," + player2.inPlayCount() + "," + player_2_score + "\n");
            }
        }
        return builder.join();
    }


    this.getMessages=function(playerId){
        if(playerId == 1){
            var returnMessages = this.player1Messages.slice(0);
            clearMessages(playerId);
            return returnMessages;
        }else{
            var returnMessages = this.player2Messages.slice(0);
            clearMessages(playerId);
            return returnMessages;
        }
    }

    this.clearMessages=function(playerId){
        if(playerId === 1){
            this.player1Messages.clear();
        }else{
            this.player2Messages.clear();
        }
    }

    this.readyForMove=function(playerId){
        if(playerId === 1){
            return p1_nextMove === null;
        }else{
            return p2_nextMove === null;
        }
    }

    /**
     * Used for the ui, returns the players stats
     * @return
     */
    this.getPlayerStats=function(){
        var player_1_score=0;
        var player_2_score = 0;

        var builder = [];
        builder.push("nodeid,xLoc,yLoc,status,up,down,left,right\n");

        var sortedNodes = getsortedNodes();

        for( i = 0; i < sortedNodes.size(); i++){
            var status = sortedNodes.indexOf(i).getStatus();

            if(status===Status.EATEN_P1 || status===Status.OCCUPIED_P1){
                player_1_score++;                            }
            else if(status===Status.EATEN_P2 || status===Status.OCCUPIED_P2){
                player_2_score++;
            }
        }

        var  playerStats = [];
        if(player1 != null){
            var p1Stats = [];

            p1Stats.push(player1.getPlayerName());
            p1Stats.push(player1.unusedCount());
            p1Stats.push(player1.deadCount());
            p1Stats.push(player1.inPlayCount());
            p1Stats.push(player_1_score);

            playerStats.put(player1.getPlayerId(),p1Stats);

            if(player2 != null){
                var p2Stats =[];

                p2Stats.push(player2.getPlayerName());
                p2Stats.push(player2.unusedCount());
                p2Stats.push(player2.deadCount());
                p2Stats.push(player2.inPlayCount());
                p2Stats.push(player_2_score);

                playerStats.put(player2.getPlayerId(),p2Stats);
            }
        }

        return playerStats;
    }


}

(function () {
    "use strict";

    angular.module('myApp', []).factory('logic',
        function () {
            return {
                getInstance: getInstance,
                registerPlayer: registerPlayer,
                receiveMoves: receiveMoves, //
                createBoard: createBoard,
                toString:toString,
                getMessages: getMessages,
                clearMessages:clearMessages,
                readyForMove:readyForMove,
                getPlayerStats:getPlayerStats
            };


});
}());