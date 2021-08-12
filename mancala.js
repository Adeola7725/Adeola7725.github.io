"use strict";

// 1. Make 2 players
// 2. Make 6 pits for each player and 2 scoring pools
// 3. Be able to loop through and add marbles to pits

let isPlayer1Turn = true;
let gameOver = false;

// ----------------B--O--A--R--D-------------------------------------------------------
//          [0][1][2][3][4][5]      [6]          [7][8][9][10][11][12]    [13]
let board = [4, 4, 4, 4, 4, 4,       0,            4, 4, 4, 4, 4, 4,       0];
//          <--- p1 pits --->    p1 score pool     <--- p2 pits --->    p2 score pool
//             indices 0-5         index 6            indices 7-12        index 13
// ------------------------------------------------------------------------------------

function moveMarbles(index) {
    // if the game is over, pressing the buttons will not do anything
    if (gameOver) {
        return;
    }
    // check if the player chose a valid pit to seed
    if (!isValidInput(index)) {
        if (isPlayer1Turn) {
            alert("Player 1, you may only choose from the bottom row of pits, and the pit must contain marbles. Please choose again.");
        }
        else {
            alert("Player 2, you may only choose from the top row of pits, and the pit must contain marbles. Please choose again.");
        }
        return;
    }

    // number of marbles to seed into next pits
    let numMarbles = board[index];
    // the chosen pit is emptied
    board[index] = 0;
    // index to start seeding at
    let sIndex = index + 1;
    // the last index the marble landed on
    let lIndex = 0;

    for(let i = 0; i < numMarbles; i++) {
        // if it is player 1's turn skip player 2's scoring pool
        if (isPlayer1Turn && sIndex === 13) {
            sIndex = 0;
            i--;
            continue;
        }
        // if it is player 2's turn skip player 1's scoring pool
        else if (!isPlayer1Turn && sIndex === 6) {
            sIndex++;
            i--;
            continue;
        }
        board[sIndex] += 1;
        lIndex = sIndex;
        sIndex++;
        if (sIndex > 13) {
            sIndex = 0;
        }
    }

    specialRules(lIndex);
    updateBoard();

    if (isGameOver()) {
        moveMarblesEnd();
        if (whoIsWinner() === 1) {
            document.getElementById("winMessage").innerText = "Congratulations! Player 1 wins!";
        }
        else if (whoIsWinner() === 2) {
            document.getElementById("winMessage").innerText = "Congratulations! Player 2 wins!";
        }
        else {
            document.getElementById("winMessage").innerText = "It's a tie! Hope you had fun!";
        }
    }
}

// implements all the special rules
function specialRules(index) {
    if (isPlayer1Turn) {
        // if player 1's last marble lands in their scoring pool they get another turn
        if (index === 6) {
            return;
        }
        // if player 1's last marble lands on an empty pit they get the marbles from that pit and the pit across from it
        else if (board[index] === 1 && index >= 0 && index <= 5) {
            board[6] += board[index];
            board[index] = 0;

            switch (index) {
                case 0:
                    board[6] += board[12];
                    board[12] = 0;
                    break;
                case 1:
                    board[6] += board[11];
                    board[11] = 0;
                    break;
                case 2:
                    board[6] += board[10];
                    board[10] = 0;
                    break;
                case 3:
                    board[6] += board[9];
                    board[9] = 0;
                    break;
                case 4:
                    board[6] += board[8];
                    board[8] = 0;
                    break;
                case 5:
                    board[6] += board[7];
                    board[7] = 0;
                    break;
            }
        }
    }

    else if (!isPlayer1Turn) {
        // if player 2's last marble lands in their scoring pool they get another turn
        if (index === 13) {
            return;
        }
        // if player 2's last marble lands on an empty pit they get the marbles from that pit and the pit across from it
        else if (board[index] === 1 && index >= 7 && index <= 12) {
            board[13] += board[index];
            board[index] = 0;

            switch (index) {
                case 7:
                    board[13] += board[5];
                    board[5] = 0;
                    break;
                case 8:
                    board[13] += board[4];
                    board[4] = 0;
                    break;
                case 9:
                    board[13] += board[3];
                    board[3] = 0;
                    break;
                case 10:
                    board[13] += board[2];
                    board[2] = 0;
                    break;
                case 11:
                    board[13] += board[1];
                    board[1] = 0;
                    break;
                case 12:
                    board[13] += board[0];
                    board[0] = 0;
            }
        }
    }
    isPlayer1Turn = !isPlayer1Turn;
}

// updates the board at the end of each turn
function updateBoard() {
    // updates the values on the buttons and in the scoring pools
    for (let i = 0; i < board.length; i++) {
        if (i !== 6 && i !== 13) {
            let button = document.getElementById(i.toString());
            button.innerHTML = (board[i].toString());
        } else if (i === 6) {
            let p = document.getElementById("6");
            p.innerText = board[6].toString();
        } else if (i === 13) {
            let p = document.getElementById("13");
            p.innerText = board[13].toString();
        }
    }

    // updates the glowing effect that shows which player's turn it is
    if (isPlayer1Turn) {
        let p = document.getElementById("p1Score");
        p.style.textShadow = "0 0 10px white";
        let p2 = document.getElementById("p2Score");
        p2.style.textShadow = "none";
    }
    else if (!isPlayer1Turn) {
        let p = document.getElementById("p2Score");
        p.style.textShadow = "0 0 10px white";
        let p2 = document.getElementById("p1Score");
        p2.style.textShadow = "none";
    }
}

// checks to see if the player chooses the appropriate pits (player 1 - bottom row, player 2 - top row)
function isValidInput(index) {
    // if it is player 1's turn, they can only choose between indices 0 and 5
    if (isPlayer1Turn) {
        if (index >= 0 && index <= 5 && board[index] !== 0) {
            return true;
        }
    }
    // if it is player 2's turn, they can only choose between indices 7 and 13
    if (!isPlayer1Turn) {
        if (index >= 7 && index <= 13 && board[index] !== 0) {
            return true;
        }
    }
    return false;
}

// the game is over if either side is completely empty of marbles
function isGameOver() {
    gameOver = true;
    for (let i = 0; i < 6; i++) {
        if (board[i] !== 0) {
            gameOver = false;
        }
    }

    if (gameOver === false) {
        gameOver = true;
        for (let i = 7; i < 13; i++) {
            if (board[i] !== 0) {
                gameOver = false;
            }
        }
    }

    return gameOver;
}

// for the player who still has marbles, move all those marbles to their scoring pool
function moveMarblesEnd() {
    // find out which player still has marbles;
    let containsMarbles1 = false;
    let containsMarbles2 = false;
    for (let i = 0; i < 6; i++) {
        if (board[i] > 0) {
            containsMarbles1 = true;
            break;
        }
    }
    for (let i = 7; i < 13; i++) {
        if (board[i] > 0) {
            containsMarbles2 = true;
            break;
        }
    }

    // add the remaining marbles to a player
    if (containsMarbles1) {
        for (let i = 0; i < 6; i++) {
            board[6] += board[i];
            board[i] = 0;
        }
    }
    else if (containsMarbles2) {
        for (let i = 7; i < 13; i++) {
            board[13] += board[i];
            board[i] = 0;
        }
    }

    updateBoard();
}

// returns which player has more points at the end of the game
function whoIsWinner() {
    if (board[6] > board[13]) {
        return 1;
    }
    else if (board[6] < board[13]){
        return 2;
    }
    else {
        return 0;
    }
}

// resets the board (all the pits to 4, scoring pools to 0, and make it player 1's turn)
function reset() {
    for (let i = 0; i < 6; i++) {
        board[i] = 4;
    }
    board[6] = 0;
    for (let i = 7; i < 13; i++) {
        board[i] = 4;
    }
    board[13] = 0;

    isPlayer1Turn = true;
    gameOver = false;
    document.getElementById("winMessage").innerText = "";
    updateBoard();
}