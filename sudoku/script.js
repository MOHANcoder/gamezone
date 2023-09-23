const container = document.querySelector(".board");
const statusBoard = document.querySelector(".status");

const levels = Object.freeze({
    SIMPLE: 7,
    EASY: 15,
    MEDIUM: 30,
    HARD: 45,
    SUPERHARD: 65
});

function Sudoku(container, level = levels.EASY) {
    this.container = container;
    this.nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.board = null;
    this.referenceBoard = null;
    this.level = level;
    this.status = [
        "Invaild value found on the cell",
        "Duplicates found on the same row",
        "Duplicates found on the same column",
        "Duplicates found on the sub-matrix",
        "Good Try",
        "Congratulations You solved it"
    ];
    this.statusBoard = null;

    this.getRandom = function (from, to) {
        return Math.floor(Math.random() * (to - from) + from);
    }

    this.loadGame = function () {
        this.board = Array.from({
            length: 9
        }, function () {
            return Array.from({
                length: 9
            }, function () {
                return 0;
            });
        });
        this.createBoard();
        console.log(this.board);
        this.putIntoBoard();
    }

    this.setStatusBoard = function (statusBoard) {
        this.statusBoard = statusBoard;
    }

    this.setDifficulty = function (level) {
        this.level = level;
    }

    this.putIntoBoard = function () {
        container.innerHTML = `<table>
            ${this.board.map(function (row, j) {
            return `<tr >
                    ${row.map(function (col, i) {
                let classes = `cell${j}${i}`;
                classes += (j === 8 || (j + 1) % 3) ? '' : ' highlight-bottom';
                classes += (i === 8 || (i + 1) % 3) ? '' : ' side';
                classes += (col) ? '' : ' empty';
                return `<td class=\'${classes}\'>${col ? col : ''}</td>`;
            }).join('')}
                </tr>`;
        }).join('')}
        </table>`;
        this.addEditingFunctionality();
    }

    this.addEditingFunctionality = function () {
        for (let cell of document.getElementsByClassName('empty')) {
            cell.contentEditable = true;
            const self = this;
            cell.addEventListener('input', function (e) { // Alternate way to resolve the 'this context' problem - change the normal function to ES6+ arrow function that's enough variable 'self' is not needed.
                console.log(e.target.className);
                let currentCell = e.target;
                let [i, j] = currentCell.className.substring(4, 6).split('').map(e => parseInt(e));

                if (currentCell.innerText.length === 0) {
                    return;
                }

                currentCell.innerText = currentCell.innerText[0];

                if (parseInt(currentCell.innerText) === 0 || (currentCell.innerText.length !== 0 && !isFinite(parseInt(currentCell.innerText)))) {
                    self.makeAlert(i, j, 0);
                    currentCell.innerText = '';
                    return;
                }

                let flags = self.checkValidToEnter(parseInt(currentCell.innerText), i, j);


                if (flags[0] == false) {
                    self.makeAlert(i, j, 1);
                }

                if (flags[1] == false) {
                    self.makeAlert(i, j, 2);
                }

                if (flags[2] == false) {
                    self.makeAlert(i, j, 3);
                }
                currentCell.innerText = currentCell.innerText[0] ?? '';
                if (isFinite(parseInt(currentCell.innerText)) && flags.every(function (flag) { return flag })) {
                    console.log(currentCell.innerText, flags);
                    self.board[i][j] = parseInt(currentCell.innerText);
                    self.disappearMessage(4);
                }

                if (self.isSolved()) {
                    self.disappearMessage(5, true);
                }
            });
        }
    }

    this.disappearMessage = function (whereToAlert, stable = false) {
        let statusMessage = document.createElement('p');
        statusMessage.innerHTML = this.status[whereToAlert];
        statusBoard.appendChild(statusMessage);
        if (stable) {
            return;
        }
        setTimeout(function () {
            statusBoard.removeChild(statusMessage);
        }, 2000);
    }

    this.makeAlert = function (row, column, whereToAlert) {

        function removeBlinkClass(row, column) {
            let cell = document.querySelector(`.cell${row}${column}`);
            cell.classList.add('blink');
            setTimeout(function () {
                cell.classList.remove('blink');
            }, 2000);
        }

        if (whereToAlert === 0) {
            removeBlinkClass(row, column);
        } else if (whereToAlert === 1) {
            for (let i = 0; i < 9; i++) {
                removeBlinkClass(row, i);
            }
        } else if (whereToAlert === 2) {
            for (let i = 0; i < 9; i++) {
                removeBlinkClass(i, column);
            }
        } else {
            let rowStart = row - (row % 3), columnStart = column - (column % 3);
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    removeBlinkClass(rowStart + i, columnStart + j);
                }
            }
        }
        this.board[row][column] = 0;
        this.disappearMessage(whereToAlert);
        navigator.vibrate(100);
    }

    this.checkValidToEnter = function (n, row, column) {
        let flags = [true, true, true];

        for (let i = 0; i < 9; i++) {
            if (this.board[row][i] === n && i !== column) {
                flags[0] = false;
                break;
            }
        }

        for (let i = 0; i < 9; i++) {
            if (this.board[i][column] === n && i !== row) {
                flags[1] = false;
                break;
            }
        }

        let rowStart = row - (row % 3), columnStart = column - (column % 3);

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[rowStart + i][columnStart + j] === n && (rowStart + i !== row || columnStart + j !== column)) {
                    flags[2] = false;
                    return flags;
                }
            }
        }

        return flags;
    }


    this.isSafeToEnter = function (n, row, column) {
        for (let i = 0; i < 9; i++) {
            if (this.board[row][i] === n) {
                return false;
            }
        }
        for (let i = 0; i < 9; i++) {
            if (this.board[i][column] === n) {
                return false;
            }
        }

        let rowStart = row - (row % 3), columnStart = column - (column % 3);

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[rowStart + i][columnStart + j] === n) {
                    return false;
                }
            }
        }

        return true;
    }

    this.boxIncludes = function (rowStart, columnStart, n) {
        for (let i = rowStart; i < rowStart + 3; i++) {
            for (let j = columnStart; j < columnStart + 3; j++) {
                if (this.board[i][j] === n) {
                    return true;
                }
            }
        }
        return false;
    }

    this.shuffle = function () {
        for (let i = 0; i < 9; i++) {
            let j = Math.floor(Math.random() * 9);
            [this.nums[i], this.nums[j]] = [this.nums[j], this.nums[i]];
        }
    }

    this.fillRemaining = function (i, j) {
        // Check if we have reached the end of the matrix
        if (i === 8 && j === 9) {
            return true;
        }

        // Move to the next row if we have reached the end of the current row
        if (j === 9) {
            i += 1;
            j = 0;
        }


        // Skip cells that are already filled
        if (this.board[i][j] !== 0) {
            return this.fillRemaining(i, j + 1);
        }

        // Try filling the current cell with a valid value
        for (let num = 1; num <= 9; num++) {
            if (this.isSafeToEnter(num, i, j)) {
                this.board[i][j] = num;
                if (this.fillRemaining(i, j + 1)) {
                    return true;
                }
                this.board[i][j] = 0;
            }
        }

        return false;
    }

    this.generateMatrix = function (rowStart, columnStart) {
        let k;
        this.shuffle();
        k = 0;
        for (let i = rowStart; i < rowStart + 3; i++) {
            for (let j = columnStart; j < columnStart + 3; j++) {
                this.board[i][j] = this.nums[k++];
            }
        }
        this.nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }

    this.removeNumbers = function () {
        let k = this.level;
        while (k > 0) {
            let i = this.getRandom(0, 9);
            let j = this.getRandom(0, 9);
            if (this.board[i][j] !== 0) {
                this.board[i][j] = 0;
                k--;
            }
        }
    }

    this.isSolved = function () {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] == 0) {
                    return false;
                }
            }
        }
        Swal.fire(
            'Congratulations!',
            'You solved',
            'success'
        );
        return true;
    }

    this.createBoard = function () {
        this.generateMatrix(0, 0);
        this.generateMatrix(3, 3);
        this.generateMatrix(6, 6);
        this.fillRemaining(0, 3);
        this.referenceBoard = this.board.map(function (arr) {
            return arr.slice();
        });

        this.removeNumbers();
    }

    this.solve = function () {
        for (let cell of document.querySelectorAll(".empty")) {
            let [i, j] = cell.className.substring(4, 6).split('').map(e => parseInt(e));
            cell.innerText = this.referenceBoard[i][j];
            cell.contentEditable = false;
        }
    }

    this.getHint = function () {
        for (let cell of document.querySelectorAll(".empty")) {
            let [i, j] = cell.className.substring(4, 6).split('').map(e => parseInt(e));
            if (this.referenceBoard[i][j] !== parseInt(cell.innerText)) {
                return `The cell located on ${i + 1}th row , ${j + 1}th column has the value ${this.referenceBoard[i][j]}`;
            }
        }
        return 'Board is Already Solved';
    }
}

let g = new Sudoku(container);
g.setDifficulty(levels.MEDIUM);
g.setStatusBoard(statusBoard);
g.loadGame();
