import React, { useState, useEffect } from 'react';
import './App.css';

// Color theme constants for inline styles
const COLORS = {
  primary: '#3498db',
  secondary: '#2ecc71',
  accent: '#e74c3c',
  boardBg: '#fff',
  boardBorder: '#e9ecef',
  cellHover: '#f4f8fb',
  cellActive: '#f4f8fb',
  text: '#282c34'
};

/*
PUBLIC_INTERFACE
Main App component for the Tic Tac Toe game.
*/
function App() {
  // Game state: 9 cells for the board
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true); // X always starts
  const [gameOver, setGameOver] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState({winner: null, line: null});
  const [statusMsg, setStatusMsg] = useState('');
  const [isDraw, setIsDraw] = useState(false);

  // Responsive root font size change (optional, for extra polish)
  useEffect(() => {
    const setRootFont = () => {
      document.documentElement.style.fontSize =
        window.innerWidth < 480 ? '15px' : '18px';
    };
    setRootFont();
    window.addEventListener("resize", setRootFont);
    return () => window.removeEventListener("resize", setRootFont);
  }, []);

  // Game logic effect: checks for win/draw conditions
  useEffect(() => {
    const result = calculateWinner(squares);
    if (result.winner) {
      setGameOver(true);
      setWinnerInfo(result);
      setStatusMsg(`Winner: ${result.winner === 'X' ? "Player 1 (X)" : "Player 2 (O)"}`);
      setIsDraw(false);
    } else if (!squares.includes(null)) {
      setGameOver(true);
      setWinnerInfo({winner: null, line: null});
      setStatusMsg('Draw!');
      setIsDraw(true);
    } else {
      setGameOver(false);
      setIsDraw(false);
      setWinnerInfo({winner: null, line: null});
      setStatusMsg(`Next: ${xIsNext ? "Player 1 (X)" : "Player 2 (O)"}`);
    }
  }, [squares, xIsNext]);

  // Handle cell click
  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (squares[idx] || gameOver) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setWinnerInfo({winner: null, line: null});
    setIsDraw(false);
    setStatusMsg('Game Reset. Player 1 (X) starts.');
  }

  // Helper render for a single cell
  function renderSquare(idx) {
    const highlight = winnerInfo.line && winnerInfo.line.includes(idx);
    return (
      <button
        className="ttt-cell"
        style={{
          color: squares[idx] === 'X'
            ? COLORS.primary
            : squares[idx] === 'O'
              ? COLORS.accent
              : COLORS.text,
          backgroundColor: highlight
            ? COLORS.secondary
            : COLORS.boardBg,
          borderColor: highlight ? COLORS.secondary : COLORS.boardBorder,
        }}
        onClick={() => handleClick(idx)}
        aria-label={squares[idx] ? `Cell ${idx+1} (${squares[idx]})` : `Cell ${idx+1} empty`}
        key={idx}
        disabled={Boolean(squares[idx]) || gameOver}
      >
        {squares[idx]}
      </button>
    );
  }

  return (
    <div className="ttt-app-container"
         style={{minHeight: '100vh', display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: COLORS.boardBg}}
    >
      <header className="ttt-header"
        style={{
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}
      >
        <h1 style={{
          fontWeight: 700,
          letterSpacing: '0.02em',
          fontSize: '2.2rem',
          color: COLORS.primary,
          margin: 0,
        }}>
          Tic Tac Toe
        </h1>
        <p style={{
          color: COLORS.text,
          opacity: 0.7,
          fontSize: '1.03rem',
          fontWeight: 400,
          margin: '0.5rem 0'
        }}>Modern web edition</p>
      </header>
      <main>
        <div
          className="ttt-status"
          style={{
            margin: '0 0 1.1rem 0',
            fontWeight: 500,
            color: gameOver ?
              winnerInfo.winner ? COLORS.secondary : COLORS.accent
              : COLORS.text,
            fontSize: '1.25rem',
            minHeight: '1.5rem'
          }}
          aria-live="polite"
        >
          {statusMsg}
        </div>
        <div
          className="ttt-board"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 4.4rem)',
            gridTemplateRows: 'repeat(3, 4.4rem)',
            gap: '0.3rem',
            margin: '0 auto',
            background: COLORS.boardBorder,
            borderRadius: '18px',
            padding: '0.6rem',
            boxShadow: '0 2px 15px rgba(52,152,219,0.06)'
          }}
        >
          {Array(9).fill(0).map((_, idx) => renderSquare(idx))}
        </div>
        <div style={{
          marginTop: '1.8rem',
          textAlign: 'center'
        }}>
          <button
            className="ttt-reset-btn"
            onClick={resetGame}
            style={{
              background: COLORS.primary,
              color: "#fff",
              padding: '0.7rem 2.1rem',
              borderRadius: '7px',
              border: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              letterSpacing: '0.02em',
              transition: 'background 0.25s',
              marginTop: '0.3rem',
              boxShadow: isDraw
                ? `0 0 0 3px ${COLORS.accent}33`
                : winnerInfo.winner
                  ? `0 0 0 3px ${COLORS.secondary}33`
                  : 'none',
              outline: 'none',
              cursor: 'pointer'
            }}
            aria-label="Reset game"
          >
            {gameOver ? 'Play Again' : 'Reset'}
          </button>
        </div>
      </main>
      <footer style={{
        marginTop: '2.5rem',
        color: COLORS.text,
        opacity: 0.4,
        fontSize: '0.98rem'
      }}>
        &copy; {new Date().getFullYear()} Modern Tic Tac Toe
      </footer>
    </div>
  );
}

/*
PUBLIC_INTERFACE
calculateWinner: Determines if there's a winner on the board.
Returns: {winner: 'X'|'O'|null, line: [index...]}
*/
function calculateWinner(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return {winner: squares[a], line};
    }
  }
  return {winner: null, line: null};
}

export default App;
