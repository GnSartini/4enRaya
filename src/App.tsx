import React, { useState, useEffect } from 'react';
import { Circle } from 'lucide-react';
import GameBoard from './components/GameBoard';
import PlayerSelector from './components/PlayerSelector';
import { Player, GameState, PlayerCount } from './types';
import { checkWinner } from './utils/gameLogic';
import { fetchGameState, updateGameState, resetGame } from './services/api';

function App() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [playerCount, setPlayerCount] = useState<PlayerCount>(2);
  const [gameState, setGameState] = useState<GameState>({
    board: Array(6).fill(null).map(() => Array(7).fill(null)),
    currentTurn: null,
    winner: null,
    isLoading: false,
    error: null,
    playerCount: 2,
    lastPlayer: null
  });

  const handleCellClick = async (row: number, col: number) => {
    if (!selectedPlayer || 
        gameState.isLoading || 
        gameState.winner || 
        (gameState.currentTurn && gameState.currentTurn !== selectedPlayer.color)) return;

    setGameState(prev => ({ ...prev, isLoading: true, error: null }));

    const response = await updateGameState(selectedPlayer.color, { row, col }, playerCount);
    
    if (response) {
      const winner = checkWinner(response.board);
      setGameState(prev => ({
        ...prev,
        board: response.board,
        currentTurn: response.currentTurn,
        lastPlayer: response.lastPlayer,
        winner,
        isLoading: false,
        playerCount: response.playerCount || prev.playerCount
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update game state. Please try again.'
      }));
    }
  };

  const handleReset = async () => {
    if (!gameState.winner) return;

    setGameState(prev => ({ ...prev, isLoading: true, error: null }));
    setSelectedPlayer(null);

    const response = await resetGame();
    
    if (response) {
      setGameState({
        board: response.board,
        currentTurn: null,
        winner: null,
        isLoading: false,
        error: null,
        playerCount: 2,
        lastPlayer: null
      });
    } else {
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to reset game. Please try again.'
      }));
    }
  };

  const handlePlayerCountChange = async (count: PlayerCount) => {
    setPlayerCount(count);
    const response = await resetGame(count);
    
    if (response) {
      setGameState(prev => ({
        ...prev,
        board: response.board,
        currentTurn: response.currentTurn,
        playerCount: count,
        lastPlayer: null
      }));
    }
  };

  useEffect(() => {
    let mounted = true;
    let pollInterval: number;

    const pollGameState = async () => {
      const data = await fetchGameState();
      
      if (mounted && data) {
        const winner = checkWinner(data.board);
        setGameState(prev => ({
          ...prev,
          board: data.board,
          currentTurn: data.currentTurn,
          lastPlayer: data.lastPlayer,
          winner,
          playerCount: data.playerCount || prev.playerCount,
          error: null
        }));
      }
    };

    pollInterval = window.setInterval(pollGameState, 2000);
    pollGameState(); // Initial fetch

    return () => {
      mounted = false;
      clearInterval(pollInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-2">
          <Circle className="text-yellow-400" />
          Connect Four Online
        </h1>

        {gameState.error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4 text-center">
            {gameState.error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          <PlayerSelector
            selectedPlayer={selectedPlayer}
            onSelectPlayer={setSelectedPlayer}
            playerCount={playerCount}
            onPlayerCountChange={handlePlayerCountChange}
            disabled={gameState.isLoading}
            currentTurn={gameState.currentTurn}
          />
          
          <div className="space-y-4">
            <GameBoard
              gameState={gameState}
              selectedPlayer={selectedPlayer}
              onCellClick={handleCellClick}
            />

            {gameState.winner && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">
                  {gameState.winner} wins!
                </h2>
                <button
                  onClick={handleReset}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
                  disabled={gameState.isLoading}
                >
                  Play Again
                </button>
              </div>
            )}

            {gameState.isLoading && (
              <div className="text-center text-lg font-semibold">
                Waiting for other players...
              </div>
            )}

            {gameState.currentTurn && !gameState.winner && (
              <div className="text-center text-lg font-semibold">
                Current turn: <span className={`text-${gameState.currentTurn}-500`}>{gameState.currentTurn}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;