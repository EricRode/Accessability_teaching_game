'use client';

import { useGameStore, simulationFixMap } from '@/store/useGameStore';
import { TaskCard } from '@/components/TaskCard';
import { TaskSimulator } from '@/components/TaskSimulator';
import { FixCard } from '@/components/FixCard';
import { SimulationControls } from '@/components/SimulationControls';
import { GameSummary } from '@/components/GameSummary';
import { Feedback } from '@/components/Feedback';
import { useState, useEffect } from 'react';

export default function Home() {
  const { 
    simulation, 
    setSimulation, 
    currentTask, 
    drawNewTask, 
    fixCards, 
    appliedFixCards,
    isFixCorrect,
    playFixCard,
    score,
    incrementScore,
    resetGame,
    roundCount,
    incrementRound,
    completedTasks,
    addCompletedTask,
    feedbackMessage,
    setFeedbackMessage
  } = useGameStore();
  
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showInteractiveTask, setShowInteractiveTask] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState<SimulationType>('none');
  
  // Store the recommended simulation without immediately applying it
  const [recommendedSimulation, setRecommendedSimulation] = useState<SimulationType>('none');
  
  // Check if we should show summary after every 5 rounds
  useEffect(() => {
    if (roundCount > 0 && roundCount % 5 === 0) {
      setShowSummary(true);
    }
  }, [roundCount]);
  
  // Set the recommended simulation when a new task is drawn, but don't apply it yet
  useEffect(() => {
    if (currentTask && currentTask.affectedBy && currentTask.affectedBy.length > 0) {
      // Pick a random simulation from the ones that affect this task
      const relevantSimulations = currentTask.affectedBy;
      const randomSimulation = relevantSimulations[Math.floor(Math.random() * relevantSimulations.length)];
      
      // Store this as the recommended simulation
      setRecommendedSimulation(randomSimulation);
    }
  }, [currentTask]);
  
  // Handle direct task simulation without needing a second click
  const handleStartTask = () => {
    // Apply the recommended simulation when the task starts
    if (recommendedSimulation !== 'none') {
      setSimulation(recommendedSimulation);
      setActiveSimulation(recommendedSimulation);
      
      setFeedbackMessage(`This task is challenging for users with ${
        recommendedSimulation === 'color-blind' ? 'color blindness' :
        recommendedSimulation === 'blurred-vision' ? 'blurred vision' :
        recommendedSimulation === 'high-contrast' ? 'high contrast needs' :
        recommendedSimulation === 'low-contrast' ? 'low contrast vision' :
        recommendedSimulation === 'zoomed-ui' ? 'zoomed interface' :
        recommendedSimulation === 'screen-reader' ? 'screen reader mode' :
        'cognitive processing difficulties'
      }. Find the right fix to make it accessible!`);
    }
    
    setShowInteractiveTask(true);
  };
  
  const handleTaskCompletion = () => {
    incrementScore();
    addCompletedTask(currentTask);
    incrementRound();
    setTaskCompleted(true);
    setShowInteractiveTask(false);
    // Reset active simulation when task is completed
    setActiveSimulation('none');
    setSimulation('none');
    setTimeout(() => {
      drawNewTask(); // This will trigger the useEffect to choose a new recommended simulation
      setTaskCompleted(false);
    }, 1500);
  };
  
  // Manual simulation change handler
  const handleSimulationChange = (sim: SimulationType) => {
    setSimulation(sim);
    setActiveSimulation(sim);
  };
  
  // Find the correct fix card for the current simulation
  const correctFixId = activeSimulation !== 'none' ? simulationFixMap[activeSimulation] : null;
  const correctFixCard = correctFixId ? fixCards.find(card => card.id === correctFixId) : null;
  const correctFixApplied = Boolean(correctFixCard && appliedFixCards.includes(correctFixCard.fixesSimulation));

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center gap-6 p-6 
      ${activeSimulation === 'color-blind' ? 'color-blind' : ''}
      ${activeSimulation === 'blurred-vision' ? 'blurred-vision' : ''}
      ${activeSimulation === 'high-contrast' ? 'high-contrast' : ''}
      ${activeSimulation === 'low-contrast' ? 'low-contrast' : ''}
      ${activeSimulation === 'zoomed-ui' ? 'zoomed-ui' : ''}
      ${activeSimulation === 'screen-reader' ? 'screen-reader' : ''}
      ${activeSimulation === 'cognitive-overload' ? 'cognitive-overload' : ''}
      
      ${appliedFixCards.includes('color-blind') ? 'fix-color-blind' : ''}
      ${appliedFixCards.includes('blurred-vision') ? 'fix-blurred-vision' : ''}
      ${appliedFixCards.includes('high-contrast') ? 'fix-high-contrast' : ''}
      ${appliedFixCards.includes('low-contrast') ? 'fix-low-contrast' : ''}
      ${appliedFixCards.includes('zoomed-ui') ? 'fix-zoomed-ui' : ''}
      ${appliedFixCards.includes('screen-reader') ? 'fix-screen-reader' : ''}
      ${appliedFixCards.includes('cognitive-overload') ? 'fix-cognitive-overload' : ''}
    `}>
      <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md z-10">
        <div className="font-bold">Score: {score}</div>
        <div className="text-sm text-gray-500">Round: {roundCount}</div>
      </div>
      
      <h1 className="text-3xl font-bold mb-2">🃏 Accessibility Challenge</h1>
      <p className="text-md text-center max-w-md mb-6">
        Experience digital barriers and find solutions to improve accessibility
      </p>
      
      <div className="w-full max-w-md mb-2">
        <TaskCard task={currentTask} completed={taskCompleted} />
      </div>
      
      {showInteractiveTask ? (
        <div className="mb-4">
          <TaskSimulator 
            taskId={currentTask.id} 
            simulation={activeSimulation} 
            onComplete={handleTaskCompletion} 
            startOpen={true}
            appliedFixes={appliedFixCards}
            isSimulationFixed={correctFixApplied}
          />
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 mb-4 justify-center">
          <button
            onClick={handleStartTask}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            aria-label="Try the interactive task"
          >
            🎮 Try This Task
          </button>
          
          <button
            onClick={handleTaskCompletion}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            aria-label="Mark current task as completed"
          >
            ✅ Complete Task
          </button>
          
          <button
            onClick={() => {
              drawNewTask();
              incrementRound();
              setShowInteractiveTask(false);
              setActiveSimulation('none'); // Reset simulation on new task
              setSimulation('none');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Draw a new task"
          >
            🎲 New Task
          </button>
        </div>
      )}
      
      <div className="w-full max-w-4xl">
        <SimulationControls 
          currentSimulation={activeSimulation}
          onSelectSimulation={handleSimulationChange}
          recommendedSimulations={[recommendedSimulation]}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-4">
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-3">Available Fix Cards</h2>
          <div className="grid grid-cols-1 gap-3">
            {fixCards.map((card) => (
              <FixCard 
                key={card.id} 
                card={card} 
                onPlay={() => playFixCard(card.id)}
                isApplied={appliedFixCards.includes(card.fixesSimulation)}
                currentSimulation={activeSimulation}
              />
            ))}
          </div>
        </div>
        
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-3">Game Status</h2>
          
          {appliedFixCards.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Applied Fixes:</h3>
              <div className="flex flex-wrap gap-2">
                {fixCards.filter(card => appliedFixCards.includes(card.fixesSimulation)).map((card) => (
                  <div 
                    key={card.id}
                    className={`px-3 py-1.5 border rounded-lg text-sm flex items-center gap-1 ${
                      simulation !== 'none' && card.id === simulationFixMap[simulation]
                        ? 'bg-green-100 border-green-200 font-medium'
                        : 'bg-gray-100 border-gray-200'
                    }`}
                  >
                    <span>{card.icon}</span> {card.title}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h3 className="font-medium mb-2">Active Challenges:</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {simulation !== 'none' ? (
                <li>
                  Currently experiencing <strong>{
                    simulation === 'color-blind' ? 'color blindness' :
                    simulation === 'blurred-vision' ? 'blurred vision' :
                    simulation === 'high-contrast' ? 'high contrast needs' :
                    simulation === 'low-contrast' ? 'low contrast vision' :
                    simulation === 'zoomed-ui' ? 'zoomed interface' :
                    simulation === 'screen-reader' ? 'screen reader mode' :
                    'cognitive overload'
                  }</strong>
                </li>
              ) : (
                <li>No accessibility simulation active</li>
              )}
              
              {simulation !== 'none' && !correctFixApplied && (
                <li className="text-red-600">
                  This barrier needs to be fixed with the correct accessibility solution
                </li>
              )}
              
              {simulation !== 'none' && correctFixApplied && (
                <li className="text-green-600">
                  Great job! You've applied the correct fix for this simulation
                </li>
              )}
              
              {currentTask.affectedBy.length > 0 && (
                <li>
                  <strong>Task affected by: </strong>
                  {currentTask.affectedBy.map((barrier, i) => (
                    <span key={barrier} className="inline-block">
                      {i > 0 ? ', ' : ''}
                      {barrier === 'color-blind' ? 'color perception' :
                       barrier === 'blurred-vision' ? 'visual clarity' :
                       barrier === 'high-contrast' ? 'contrast sensitivity' :
                       barrier === 'low-contrast' ? 'contrast detection' :
                       barrier === 'zoomed-ui' ? 'screen magnification' :
                       barrier === 'screen-reader' ? 'screen reader compatibility' :
                       'cognitive processing'}
                    </span>
                  ))}
                </li>
              )}
            </ul>
            
            <button
              onClick={() => setShowSummary(true)}
              className="mt-4 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200 transition-colors w-full"
            >
              View Game Summary
            </button>
          </div>
        </div>
      </div>
      
      <button
        onClick={resetGame}
        className="mt-8 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        aria-label="Reset the game"
      >
        🔄 Reset Game
      </button>
      
      {showSummary && (
        <GameSummary 
          score={score}
          completedTasks={completedTasks}
          appliedFixes={fixCards.filter(card => appliedFixCards.includes(card.fixesSimulation))}
          onClose={() => setShowSummary(false)}
        />
      )}
      
      <Feedback 
        message={feedbackMessage} 
        onDismiss={() => setFeedbackMessage(null)} 
      />
    </main>
  );
}
