import { SimulationType } from '@/store/useGameStore';

interface SimulationControlsProps {
  currentSimulation: SimulationType;
  onSelectSimulation: (sim: SimulationType) => void;
  recommendedSimulations?: SimulationType[]; // Add this prop
}

export const SimulationControls = ({ 
  currentSimulation, 
  onSelectSimulation,
  recommendedSimulations = [] 
}: SimulationControlsProps) => {
  const simulationOptions: {id: SimulationType; label: string; icon: string}[] = [
    { id: 'none', label: 'No Simulation', icon: '✓' },
    { id: 'color-blind', label: 'Color Blindness', icon: '🎨' },
    { id: 'blurred-vision', label: 'Blurred Vision', icon: '👓' },
    { id: 'high-contrast', label: 'High Contrast Needs', icon: '◐' },
    { id: 'low-contrast', label: 'Low Contrast', icon: '🔆' },
    { id: 'zoomed-ui', label: 'Zoomed Interface', icon: '🔍' },
    { id: 'screen-reader', label: 'Screen Reader', icon: '🔊' },
    { id: 'cognitive-overload', label: 'Cognitive Overload', icon: '🧠' },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-3">Accessibility Simulations</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {simulationOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelectSimulation(option.id)}
            className={`p-3 rounded-lg text-center transition-colors ${
              currentSimulation === option.id
                ? 'bg-purple-600 text-white'
                : recommendedSimulations.includes(option.id)
                  ? 'bg-yellow-100 border border-yellow-400 hover:bg-yellow-200'
                  : 'bg-gray-100 hover:bg-gray-200'
            }`}
            aria-pressed={currentSimulation === option.id}
            aria-label={`Enable ${option.label} simulation`}
          >
            <div className="text-2xl mb-1">{option.icon}</div>
            <div className="text-sm font-medium">
              {option.label}
              {recommendedSimulations.includes(option.id) && option.id !== 'none' && (
                <span className="block text-xs mt-1 text-yellow-700">Recommended</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};