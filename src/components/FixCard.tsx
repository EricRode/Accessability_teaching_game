import { FixCard as FixCardType, SimulationType, simulationFixMap } from '@/store/useGameStore';

interface FixCardProps {
  card: FixCardType;
  onPlay: () => void;
  isApplied: boolean;
  currentSimulation: SimulationType;
}

export const FixCard = ({ card, onPlay, isApplied, currentSimulation }: FixCardProps) => {
  // Check if this fix card is the correct one for the current simulation
  const isCorrectFix = currentSimulation !== 'none' && simulationFixMap[currentSimulation] === card.id;
  
  return (
    <div className={`p-4 border rounded-xl shadow-sm w-full transition-colors ${
      isApplied 
        ? 'bg-green-50 border-green-200' 
        : isCorrectFix
          ? 'bg-yellow-50 border-yellow-200 animate-pulse'
          : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl" role="img" aria-label={`Icon for ${card.title}`}>
          {card.icon}
        </span>
        <h3 className="text-md font-bold">{card.title}</h3>
        {isApplied && (
          <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
            Applied
          </span>
        )}
        {!isApplied && isCorrectFix && (
          <span className="ml-auto text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
            Recommended
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-3">{card.description}</p>
      <button 
        onClick={onPlay}
        className={`w-full px-3 py-1.5 font-medium rounded-lg text-sm transition-colors ${
          isApplied 
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : isCorrectFix
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
        aria-label={`Play ${card.title} fix card`}
        disabled={isApplied}
      >
        {isApplied ? 'Already Applied' : 'Play Fix Card'}
      </button>
    </div>
  );
};