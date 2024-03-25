document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const startGameButton = document.getElementById('start-game');
    const gameBoard = document.getElementById('game-board');
    const gameMessage = document.getElementById('game-message');
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];

    startGameButton.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        if (username) {
            fetch('http://localhost:3000/enter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username })
            })
            .then(response => response.json())
            .then(data => {
                if (!data.waiting) {
                    gameBoard.style.display = 'grid';
                    // Clear the game message when starting a new game
                    gameMessage.innerText = '';
                } else {
                    gameMessage.innerText = 'Waiting for an opponent...';
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });

    gameBoard.addEventListener('click', function(event) {
        if (event.target.className.includes('game-cell') && !event.target.innerText && !gameMessage.innerText) {
            event.target.innerText = currentPlayer;
            gameState[event.target.dataset.index] = currentPlayer;
            const gameWon = checkGameStatus();
            if (gameWon) {
                gameMessage.innerText = currentPlayer + ' wins!';
                gameBoard.removeEventListener('click', handleTileClick);
                return;
            } else if (!gameState.includes('')) {
                gameMessage.innerText = 'It\'s a draw!';
                return;
            }
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    });

    function checkGameStatus() {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winConditions.some(condition => {
            if (gameState[condition[0]] === currentPlayer &&
                gameState[condition[0]] === gameState[condition[1]] &&
                gameState[condition[0]] === gameState[condition[2]]) {
                return true;
            }
            return false;
        });
    }
});
