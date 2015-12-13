/**
 * Created by islam on 12/6/15.
 */
'use strict';
angular.module('myApp')
      .controller('Ctrl', ['$scope','Logic',
        function ($scope, Logic) {
                var board = Logic.getBoard();
                var player = Logic.currentPlayer();
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
                        return board[row][column].top === true;
                };

                $scope.isConnectedBottom = function(row,column){
                        return board[row][column].bottom === true;
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
                        console.log ("IMAGECHECK")
                        if(board[row][column].status === "occupied_one"){
                                return "/bertleft.png";
                        }else if(board[row][column].status === "occupied_two"){
                                return "/coily.png";
                        }else{
                                return "/coily.png";//false;
                        }

                };
                $scope.update=function(row,column){
                        console.log(player);
                        if(Logic.isValidMove(row,column,player)){
                                Logic.makeMove(row,column,player,["UP","DOWN","LEFT","RIGHT"]);
                        }
                };

                $scope.setGameMode=function(gameMode){
                        Logic.setGameMode(gameMode);
                }

            }]);