import { Task, FixCard as FixCardType } from '@/store/useGameStore';
import { useState } from 'react';

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
  const [showAllTakeaways, setShowAllTakeaways] = useState(false);
  
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

  // Key takeaways about accessibility principles
  const keyAccessibilityTakeaways = [
    {
      title: "Accessibility is Multi-Dimensional",
      description: "Disabilities vary widely — visual, cognitive, motor, auditory — and each affects how users interact with UI differently. Designing for accessibility means understanding diverse needs."
    },
    {
      title: "Simulating Disabilities Builds Empathy",
      description: "Experiencing tasks under simulated disabilities helps designers and developers truly feel the challenges users face."
    },
    {
      title: "Bad Design Exacerbates Barriers",
      description: "Poor contrast, missing labels, tiny fonts, and cluttered layouts make tasks difficult or impossible for many users."
    },
    {
      title: "Targeted Solutions Improve Usability",
      description: "Applying the right fix — like adding labels or increasing font size — can dramatically improve the experience for users with specific needs."
    },
    {
      title: "One Size Does Not Fit All",
      description: "Fixes must be tailored to the disability type; a high-contrast mode may help low vision but won't solve screen reader issues."
    },
    {
      title: "Interactive Learning is Effective",
      description: "Making users actively engage with tasks and fixes reinforces accessibility principles far better than passive reading."
    },
    {
      title: "Accessibility Improves Everyone's Experience",
      description: "Features like clear labels, good contrast, and keyboard navigation benefit all users, not just those with disabilities."
    },
    {
      title: "Test Accessibility Early",
      description: "Accessibility should be integrated from the start — retrofitting fixes after development is harder and less effective."
    },
  ];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
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
          <h3 className="font-semibold mb-2">Your Performance</h3>
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
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Key Accessibility Takeaways</h3>
            <button 
              onClick={() => setShowAllTakeaways(!showAllTakeaways)}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {showAllTakeaways ? "Show Less" : "Show All"}
            </button>
          </div>
          
          <div className={`space-y-3 ${showAllTakeaways ? "" : "max-h-[200px] overflow-hidden relative"}`}>
            {keyAccessibilityTakeaways.map((takeaway, index) => (
              <div key={index} className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-800">{takeaway.title}</h4>
                <p className="text-sm text-gray-700 mt-1">{takeaway.description}</p>
              </div>
            ))}
            
            {!showAllTakeaways && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            📄 Print Summary
          </button>
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