import { create } from 'zustand';

export type SimulationType = 
  'none' | 
  'color-blind' | 
  'blurred-vision' | 
  'high-contrast' | 
  'low-contrast' |
  'zoomed-ui' |
  'screen-reader' |
  'cognitive-overload';

export interface Task {
  id: string;
  text: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  affectedBy: SimulationType[];
}

interface GameState {
  simulation: SimulationType;
  setSimulation: (mode: SimulationType) => void;
  currentTask: Task;
  drawNewTask: () => void;
  fixCards: FixCard[];
  appliedFixCards: SimulationType[]; // Track applied fixes by simulation type
  isFixCorrect: boolean; // New property to track if the fix was correct
  playFixCard: (id: string) => void;
  score: number;
  incrementScore: () => void;
  resetGame: () => void;
  roundCount: number;
  incrementRound: () => void;
  completedTasks: Task[];
  addCompletedTask: (task: Task) => void;
  feedbackMessage: string | null;
  setFeedbackMessage: (message: string | null) => void;
}

export interface FixCard {
  id: string;
  title: string;
  description: string;
  fixesSimulation: SimulationType;
  icon: string;
}

// Map from simulation type to the correct fix card ID
export const simulationFixMap: Record<SimulationType, string> = {
  'none': '',
  'color-blind': 'labels', // Add text labels for color blind users
  'blurred-vision': 'font-size', // Increase font size for blurry vision
  'high-contrast': 'high-contrast', // Add high contrast mode
  'low-contrast': 'contrast', // Increase contrast
  'zoomed-ui': 'keyboard-nav', // Keyboard navigation for zoomed interfaces
  'screen-reader': 'screen-reader', // Screen reader support
  'cognitive-overload': 'simplify', // Simplify interface
};

const tasks: Task[] = [
  {
    id: 'color-buttons',
    text: 'Click on the green button to continue',
    description: 'This task is difficult for users with color blindness who can\'t distinguish between colors.',
    difficulty: 'medium',
    affectedBy: ['color-blind']
  },
  {
    id: 'small-text',
    text: 'Read the fine print at the bottom of the page',
    description: 'This task is difficult for users with vision impairments who need larger text.',
    difficulty: 'hard',
    affectedBy: ['blurred-vision', 'zoomed-ui']
  },
  {
    id: 'low-contrast',
    text: 'Find the "Settings" option in the menu',
    description: 'This task is difficult when text has poor contrast against its background.',
    difficulty: 'medium',
    affectedBy: ['low-contrast', 'high-contrast']
  },
  {
    id: 'complex-form',
    text: 'Complete the form with all required fields',
    description: 'This task is difficult for users with cognitive disabilities or screen readers without proper labels.',
    difficulty: 'hard',
    affectedBy: ['cognitive-overload', 'screen-reader']
  },
  {
    id: 'image-selection',
    text: 'Select the image of a dog from the gallery',
    description: 'This task is difficult for screen reader users when images lack alt text.',
    difficulty: 'easy',
    affectedBy: ['screen-reader', 'blurred-vision']
  },
  {
    id: 'dropdown-menu',
    text: 'Select "Premium Plan" from the pricing dropdown',
    description: 'This task is difficult when dropdowns are not keyboard accessible or visually distinct.',
    difficulty: 'medium',
    affectedBy: ['zoomed-ui', 'cognitive-overload', 'low-contrast']
  },
  {
    id: 'error-message',
    text: 'Identify and fix the error in your submission',
    description: 'This task is difficult when error messages rely only on color or are not clearly associated with form fields.',
    difficulty: 'hard',
    affectedBy: ['color-blind', 'screen-reader']
  },
];

const initialFixCards: FixCard[] = [
  {
    id: 'labels',
    title: 'Add Text Labels',
    description: 'Add descriptive text labels to all interactive elements',
    fixesSimulation: 'color-blind',
    icon: '🏷️'
  },
  {
    id: 'contrast',
    title: 'Increase Contrast',
    description: 'Enhance color contrast for better visibility',
    fixesSimulation: 'low-contrast',
    icon: '🔆'
  },
  {
    id: 'screen-reader',
    title: 'Screen Reader Support',
    description: 'Add ARIA attributes and alt text for screen readers',
    fixesSimulation: 'screen-reader',
    icon: '🔊'
  },
  {
    id: 'keyboard-nav',
    title: 'Keyboard Navigation',
    description: 'Make all features accessible via keyboard',
    fixesSimulation: 'zoomed-ui',
    icon: '⌨️'
  },
  {
    id: 'simplify',
    title: 'Simplify Interface',
    description: 'Remove distractions and clarify instructions',
    fixesSimulation: 'cognitive-overload',
    icon: '📝'
  },
  {
    id: 'font-size',
    title: 'Increase Font Size',
    description: 'Make text larger and more readable',
    fixesSimulation: 'blurred-vision',
    icon: '🔍'
  },
  {
    id: 'high-contrast',
    title: 'High Contrast Mode',
    description: 'Add a high contrast theme for visibility',
    fixesSimulation: 'high-contrast',
    icon: '◐'
  },
];

export const useGameStore = create<GameState>((set) => ({
  simulation: 'none',
  setSimulation: (mode) => set((state) => ({ 
    simulation: mode,
    // Reset applied fixes when simulation changes
    appliedFixCards: [],
    isFixCorrect: false,
    feedbackMessage: mode !== 'none' ? 
      `Simulation changed to ${mode}. Select the appropriate fix card to solve this accessibility barrier.` : 
      'No accessibility simulation active.'
  })),
  currentTask: tasks[0],
  drawNewTask: () =>
    set((state) => ({
      currentTask: tasks[Math.floor(Math.random() * tasks.length)],
      // Reset applied fixes when task changes
      appliedFixCards: [],
      isFixCorrect: false,
      feedbackMessage: 'New task selected. Apply accessibility fixes if needed.'
    })),
  fixCards: initialFixCards,
  appliedFixCards: [],
  isFixCorrect: false,
  playFixCard: (id) => 
    set((state) => {
      const card = state.fixCards.find(card => card.id === id);
      if (!card) return state;
      
      let feedbackMessage = null;
      let isFixCorrect = false;
      
      // Check if the fix card is the correct one for the current simulation
      const correctFixId = simulationFixMap[state.simulation];
      isFixCorrect = correctFixId === card.id;
      
      // Check if the fix has already been applied
      const alreadyApplied = state.appliedFixCards.includes(card.fixesSimulation);
      
      if (alreadyApplied) {
        feedbackMessage = `This fix has already been applied to your interface.`;
        return { feedbackMessage };
      }
      
      if (isFixCorrect) {
        feedbackMessage = `Great! The ${card.title} fix correctly addresses ${state.simulation === 'none' ? 'the current task' : `the ${state.simulation} simulation`}. The interface is now more accessible!`;
        
        return {
          // Add to applied fixes - use the simulation type it fixes
          appliedFixCards: [...state.appliedFixCards, card.fixesSimulation],
          // Set fix as correct
          isFixCorrect: true,
          // Don't disable the simulation when fix is applied 
          // (we want to show both the simulation and fix applied)
          feedbackMessage
        };
      } else {
        // Fix was incorrect for the current simulation
        feedbackMessage = `This fix helps with ${card.fixesSimulation} barriers, but doesn't address the current ${state.simulation || 'task'}.`;
        
        return {
          // Still apply the fix even if not perfect for current simulation
          appliedFixCards: [...state.appliedFixCards, card.fixesSimulation],
          feedbackMessage,
          isFixCorrect: false
        };
      }
    }),
  score: 0,
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  roundCount: 0,
  incrementRound: () => set((state) => ({ 
    roundCount: state.roundCount + 1,
    // Don't reset fixes here, as incrementRound is called separately from drawNewTask
  })),
  completedTasks: [],
  addCompletedTask: (task) => set((state) => ({ 
    completedTasks: [...state.completedTasks, task] 
  })),
  feedbackMessage: null,
  setFeedbackMessage: (message) => set({ feedbackMessage: message }),
  resetGame: () => set({
    simulation: 'none',
    appliedFixCards: [],
    isFixCorrect: false,
    score: 0,
    roundCount: 0,
    completedTasks: [],
    currentTask: tasks[0],
    feedbackMessage: null
  }),
}));
