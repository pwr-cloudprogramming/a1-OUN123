const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let waitingPlayer = null;
let games = {};

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

const checkWin = (board) => {
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Return 'X' or 'O' for winner
        }
    }
    return board.includes(null) ? null : 'Draw'; // Check for draw
};

app.post('/enter', (req, res) => {
    const { username } = req.body;
    if (waitingPlayer) {
        const gameId = Date.now().toString();
        games[gameId] = { players: {'X': waitingPlayer, 'O': username}, board: Array(9).fill(null), turn: 'X' };
        waitingPlayer = null;
        res.json({ gameId, symbol: 'X', opponent: username });
    } else {
        waitingPlayer = username;
        res.json({ waiting: true });
    }
});

app.post('/move', (req, res) => {
    const { gameId, player, tile } = req.body;
    const game = games[gameId];
    if (game && game.board[tile] === null) {
        game.board[tile] = game.turn;
        const win = checkWin(game.board);
        game.turn = game.turn === 'X' ? 'O' : 'X';
        res.json({
            success: true,
            board: game.board,
            turn: game.turn,
            win: win
        });
    } else {
        res.status(400).json({ success: false, message: 'Invalid move or game does not exist.' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
