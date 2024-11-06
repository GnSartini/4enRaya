import React from 'react';
import { Player, PlayerCount } from '../types';

interface PlayerSelectorProps {
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player) => void;
  playerCount: PlayerCount;
  onPlayerCountChange: (count: PlayerCount) => void;
  disabled: boolean;
  currentTurn: string | null;
}

const PLAYERS: Player[] = [
  { color: 'yellow', name: 'Yellow' },
  { color: 'red', name: 'Red' },
  { color: 'green', name: 'Green' },
  { color: 'blue', name: 'Blue' },
];

const PlayerSelector: React.FC<PlayerSelectorProps> = ({
  selectedPlayer,
  onSelectPlayer,
  playerCount,
  onPlayerCountChange,
  disabled,
  currentTurn,
}) => {
  const availablePlayers = PLAYERS.slice(0, playerCount);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl space-y-6">
      {!selectedPlayer && (
        <div className="space-y-2">
          <h2 className="text-xl font-bold mb-4">Number of Players</h2>
          <div className="grid grid-cols-3 gap-2">
            {[2, 3, 4].map((count) => (
              <button
                key={count}
                onClick={() => onPlayerCountChange(count as PlayerCount)}
                className={`p-2 rounded-lg transition-colors ${
                  playerCount === count
                    ? 'bg-purple-500 text-white'
                    : 'bg-purple-200 hover:bg-purple-300 text-gray-900'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-xl font-bold mb-4">Choose Your Color</h2>
        <div className="space-y-2">
          {availablePlayers.map((player) => {
            const isCurrentTurn = currentTurn === player.color;
            const isSelected = selectedPlayer?.color === player.color;
            
            return (
              <button
                key={player.color}
                onClick={() => onSelectPlayer(player)}
                disabled={disabled || (selectedPlayer && !isSelected)}
                className={`w-full p-4 rounded-lg flex items-center justify-between transition-colors ${
                  isSelected
                    ? `bg-${player.color}-500 text-white`
                    : `bg-${player.color}-200 hover:bg-${player.color}-300 text-gray-900`
                } ${
                  isCurrentTurn ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''
                } ${
                  (disabled || (selectedPlayer && !isSelected)) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="font-semibold">
                  {player.name}
                  {isCurrentTurn && " (Current Turn)"}
                </span>
                <div className={`w-6 h-6 rounded-full bg-${player.color}-500`} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerSelector;