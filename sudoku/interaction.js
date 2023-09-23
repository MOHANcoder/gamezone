function addLevelFunctionality(integator, levelsCollection) {
    integator.addEventListener('click', function () {
        g.setDifficulty(levels[integator.innerText.replace(' ', '').toUpperCase()]);
        g.loadGame();
        for (let levelIntegator of levelsCollection) {
            levelIntegator.classList.remove('active');
        }
        integator.classList.add('active');
    });
}

function addLevels() {
    let levelsCollection = document.querySelectorAll(".levels > div");
    for (let levelIntegator of levelsCollection) {
        addLevelFunctionality(levelIntegator, levelsCollection);
    }
}

function showSolution() {
    const solutionBox = document.querySelector(".solution");
    solutionBox.addEventListener("click", function () {
        g.solve();
    })
}

function showInfo() {
    const info = document.querySelector(".help");
    info.addEventListener('click', function () {
        Swal.fire(
            'Info',
            `
            <img width="100%" src="./assets/sudoku-img.jpg" />
            <strong><big>Sudoku</big></strong> is one of the most popular puzzle games of all time. The goal of Sudoku is to fill a 9×9 grid with numbers so that each row, column and 3×3 section contain all of the digits between 1 and 9. As a logic puzzle, Sudoku is also an excellent brain game. If you play Sudoku daily, you will soon start to see improvements in your concentration and overall brain power. Start a game now. Within no time Sudoku free puzzles will be your favorite online game.
            <a href="https://en.wikipedia.org/wiki/Sudoku">Learn more</a>
            `
        );
    })
}

function showHint() {
    document.querySelector(".hints").addEventListener("click", function () {
        const hint = g.getHint();
        Swal.fire(
            'Hint',
            hint
        );
    });
}

showInfo();
showSolution();
showHint();
addLevels();