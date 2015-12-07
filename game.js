/**
 * Created by islam on 12/6/15.
 */
'use strict';
angular.module('myApp')
    .controller('Ctrl', ['$scope','bSLogicService',

            function ($scope, bSLogicService) {

                var board = bSLogicService.getBoard();

                $scope.isVoid = function(row,column){
                        return board[row,column].state === "void";
                };

                $scope.isFree = function(row,column){
                        return board[row,column].state === "free";
                };

                $scope.isConnectedLeft = function(row,column){
                        return board[row,column].left === true;
                };

                $scope.isConnectedRight = function(row,column){
                        return board[row,column].right === true;
                };

                $scope.isConnectedTop = function(row,column){
                        return board[row,column].top === true;
                };

                $scope.isConnectedBottom = function(row,column){
                        return board[row,column].bottom === true;
                };

                $scope.isTakenPlayerOne=function(row,column){
                        return board[row,column].state === "captured_one";
                };

                $scope.isTakenPlayerTwo=function(row,column){
                        return board[row,column].state === "captured_two";
                };

                $scope.shouldShowImage=function(row,column){
                        return board[row,column].state === "occupied_one" || board[row,column].state === "occupied_two";
                };

                $scope.imageLink=function(row,column){
                        if(board[row,column].state === "occupied_one"){
                                return "bertleft.png";
                        }else if(board[row,column].state === "occupied_two"){
                                return "coily.png";
                        }else{
                                return false;
                        }

                };
                $scope.update=function(row,column,player){
                        if(bSLogicService.isValidMove(row,column,player)){
                                bSLogicService.makeMove(row,column,player);
                        }
                }

            }]);