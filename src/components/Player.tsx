import React from "react";

export interface IPlayers {
  name: string;
  isGuessing?: boolean;
  isSelecting?: boolean;
  guessed?: boolean;
  selected?: boolean;
  score: number;
}

export interface PlayersListProps {
  players: IPlayers[];
}

const PlayersList: React.FC<PlayersListProps> = ({ players }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Players</h2>
      <ul className="space-y-2">
        {players.map((player, index) => (
          <li
            key={index}
            className="p-3 bg-white shadow-md rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-medium">{player.name}</p>
              <p className="text-gray-600">Score: {player.score}</p>
              {player.isGuessing && <p className="text-blue-500">Guessing...</p>}
              {player.isSelecting && <p className="text-green-500">Selecting...</p>}
              {player.selected && <p className="text-purple-500">Selected</p>}
              {player.guessed && <p className="text-orange-500">Guessed</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayersList;
