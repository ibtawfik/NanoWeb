
(function () {
    "use strict";

    angular.module('myApp', []).factory('Logic',
        function () {

            var gameMode = Object.freeze({
                P2P: "P2P",
                P2C: "P2C"
            });

            var Direction = Object.freeze({
                UP: 0,
                DOWN: 1,
                LEFT: 2,
                RIGHT: 3
            });

            var Status = Object.freeze({
                EATEN_P1: "captured_one",
                EATEN_P2: "captured_two",
                FREE: "free",
                OCCUPIED_P1: "occupied_one",
                OCCUPIED_P2: "occupied_two",
                VOID: "void"
            });

            var PlayerId = Object.freeze({
                ONE: 0,
                TWO: 1
            });

            var playerTurn=PlayerId.ONE;
            var myGameMode=gameMode.P2P;
            var numPieces = 5;
            var boardSize=15;
            var Player = function (playerId, pieces, playerName) {
                var that = this
                this._playerId = playerId;
                this._playerName = playerName;

                this._unused = [];
                this._inPlay = [];
                this._dead = [];

                this._nextMove = ["UP","DOWN","LEFT","RIGHT"];//""; //default


                for (var i = 0; i < pieces; i++) {
                    var piece = new Piece(playerId);
                    this._unused.push(piece);
                }

                this.advanceTime = function () {
                    //For all inplay pieces move them
                    that._inPlay.forEach(function (piece) {
                        piece.advance()
                    });
                    //If any of the pieces become dead then remove from the inplay
                    clearDead();
                };

                /**
                 * Used to make the initial move for a an unused piece, requires the node and the program for the piece
                 */
                 this.place=function(node, program) {
                    //var node = board[x][y];
                    if (node.isFree() && this._unused.length > 0) {
                        var nextPiece = this._unused.splice(0, 1)[0];
                        nextPiece.programPiece(program);
                        nextPiece.placeOnNode(node);
                        node.place(nextPiece);
                        that._inPlay.push(nextPiece);
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
                    var i = that._inPlay.length;
                    while (i--) {
                        if (that._inPlay[i].isDead()) {
                            var piece = that._inPlay.splice(i, 1);
                            that._dead.push(piece);
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
                    return that._inPlay.length;
                };

                this.getScore = function () {
                    var score = 0;
                    that._inPlay.map(function (piece) {
                        score = score + piece.getNodesEaten();
                    });
                    this._dead.map(function (piece) {
                        score = score + piece.getNodesEaten();
                    });

                    return score;
                }
            };

            var Piece = function (playerId) {
                this._playerId = playerId;
                this._location = null;
                this._program = [];
                this._moveCount = 0;
                this._isDead = false;
                this._nodesEaten = 0;
               /* function _isValidProgram (moveOrder) {
                    var that = this;
                    if (moveOrder == null) {
                        return false;
                    }
                    //Should have 4 moves
                    if (moveOrder.length != 4) {
                        return false;
                    }

                    //Should have each move type
                    return moveOrder.indexOf(Direction.UP) > -1 && moveOrder.indexOf(Direction.DOWN) > -1 &&
                        moveOrder.indexOf(Direction.LEFT) > -1 && moveOrder.indexOf(Direction.RIGHT) > -1;
                }*/

                this.advance = function () {
                    if (this._isDead == false) {
                        var numberOfDirection = 4;
                        Object.freeze(numberOfDirection);
                        if (this._location != null ) {
                            //Search for valid move
                            for (var i = this._moveCount; i < this._moveCount + numberOfDirection; i++) {
                                var nextMove = this._program.indexOf((i) % numberOfDirection);

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
                 this.programPiece = function (moveOrder) {
                  //  if (_isValidProgram(moveOrder)) {
                        this._program = moveOrder;
                   // }
                }


                this.placeOnNode = function (node) {
                    this._location = node;
                    this._nodesEaten++;
                }
                this.getPlayerId = function () {
                    return this._playerId;
                }

                 this.getNodesEaten = function () {
                    return this._nodesEaten;
                }

                this.isDead = function () {
                    return this._isDead;
                }

                this.getPreviousDirection = function () {
                    if (this._moveCount > 0) {
                        return this._program.indexOf((this._moveCount - 1) % 4);
                    } else {
                        return null;
                    }

                }
                 this.killPiece = function () {
                    this._isDead = true;
                }

                this.isNewPiece = function () {
                    return this._moveCount == 0;
                }



            }



            var Node = function (row,col) {
                var that = this
                this.row=row
                this.col=col
                // this._xLoc = xLoc;
                //  this._yLoc = yLoc;
                this.status = Status.FREE;
                // @JsonIgnore
                this.up = null;
                // @JsonIgnore
                this.down = null;
                //@JsonIgnore
                this.left = null;
                // @JsonIgnore
                this.right = null;

                this.occupant = null;
                this.desireOccupancy = [];

                this.isFree = function () {
                    return this.status==(Status.FREE);}

                this.canMove = function (direction) {

                        switch (direction) {
                            case Direction.UP:
                                if (that.up == null ||that.row==0) {
                                    return false;
                                } else {
                                    return board[that.row-1][that.col].isFree();
                                }
                            case Direction.DOWN:
                                if (that.down == null || that.row==boardSize-1) {
                                    return false;
                                } else {
                                    return board[that.row+1][that.col].isFree();
                                }
                            case Direction.LEFT:
                                if (that.left == null || that.col===0) {
                                    return false;
                                } else {
                                    return board[that.row][that.col-1].isFree();
                                }
                            case Direction.RIGHT:
                                if (that.right == null|| that.col==boardSize-1) {
                                    return false;
                                } else {
                                    return board[that.row][that.col+1].isFree();
                                }
                            default:
                                return false;
                        }
                    }

                this.move=function(direction){
                    var node;
                    switch (direction){
                        case Direction.UP:
                            node = board[that.row-1][that.col]

                            break;
                        case Direction.DOWN:
                            node = [that.row+1][that.col];

                            break;
                        case Direction.LEFT:
                            node=board[that.row][that.col-1];
                            break;
                        case Direction.RIGHT:
                            node=board[that.row][that.col+1];
                            break;
                    }
                    node.place(that.occupant);
                    that.occupant.placeOnNode(node);
                }

                this.place = function (piece) {
                    that.desireOccupancy.push(piece);
                }

                /**
                 * After all pieces have moved onto thier desired node decide which ones to keep and which ones to eject
                 */
                this.moveTime = function (playerWithPriority) {
                    //First check if the node is currently occupied. If so then move the occupant along
                    if (this.occupant != null) {
                        if (this.occupant.getPlayerId() == (PlayerId.ONE)) {
                            this.status = Status.EATEN_P1;
                        } else {
                            this.status = Status.EATEN_P2;
                        }
                    }

                    var occuopantSelected = false;
                    var newPieces = [];

                    this.desireOccupancy.map(function (piece) {

                            if (piece.getPreviousDirection() != null) {
                                //First order is piece that moved up to get here
                                if (piece.getPreviousDirection() == (Direction.UP)) {
                                    that._occupy(piece);
                                    occuopantSelected = true;
                                }

                                //Second is piece that moved left
                                if (piece.getPreviousDirection() == (Direction.LEFT)) {
                                    if (occuopantSelected) {
                                        piece.killPiece();
                                    } else {
                                        that._occupy(piece);
                                        occuopantSelected = true;
                                    }
                                }

                                //Third is a piece that moved down
                                if (piece.getPreviousDirection() == (Direction.DOWN)) {
                                    if (occuopantSelected) {
                                        piece.killPiece();
                                    } else {
                                        that._occupy(piece);
                                        occuopantSelected = true;
                                    }
                                }

                                //Fourth is a piece that moved right
                                if (piece.getPreviousDirection() == (Direction.RIGHT)) {
                                    if (occuopantSelected) {
                                        piece.killPiece();
                                    } else {
                                        that._occupy(piece);
                                        occuopantSelected = true;
                                    }
                                }
                            }

                            //Fifth is a new piece
                            if (piece.isNewPiece()) {
                                newPieces.push(piece);
                            }
                        }
                    );
                    newPieces.map(function (piece) {
                        if (occuopantSelected || (newPieces.length > 1 && piece.getPlayerId() != playerWithPriority)) {
                            piece.killPiece();
                        } else {
                            that._occupy(piece);
                            occuopantSelected = true;
                        }
                    });

                    this.desireOccupancy=[];

                };


                this._occupy = function (piece) {
                    this.occupant = piece;
                    if (piece.getPlayerId() == PlayerId.ONE) {
                        this.status = Status.OCCUPIED_P1;
                    } else {
                        this.status = Status.OCCUPIED_P2;
                    }
                };

                this.getStatus = function () {
                    return this.status;
                }
            };

            Node.prototype.getId = function () {
                return this.id;
            };

            Node.prototype.toString = function () {
                var up = _nullCheck(this.up);
                var down = _nullCheck(this.down);
                var left = _nullCheck(this.left);
                var right = _nullCheck(this.right);

                return this.id + "," + this._xLoc + "," + this._yLoc + "," + this.status + "," + this.up + "," + this.down + "," + this.left + "," + this.right;
            };

            Node.prototype._nullCheck = function (node) {
                if (node == null) {
                    return "null";
                } else {
                    return node.getId();
                }
            }







            this._game = null;

            var sampleObject = {
                status: "void",
                left: true,
                right: false,
                top: true,
                bottom: false
            };

            var sampleObject2 = {
                status: "void",
                left: false,
                right: true,
                top: true,
                bottom: true
            };

          // var objectx  = Object.create(Node);
           var  objectx = new Node();
                 objectx.status=  Status.FREE
                objectx.left= false
                objectx.right= true
                objectx.top= true,
                objectx.bottom=true

            //var objectx2  = Object.create(Node);
            var  objectx2 = new Node();
            objectx2.status= Status.VOID;
            objectx2.left= false
            objectx2.right= false
            objectx2.top= false,
                objectx2.bottom=true

           // var objectx3  = Object.create(Node);
            var  objectx3 = new Node();
            objectx3.status= Status.FREE;
            objectx3.left= false
            objectx3.right= false
            objectx3.top= false,
            objectx3.bottom=true

            //var objectx4  = Object.create(Node);
            var objectx4  =new Node();
            objectx4.status= Status.FREE;
            objectx4.left= false
            objectx4.right= false
            objectx4.top= false,
                objectx4.bottom=true

            var board=[];
            for (var i=0;i<boardSize;i++){
                var row =[];
                for (var j=0;j<boardSize;j++){
                    var obj;
                    var randint = Math.floor(Math.random()*5)
                    switch (randint){
                        case 0:obj=objectx;break;
                        case 1:obj=objectx2;break;
                        case 2:obj=objectx3;break;
                        case 3:obj=objectx4;break;
                        default:obj=objectx;
                    }
                    obj.row=i;
                    obj.col=j;
                    row.push(obj)
                }
              board.push(row);
              }
            for (var i=0;i<boardSize;i++)
                for (var j=0;j<boardSize;j++){
                    if (i==0)
                        board[i][j].up=false;
                    if (j===0)
                        board[i][j].left=false;
                    if (j===boardSize-1)
                        board[i][j].down=false;

                    if (i===boardSize-1)
                        board[i][j].right=false;


                    if (board[i][j].up==true && i>0)
                        board[i-1][j].down=true;

                    if (board[i][j].down==true && i<boardSize-1)
                        board[i+1][j].up=true;

                    if (board[i][j].left==true && j>0)
                        board[i][j-1].right=true;

                    if (board[i][j].right==true &&  j<boardSize-1)
                        board[i][j+1].left=true;


                }
            var player1;
            var player2;
            var timeStep;

            //We have to decide who lives in each round if two people choose the same space.
            //That is decided by this advantage number.
            //private PlayerId advantage = PlayerId.ONE;
            var p1_nextMove;
            var p2_nextMove;

            /****************************************************************************************
             * Commands from the players
             /**/
            player1 = new Player(PlayerId.ONE, numPieces,"PLAYER1");
            player2 = new Player(PlayerId.TWO, numPieces, "PLAYER2");

            this.receiveMoves = function (player, move) {

                if (player1 != null && player == 1) {
                    p1_nextMove = move;
                    player1.setNextMove(p1_nextMove);
                } else if (player2 != null && player == 2) {
                    p2_nextMove = move;
                    player2.setNextMove(p2_nextMove);
                }

                if (player1 != null && player2 != null) {
                    if (player1.getNextMove() != null && player2.getNextMove() != null) {
                        makeMove();
                        p1_nextMove = null;
                        p2_nextMove = null;
                    }
                }
            }



            function advantage() {
                var player = Math.random();
                if (player > (0.5)) {
                    return PlayerId.ONE;
                } else {
                    return PlayerId.TWO;
                }
            }

            function advanceTime(advantage) {

                board.map(function (node) {
                    for (i=0;i<boardSize;i++){
                        for (j=0;j<boardSize;j++){
                            board[i][j].moveTime(advantage);}
                        }
                });


                player1.advanceTime();
                player2.advanceTime();
                timeStep++;
            }

            function move(row, col,player) {
                if (player.getNextMove() != null) {
                   // var nextMove = player.getNextMove();
                    var move = player.getNextMove();
                    //If pass then do nothing
                    if (move[0].toLowerCase().trim() === ("pass")) {
                        player.setNextMove(null);
                        return;
                    }

                    //Otherwise make all the moves
                   // var moves = nextMove.split("\\|");
              //      nextMove.map(function (singleMove) {
                      //  var move = singleMove.split(",");
                    //    var nodeId = move[0];

                        var program = [];

                        for (var i = 0; i < 4; i++) {
                            var value = move[i].toLowerCase().trim();

                            if (value === "up") {
                                program.push(Direction.UP);
                            } else if (value === "down") {
                                program.push(Direction.DOWN);
                            } else if (value == "left") {
                                program.push(Direction.LEFT);
                            } else if (value === "right") {
                                program.push(Direction.RIGHT);
                            }
                      //  }

                        var node = board[row][col];

                        player.place(node, program);

                    }
                }

                if (player == player1) {
                    player1.setNextMove(null);
                } else if (player == player2) {
                    player2.setNextMove(null);
                }

            }

            /****************************************************************************************
             * Functions at application startup
             ****************************************************************************************/
            this.readyForMove = function (playerId) {
                if (playerId === 1) {
                    return p1_nextMove === null;
                } else {
                    return p2_nextMove === null;
                }
            }


            function isValidMove(row, column, player) {
                var node = board[row][column];
                return node.status===Status.FREE && player === playerTurn;
            }

            function makeMove (row, column, player) {
                var a = advantage();
                if (a === (PlayerId.ONE)) {
                    move(row, column, player1);
                }   else {
                    move(row, column,player2);
                }
                advanceTime(a);
            }

            function setGameMode (gameMode) {
                myGameMode =gameMode;
              /*  if (gameMode === gameMode.P2C) {
                    currentGameMode = gameModel
                }
                else if (gameMode === gameMode.P2P) {
                }*/
            }

            function getBoard() {
              return board
            }

            function createPlayer(playerId, playerName) {
                if (playerId == 1) {
                    player1 = new Player(PlayerId.ONE, numPieces, playerName);

                } else {
                    player2 = new Player(PlayerId.TWO, numPieces, playerName);
                }
            }
            function currentPlayer(){
                return playerTurn;
            }
            return {
                setGameMode: setGameMode,
                isValidMove: isValidMove,
                getBoard: getBoard,
                makeMove: makeMove,
                createPlayer:createPlayer,
                currentPlayer:currentPlayer
            };


        })}());