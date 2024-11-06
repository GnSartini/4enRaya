import React from 'react';
import { Player, GameState } from '../types';

interface GameBoardProps {
  gameState: GameState;
  selectedPlayer: Player | null;
  onCellClick: (row: number, col: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  selectedPlayer,
  onCellClick,
}) => {
  const handleColumnClick = (col: number) => {
    if (!selectedPlayer || gameState.isLoading || gameState.winner) return;

    // Find the lowest empty cell in the column
    for (let row = 5; row >= 0; row--) {
      if (!gameState.board[row][col]) {
        onCellClick(row, col);
        break;
      }
    }
  };

  return (
    <div className="bg-blue-900 p-4 rounded-lg shadow-xl">
      <div className="grid grid-cols-7 gap-2">
        {[0, 1, 2, 3, 4, 5, 6].map((col) => (
          <button
            key={col}
            onClick={() => handleColumnClick(col)}
            className="h-12 bg-blue-800 hover:bg-blue-700 rounded-t-lg transition-colors"
            disabled={gameState.isLoading || !!gameState.winner}
          />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 mt-2">
        {gameState.board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="aspect-square bg-blue-800 rounded-full p-2"
            >
              <div
                className={`w-full h-full rounded-full transition-colors ${
                  cell
                    ? `bg-${cell}-500`
                    : 'bg-gray-700'
                }`}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;