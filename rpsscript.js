const choices = document.querySelectorAll('.choice');
const resultText = document.getElementById('resultText');

choices.forEach(choice => {
    choice.addEventListener('click', playGame);
});

function playGame(e) {
    const playerChoice = e.target.id;
    const computerChoice = getComputerChoice();

    const winner = getWinner(playerChoice, computerChoice);
    showResult(winner, computerChoice);
}

function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}

function getWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'It\'s a tie!';
    } else if ((playerChoice === 'rock' && computerChoice === 'scissors') || 
               (playerChoice === 'paper' && computerChoice === 'rock') || 
               (playerChoice === 'scissors' && computerChoice === 'paper')) {
        return 'You win!';
    } else {
        return 'Computer wins!';
    }
}

function showResult(winner, computerChoice) {
    resultText.innerText = `${winner} Computer chose ${computerChoice}.`;
}
