
(function () {
    "use strict";

    angular.module('myApp', []).factory('Logic',
        function () {

            var gameMode = Object.freeze({
                P2P: 0,
                P2C: 1
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
            var Player = function (playerId, pieces, playerName) {

                this._playerId = playerId;
                this._playerName = playerName;

                this._unused = [];
                this._inPlay = [];
                this._dead = [];

                this._nextMove = "";


                for (var i = 0; i < pieces; i++) {
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

            var Piece = function (playerId) {
                this._playerId = playerId;
                this._location = null;
                this._program = [];
                this._moveCount = 0;
                this._isDead = false;
                this._nodesEaten = 0;
                this._isValidProgram = function (moveOrder) {
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
                }

                this.advance = function () {
                    if (this._isDead == false) {
                        var numberOfDirection = 4;
                        Object.freeze(numberOfDirection);
                        if (this._location != null && that._isValidProgram(this._program)) {
                            //Search for valid move
                            for (var i = this._moveCount; i < this._moveCount + numberOfDirection; i++) {
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


            Piece.prototype.programPiece = function (moveOrder) {
                if (_isValidProgram(moveOrder)) {
                    this._program = moveOrder;
                }
            }


            Piece.prototype.placeOnNode = function (node) {
                this._location = node;
                this._nodesEaten++;
            }

            Piece.prototype.getPlayerId = function () {
                return this._playerId;
            }

            Piece.prototype.getNodesEaten = function () {
                return this._nodesEaten;
            }

            Piece.prototype.isDead = function () {
                return this._isDead;
            }

            Piece.prototype.getPreviousDirection = function () {
                if (this._moveCount > 0) {
                    return this._program.get((this._moveCount - 1) % 4);
                } else {
                    return null;
                }

            }

            Piece.prototype.killPiece = function () {
                this._isDead = true;
            }

            Piece.prototype.isNewPiece = function () {
                //System.out.println(moveCount);
                return this._moveCount == 0;
            }


            // var  Node=function(id, xLoc,  yLoc) {
            var Node = function () {

                this.id = 0;//id;
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
            }

            Node.prototype.getId = function () {
                return this.id;
            }

            Node.prototype.toString = function () {
                var up = _nullCheck(this.up);
                var down = _nullCheck(this.down);
                var left = _nullCheck(this.left);
                var right = _nullCheck(this.right);

                return this.id + "," + this._xLoc + "," + this._yLoc + "," + this.status + "," + this.up + "," + this.down + "," + this.left + "," + this.right;
            }

            Node.prototype._nullCheck = function (node) {
                if (node == null) {
                    return "null";
                } else {
                    return node.getId();
                }
            }

            Node.prototype.canMove = function (direction) {

                switch (direction) {
                    case Direction.UP:
                        if (up == null) {
                            return false;
                        } else {
                            return up.isFree();
                        }
                    case Direction.DOWN:
                        if (down == null) {
                            return false;
                        } else {
                            return down.isFree();
                        }
                    case Direction.LEFT:
                        if (left == null) {
                            return false;
                        } else {
                            return left.isFree();
                        }
                    case Direction.RIGHT:
                        if (right == null) {
                            return false;
                        } else {
                            return right.isFree();
                        }
                    default:
                        return false;
                }
            }


            Node.prototype.isFree = function () {
                return this.status.equals(Status.FREE);
            }

            Node.prototype = function (direction) {
                switch (direction) {
                    case Direction.UP:
                        up.place(this.occupant);
                        this.occupantplaceOnNode(up);
                        break;
                    case Direction.DOWN:
                        down.place(this.occupant);
                        this.occupant.placeOnNode(down);
                        break;
                    case Direction.LEFT:
                        left.place(this.occupant);
                        this.occupant.placeOnNode(left);
                        break;
                    case Direction.RIGHT:
                        right.place(this.occupant);
                        this.occupant.placeOnNode(right);
                        break;
                }
            }

            Node.prototype.place = function (piece) {
                this.desireOccupancy.add(piece);
            }

            /**
             * After all pieces have moved onto thier desired node decide which ones to keep and which ones to eject
             */
            Node.prototype.moveTime = function (playerWithPriority) {
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
                                _occupy(piece);
                                occuopantSelected = true;
                            }

                            //Second is piece that moved left
                            if (piece.getPreviousDirection() == (Direction.LEFT)) {
                                if (occuopantSelected) {
                                    piece.killPiece();
                                } else {
                                    _occupy(piece);
                                    occuopantSelected = true;
                                }
                            }

                            //Third is a piece that moved down
                            if (piece.getPreviousDirection() == (Direction.DOWN)) {
                                if (occuopantSelected) {
                                    piece.killPiece();
                                } else {
                                    _occupy(piece);
                                    occuopantSelected = true;
                                }
                            }

                            //Fourth is a piece that moved right
                            if (piece.getPreviousDirection() == (Direction.RIGHT)) {
                                if (occuopantSelected) {
                                    piece.killPiece();
                                } else {
                                    _occupy(piece);
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
                        _occupy(piece);
                        occuopantSelected = true;
                    }
                })

                this.desireOccupancy.clear();

            }


            Node.prototype._occupy = function (piece) {
                this.occupant = piece;
                if (piece.getPlayerId() == PlayerId.ONE) {
                    this.status = Status.OCCUPIED_P1;
                } else {
                    this.status = Status.OCCUPIED_P2;
                }
            };

            Node.prototype.getStatus = function () {
                return this.status;
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

           var objectx  = Object.create(Node);
                 objectx.status= Status.EATEN_P1
                objectx.left= false
                objectx.right= true
                objectx.top= true,
                objectx.bottom=true

            var objectx2  = Object.create(Node);
            objectx2.status= Status.VOID;
            objectx2.left= false
            objectx2.right= false
            objectx2.top= false,
                objectx2.bottom=true

            var objectx3  = Object.create(Node);
            objectx3.status= Status.OCCUPIED_P1;
            objectx3.left= false
            objectx3.right= false
            objectx3.top= false,
                objectx3.bottom=true

            var objectx4  = Object.create(Node);
            objectx4.status= Status.OCCUPIED_P2;
            objectx4.left= false
            objectx4.right= false
            objectx4.top= false,
                objectx4.bottom=true

            var board=[];
            for (var i=0;i<15;i++){
                var row =[];
                for (var j=0;j<15;j++){
                    var obj;
                    var randint = Math.floor(Math.random()*5)
                    switch (randint){
                        case 0:obj=objectx;break;
                        case 1:obj=objectx2;break;
                        case 2:obj=objectx3;break;
                        case 3:obj=objectx4;break;
                        default:obj=objectx;
                    }
                    row.push(obj)
                }
              board.push(row);
              }



         /*   var board =
                [[sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject],
                    [sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject],
                    [sampleObject2, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject],
                    [sampleObject, sampleObject2, sampleObject2, sampleObject2, sampleObject2, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject],
                    [sampleObject, sampleObject2, sampleObject2, sampleObject2, sampleObject2, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject],
                    [sampleObject, sampleObject, sampleObject, sampleObject, sampleObject2, sampleObject2, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject],
                    [sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject],
                    [sampleObject2, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject],
                    [sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject],
                    [sampleObject, sampleObject, sampleObject, sampleObject2, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject],
                    [sampleObject, sampleObject, sampleObject, sampleObject, sampleObject2, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject],
                    [sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject],
                    [sampleObject, sampleObject, sampleObject, sampleObject2, sampleObject, sampleObject2, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject],
                    [sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject],
                    [sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject, sampleObject]
                ];*/


            var player1;
            var player2;
            var timeStep;

            //We have to decide who lives in each round if two people choose the same space.
            //That is decided by this advantage number.
            //private PlayerId advantage = PlayerId.ONE;
            var p1_nextMove;
            var p2_nextMove;
            /*
             var player1Messages = [];
             var player2Messages =[];
             */
            /****************************************************************************************
             * Commands from the players
             ****************************************************************************************/
            /*  this.registerPlayer=function( playerId, playerName, numPieces){
             if(playerId == 1){
             player1 = new Player(PlayerId.ONE, numPieces,playerName);
             return this.toString();
             }else{
             player2 = new Player(PlayerId.TWO, numPieces, playerName);
             return this.toString();
             }
             }*/

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

                nodes.map(function (node) {
                    node.moveTime(advantage);
                });


                player1.advanceTime();
                player2.advanceTime();
                timeStep++;
            }

            function move(player) {
                if (player.getNextMove() != null) {
                    var nextMove = player.getNextMove();
                    //If pass then do nothing
                    if (nextMove.toLowerCase().trim() === ("pass")) {
                        player.setNextMove(null);
                        return;
                    }

                    //Otherwise make all the moves
                    var moves = nextMove.split("\\|");
                    moves.map(function (singleMove) {
                        var move = singleMove.split(",");
                        var nodeId = move[0];

                        var program = [];

                        for (var i = 1; i < 5; i++) {
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
                        }

                        var node = nodes.indexOf(nodeId);

                        player.place(node, program);

                    })
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

                return board[row,column]===Status.FREE && player === playerTurn;
            }

            function makeMove (row, column, player) {
                var a = advantage();
                if (a === (PlayerId.ONE)) {
                    move(player1);
                    move(player2);
                    advanceTime(a);
                } else {
                    move(player2);
                    move(player1);
                    advanceTime(a);
                }
            }

            function setGameMode (gameMode) {
                if (gameMode === gameMode.P2C) {
                }
                else if (gameMode === gameMode.P2P) {
                }
            }

            function getBoard() {
              return board
            }

            return {
                setGameMode: setGameMode,
                isValidMove: isValidMove,
                getBoard: getBoard,
                makeMove: makeMove
            };


        })}());