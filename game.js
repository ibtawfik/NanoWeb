/**
 * Created by islam on 12/6/15.
 */
'use strict';
angular.module('myApp')
      .controller('Ctrl', ['$scope','Logic',
        function ($scope, Logic) {
                var board = Logic.getBoard();

                var stored;
                $scope.isVoid = function(row,column){
                        return board[row][column].status === "void";
                };

                $scope.isFree = function(row,column){
                        return board[row][column].status === "free";
                };

                $scope.isConnectedLeft = function(row,column){
                        return board[row][column].left === true;
                };

                $scope.isConnectedRight = function(row,column){
                        return board[row][column].right === true;
                };

                $scope.isConnectedTop = function(row,column){
                        return board[row][column].up === true;
                };

                $scope.isConnectedBottom = function(row,column){
                        return board[row][column].down === true;
                };

                $scope.isTakenPlayerOne=function(row,column){
                        return board[row][column].status === "captured_one" ||
                            board[row][column].status === "occupied_one";
                };

                $scope.isTakenPlayerTwo=function(row,column){
                        return board[row][column].status === "captured_two" ||
                            board[row][column].status === "occupied_two";
                };

                $scope.shouldShowImage=function(row,column){
                        return board[row][column].status === "occupied_one" || board[row][column].status === "occupied_two";
                };

                $scope.imageLink=function(row,column){
                        if(board[row][column].status === "occupied_one"){
                                return "bertleft.png";
                        }else if(board[row][column].status === "occupied_two"){
                                return "coily.png";
                        }

                };

                function update (row,column,directions){
                        stored = null;
                        var player = Logic.currentPlayer();
                        if(Logic.isValidMove(row,column,player)){
                                Logic.makeMove(row,column,player,format(directions));
                        }
                        console.log(row + " " + column);
                        console.log(Logic.getBoard()[row][column])
                }

                $scope.setGameMode=function(gameMode){
                        Logic.setGameMode(gameMode);
                };

                $scope.completeTurn=function(){
                        console.log("TURN COMPLETE");
                        Logic.completeTurn();
                        console.log(Logic.getBoard());
                };

                $scope.store = function(row,column){
                        stored = {r:row,c:column};
                };

                $scope.showDirectionInput = function(){
                     if(stored){
                             return true;
                     }else{
                             return false;
                     }
                };

                $scope.getLeft=function(){
                        if(stored){
                                return stored.c * 6.66 * .75;
                        }
                };

                $scope.getTop=function(){
                        if(stored){
                                return stored.r * 6.66;
                        }
                };

                $scope.test = function(element){
                        if(element.keyCode == 13){
                                var elem = element.srcElement || element.target;
                               validateProgram(elem.value);
                                elem.value = '';
                        }
                };

                function validateProgram(value){
                        value = value.toUpperCase();
                        var chars = value.split('');

                        if(isValidInputString(chars)){
                                update(stored.r, stored.c,chars)
                        }

                }

                function isValidInputString(value){
                        //Check the length of the string
                        if(value.length !== 4){
                                return false;
                        }

                        //Check that it has one of each type
                        return value.includes("U") && value.includes("D") &&
                            value.includes("L") && value.includes("R");
                }

                function format(direction){
                        var returnVals = [];
                        for(var i = 0; i < direction.length; i++){
                                var val = direction[i];
                                if(val === "U"){
                                        returnVals.push("UP");
                                }else if(val === "D"){
                                        returnVals.push("DOWN");
                                }else if(val === "R"){
                                        returnVals.push("RIGHT");
                                }else if(val === "L"){
                                        returnVals.push("LEFT");
                                }
                        }
                        return returnVals;
                }

                function newGame (numberOfPlayers, player1Name, player2Name){
                        Logic.newGame(numberOfPlayers, player1Name, player2Name);
                }

                $scope.getScore = function(playerNumber){
                        Logic.getScore(playerNumber);
                };

                $scope.getRemainingMoves = function(playerNumber){
                        Logic.getRemainingMoves(playerNumber);
                };

                function boo(checkbox){
                        if(checkbox.checked){
                                return 2;
                        }else{
                                return 1;
                        }
                }

                $scope.start = function(){
                        var player1Name = document.getElementById("p1Name").value;
                        var player2Name = document.getElementById("p2Name").value;
                        var checkbox = document.getElementById("numPlayers");
                        var numberOfPlayers = boo(checkbox);
                        newGame(numberOfPlayers, player1Name, player2Name);
                };



            }]);