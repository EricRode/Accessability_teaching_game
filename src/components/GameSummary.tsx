import { Task, FixCard as FixCardType } from '@/store/useGameStore';

interface GameSummaryProps {
  score: number;
  completedTasks: Task[];
  appliedFixes: FixCardType[];
  onClose: () => void;
}

export const GameSummary = ({ 
  score, 
  completedTasks, 
  appliedFixes,
  onClose 
}: GameSummaryProps) => {
  
  const tasksByDifficulty = {
    easy: completedTasks.filter(t => t.difficulty === 'easy').length,
    medium: completedTasks.filter(t => t.difficulty === 'medium').length,
    hard: completedTasks.filter(t => t.difficulty === 'hard').length,
  };
  
  const totalBarriers = completedTasks.reduce((count, task) => {
    return count + task.affectedBy.length;
  }, 0);
  
  const barriersAddressed = appliedFixes.length;
  
  const accessibilityScore = Math.round((barriersAddressed / Math.max(totalBarriers, 1)) * 100);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Game Summary</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-indigo-700">Total Score</p>
            <p className="text-3xl font-bold">{score}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700">Accessibility Score</p>
            <p className="text-3xl font-bold">{accessibilityScore}%</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Tasks Completed</h3>
          <div className="flex gap-2">
            <div className="bg-green-100 px-3 py-1 rounded text-sm">
              Easy: {tasksByDifficulty.easy}
            </div>
            <div className="bg-yellow-100 px-3 py-1 rounded text-sm">
              Medium: {tasksByDifficulty.medium}
            </div>
            <div className="bg-red-100 px-3 py-1 rounded text-sm">
              Hard: {tasksByDifficulty.hard}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Accessibility Fixes Applied</h3>
          <div className="flex flex-wrap gap-2">
            {appliedFixes.map(fix => (
              <div key={fix.id} className="bg-yellow-50 border border-yellow-200 px-3 py-1 rounded text-sm">
                {fix.icon} {fix.title}
              </div>
            ))}
            {appliedFixes.length === 0 && (
              <p className="text-sm text-gray-500">No fixes applied yet.</p>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Key Takeaways</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Accessibility barriers affected {totalBarriers} aspects of your tasks.</li>
            <li>You addressed {barriersAddressed} of these barriers with fix cards.</li>
            <li>
              {accessibilityScore >= 75 ? 'Great job making your experience accessible!' : 
               accessibilityScore >= 50 ? 'You\'re on the right track to accessibility!' :
               'Consider using more accessibility fixes in future rounds.'}
            </li>
          </ul>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Continue Playing
          </button>
        </div>
      </div>
    </div>
  );
};