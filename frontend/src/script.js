document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const startGameButton = document.getElementById('start-game');
    const joinGameButton = document.getElementById('join-game');
    const gameBoard = document.getElementById('game-board');
    const gameCells = document.querySelectorAll('.game-cell');
    const gameMessage = document.getElementById('game-message');
    const gameIdDisplay = document.getElementById('game-id-display');
    let gameId = null;
    let playerSymbol = null;

    startGameButton.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        if (!username) {
            alert('Please enter a username.');
            return;
        }
        fetch('http://localhost:3000/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        })
        .then(response => response.json())
        .then(data => {
            gameId = data.gameId;
            playerSymbol = data.symbol;
            gameIdDisplay.textContent = `Game ID: ${gameId}`;
            gameBoard.style.display = 'grid';
            gameMessage.textContent = 'Waiting for an opponent...';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    joinGameButton.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        gameId = prompt('Enter the Game ID provided by the first player:');
        if (!username || !gameId) {
            alert('Please enter a username and a game ID.');
            return;
        }
        fetch('http://localhost:3000/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, gameId })
        })
        .then(response => response.json())
        .then(data => {
            playerSymbol = data.symbol;
            gameBoard.style.display = 'grid';
            gameMessage.textContent = `Joined game as ${playerSymbol}. Your move!`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    gameCells.forEach(cell => {
        cell.addEventListener('click', function() {
            if (!this.textContent && gameId && playerSymbol === playerSymbol) {
                makeMove(this.getAttribute('data-index'));
            }
        });
    });

    function makeMove(index) {
        fetch('http://localhost:3000/move', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameId: gameId, symbol: playerSymbol, tile: index })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateBoard(data.board);
                if (data.winner) {
                    gameMessage.textContent = data.winner === 'Draw' ? 'It\'s a draw!' : `Player ${data.winner} wins!`;
                    gameBoard.classList.add('game-over');
                } else {
                    gameMessage.textContent = data.turn === playerSymbol ? "Your move" : "Opponent's move";
                }
            } else {
                gameMessage.textContent = 'Invalid move or not your turn.';
            }
        })
        .catch(error => {
            console.error('Error making a move:', error);
        });
    }

    function updateBoard(board) {
        board.forEach((cell, index) => {
            gameCells[index].textContent = cell;
        });
    }
});
