/**
 * Created by islam on 12/6/15.
 */
(function () {
    "use strict";

    angular.module('myApp', []).factory('bSLogicService',
        function () {
            var sampleObject = {
                state: "void",
                left: false,
                right: false,
                top: true,
                bottom:false
            };

            var sampleObject2 = {
                state: "void",
                left: false,
                right: true,
                top: true,
                bottom:true
            };

            var board =
                [[sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject],
                    [sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject],
                    [sampleObject2,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject],
                    [sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject],
                    [sampleObject,sampleObject2,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject],
                    [sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject],
                    [sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject],
                    [sampleObject2,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject],
                    [sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject],
                    [sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject],
                    [sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject],
                    [sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject],
                    [sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject],
                    [sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject],
                    [sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject,sampleObject]
                ];



            function isValidMove(){
                return true;
            }
            function getBoard(){
                return board;
            }


            /**
             *
             * @param row int
             * @param column int
             * @param player int
             */
            function makeMove(row,column,player){

            }

            function leftNode(row,column){
                return board[row, column - 1];
            }

            function rightNode(row,column){
                return board[row, column + 1];
            }

            function topNode(row,column){
                return board[row -1, column];
            }
            function bottomNode(row,column){
                return board[row + 1, column];
            }

        return {
            isValidMove:isValidMove,
            getBoard:getBoard,
            makeMove:makeMove
        };
        });
        }());