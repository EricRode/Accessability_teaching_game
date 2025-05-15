import { useState } from 'react';
import { SimulationType } from '@/store/useGameStore';

interface TaskSimulatorProps {
  taskId: string;
  simulation: SimulationType;
  onComplete: () => void;
  startOpen?: boolean;
  appliedFixes: SimulationType[];
  isSimulationFixed: boolean; // New prop to track if the current simulation has been fixed
}

export const TaskSimulator = ({ 
  taskId, 
  simulation, 
  onComplete,
  startOpen = false,
  appliedFixes = [],
  isSimulationFixed = false
}: TaskSimulatorProps) => {
  const [showSimulator, setShowSimulator] = useState(startOpen);

  // Check if we have applied fixes relevant to this task
  const hasColorBlindFix = appliedFixes.includes('color-blind') || isSimulationFixed && simulation === 'color-blind';
  const hasBlurredVisionFix = appliedFixes.includes('blurred-vision') || isSimulationFixed && simulation === 'blurred-vision';
  const hasLowContrastFix = appliedFixes.includes('low-contrast') || isSimulationFixed && simulation === 'low-contrast';
  const hasHighContrastFix = appliedFixes.includes('high-contrast') || isSimulationFixed && simulation === 'high-contrast';
  const hasZoomedUIFix = appliedFixes.includes('zoomed-ui') || isSimulationFixed && simulation === 'zoomed-ui';
  const hasScreenReaderFix = appliedFixes.includes('screen-reader') || isSimulationFixed && simulation === 'screen-reader';
  const hasCognitiveOverloadFix = appliedFixes.includes('cognitive-overload') || isSimulationFixed && simulation === 'cognitive-overload';

  if (!showSimulator) {
    return (
      <button
        onClick={() => setShowSimulator(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Try This Task
      </button>
    );
  }

  // Return different task simulators based on taskId
  switch (taskId) {
    case 'color-buttons':
      return <ColorButtonTask 
        simulation={simulation} 
        onComplete={onComplete} 
        hasColorBlindFix={hasColorBlindFix}
      />;
    case 'small-text':
      return <SmallTextTask 
        simulation={simulation} 
        onComplete={onComplete} 
        hasBlurredVisionFix={hasBlurredVisionFix}
      />;
    case 'low-contrast':
      return <LowContrastTask 
        simulation={simulation} 
        onComplete={onComplete} 
        hasLowContrastFix={hasLowContrastFix}
        hasHighContrastFix={hasHighContrastFix}
      />;
    case 'complex-form':
      return <ComplexFormTask 
        simulation={simulation} 
        onComplete={onComplete} 
        hasCognitiveOverloadFix={hasCognitiveOverloadFix}
        hasScreenReaderFix={hasScreenReaderFix}
      />;
    case 'image-selection':
      return <ImageSelectionTask 
        simulation={simulation} 
        onComplete={onComplete} 
        hasScreenReaderFix={hasScreenReaderFix}
        hasBlurredVisionFix={hasBlurredVisionFix}
      />;
    case 'dropdown-menu':
      return <DropdownMenuTask 
        simulation={simulation} 
        onComplete={onComplete} 
        hasLowContrastFix={hasLowContrastFix}
        hasZoomedUIFix={hasZoomedUIFix}
        hasCognitiveOverloadFix={hasCognitiveOverloadFix}
      />;
    case 'error-message':
      return <ErrorMessageTask 
        simulation={simulation} 
        onComplete={onComplete} 
        hasColorBlindFix={hasColorBlindFix}
        hasScreenReaderFix={hasScreenReaderFix}
      />;
    default:
      return (
        <div className="p-6 bg-gray-100 rounded-lg text-center">
          <p>This task is simulated. Click below to complete it.</p>
          <button
            onClick={onComplete}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Complete Simulation
          </button>
        </div>
      );
  }
};

// Color button task simulator with fix
const ColorButtonTask = ({ 
  simulation, 
  onComplete,
  hasColorBlindFix
}: { 
  simulation: SimulationType, 
  onComplete: () => void,
  hasColorBlindFix: boolean
}) => {
  const [error, setError] = useState('');
  
  const handleButtonClick = (isCorrect: boolean) => {
    if (isCorrect) {
      onComplete();
    } else {
      setError('That was not the green button. Try again.');
      setTimeout(() => setError(''), 2000);
    }
  };
  
  // Show text labels if colorblind fix is applied
  const showLabels = hasColorBlindFix || simulation !== 'color-blind';
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm w-full max-w-md">
      <h3 className="font-bold mb-4">Click the green button</h3>
      
      {hasColorBlindFix && simulation === 'color-blind' && (
        <div className="mb-4 text-green-600 bg-green-50 p-2 rounded border border-green-200">
          <strong>✓ Accessibility Fix Applied:</strong> Text labels have been added to the buttons to help with color identification.
        </div>
      )}
      
      {error && (
        <div className="mb-4 text-red-500">{error}</div>
      )}
      
      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={() => handleButtonClick(false)}
          className="h-16 rounded-lg bg-red-500 relative"
          aria-label={showLabels ? 'Red button' : undefined}
        >
          {showLabels && (
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
              Red
            </span>
          )}
        </button>
        <button 
          onClick={() => handleButtonClick(true)}
          className="h-16 rounded-lg bg-green-500 relative"
          aria-label={showLabels ? 'Green button' : undefined}
        >
          {showLabels && (
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
              Green
            </span>
          )}
        </button>
        <button 
          onClick={() => handleButtonClick(false)}
          className="h-16 rounded-lg bg-blue-500 relative"
          aria-label={showLabels ? 'Blue button' : undefined}
        >
          {showLabels && (
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
              Blue
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

// Small text task simulator - Challenge: read tiny text
const SmallTextTask = ({ simulation, onComplete }: { simulation: SimulationType, onComplete: () => void }) => {
  const [answered, setAnswered] = useState(false);
  const answer = "accessibility matters";
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userAnswer = formData.get('answer') as string;
    
    if (userAnswer.toLowerCase().includes('accessibility')) {
      setAnswered(true);
      setTimeout(onComplete, 1000);
    } else {
      // Show error
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm w-full max-w-md">
      <h3 className="font-bold mb-4">Read the text at the bottom and type what it says</h3>
      
      {answered ? (
        <div className="text-green-600">Well done! You've read the tiny text.</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="my-8 h-32 flex items-end">
            <p className="text-[6px] text-gray-500" aria-label={simulation === 'screen-reader' ? answer : undefined}>
              {answer}
            </p>
          </div>
          <input 
            type="text" 
            name="answer"
            placeholder="Type what the text says..."
            className="w-full border px-3 py-2 rounded"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

// Low contrast task - Challenge: find a low contrast menu item
const LowContrastTask = ({ simulation, onComplete }: { simulation: SimulationType, onComplete: () => void }) => {
  const [found, setFound] = useState(false);
  
  const handleClick = (isCorrect: boolean) => {
    if (isCorrect) {
      setFound(true);
      setTimeout(onComplete, 1000);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm w-full max-w-md">
      <h3 className="font-bold mb-4">Find and click the "Settings" option</h3>
      
      {found ? (
        <div className="text-green-600">Found it! Good job spotting the low contrast text.</div>
      ) : (
        <div className="border rounded p-2">
          <div className="flex justify-between items-center p-2 hover:bg-gray-50 cursor-pointer">
            <span>Dashboard</span>
            <span>📊</span>
          </div>
          <div className="flex justify-between items-center p-2 hover:bg-gray-50 cursor-pointer">
            <span>Profile</span>
            <span>👤</span>
          </div>
          <div 
            className="flex justify-between items-center p-2 hover:bg-gray-50 cursor-pointer"
            onClick={() => handleClick(true)}
          >
            <span className="text-gray-300" aria-label={simulation === 'screen-reader' ? 'Settings' : undefined}>Settings</span>
            <span>⚙️</span>
          </div>
          <div className="flex justify-between items-center p-2 hover:bg-gray-50 cursor-pointer">
            <span>Help</span>
            <span>❓</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Complex form task - Challenge: complete a poorly labeled form
const ComplexFormTask = ({ simulation, onComplete }: { simulation: SimulationType, onComplete: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let hasErrors = false;
    const newErrors: Record<string, string> = {};
    
    // Check required fields
    ['name', 'email', 'agree'].forEach(field => {
      if (!formData.get(field)) {
        hasErrors = true;
        newErrors[field] = 'This field is required';
      }
    });
    
    if (hasErrors) {
      setErrors(newErrors);
    } else {
      setSubmitted(true);
      setTimeout(onComplete, 1000);
    }
  };
  
  // Use minimal labels or no labels at all to create accessibility barriers
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm w-full max-w-md">
      <h3 className="font-bold mb-4">Complete all required fields</h3>
      
      {submitted ? (
        <div className="text-green-600">Form submitted successfully!</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="text" 
              name="name" 
              placeholder="Enter name"
              className="w-full border rounded px-3 py-2"
              aria-label={simulation === 'screen-reader' ? 'Your full name, required' : undefined}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <input 
              type="email" 
              name="email" 
              placeholder="Enter email"
              className="w-full border rounded px-3 py-2"
              aria-label={simulation === 'screen-reader' ? 'Your email address, required' : undefined}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <select 
              name="category" 
              className="w-full border rounded px-3 py-2 bg-white"
              aria-label={simulation === 'screen-reader' ? 'Select category, optional' : undefined}
            >
              <option value="">Select category</option>
              <option value="1">Personal</option>
              <option value="2">Business</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="agree" 
              name="agree"
              className="mr-2"
            />
            <label htmlFor="agree" className={simulation === 'cognitive-overload' ? 'text-xs opacity-60' : ''}>
              I agree to the terms and conditions that are very long and complicated but you need to agree anyway...
            </label>
            {errors.agree && <p className="text-red-500 text-xs mt-1">{errors.agree}</p>}
          </div>
          
          <button 
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

// Image selection task - Challenge: identify images without alt text
const ImageSelectionTask = ({ simulation, onComplete }: { simulation: SimulationType, onComplete: () => void }) => {
  const [selected, setSelected] = useState<string | null>(null);
  
  const handleSelect = (animal: string) => {
    setSelected(animal);
    if (animal === 'dog') {
      setTimeout(onComplete, 1000);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm w-full max-w-md">
      <h3 className="font-bold mb-4">Select the image of a dog</h3>
      
      {selected === 'dog' ? (
        <div className="text-green-600">Correct! You found the dog.</div>
      ) : selected ? (
        <div className="text-red-500">That's not a dog. Try again.</div>
      ) : null}
      
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button 
          onClick={() => handleSelect('cat')} 
          className="h-24 bg-gray-200 rounded-lg flex items-center justify-center"
          aria-label={simulation === 'screen-reader' ? 'Image of a cat' : undefined}
        >
          🐱
        </button>
        <button 
          onClick={() => handleSelect('dog')} 
          className="h-24 bg-gray-200 rounded-lg flex items-center justify-center"
          aria-label={simulation === 'screen-reader' ? 'Image of a dog' : undefined}
        >
          🐕
        </button>
        <button 
          onClick={() => handleSelect('bird')} 
          className="h-24 bg-gray-200 rounded-lg flex items-center justify-center"
          aria-label={simulation === 'screen-reader' ? 'Image of a bird' : undefined}
        >
          🐦
        </button>
        <button 
          onClick={() => handleSelect('rabbit')} 
          className="h-24 bg-gray-200 rounded-lg flex items-center justify-center"
          aria-label={simulation === 'screen-reader' ? 'Image of a rabbit' : undefined}
        >
          🐰
        </button>
      </div>
    </div>
  );
};

// Dropdown menu task - Challenge: use a dropdown with poor contrast or keyboard accessibility
const DropdownMenuTask = ({ simulation, onComplete }: { simulation: SimulationType, onComplete: () => void }) => {
  const [selected, setSelected] = useState('');
  const [open, setOpen] = useState(false);
  
  const handleSelect = (value: string) => {
    setSelected(value);
    setOpen(false);
    if (value === 'premium') {
      setTimeout(onComplete, 1000);
    }
  };
  
  const options = [
    { value: 'free', label: 'Free Plan' },
    { value: 'basic', label: 'Basic Plan' },
    { value: 'premium', label: 'Premium Plan' },
    { value: 'enterprise', label: 'Enterprise Plan' }
  ];
  
  // Challenge: poor contrast or keyboard accessibility issues
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm w-full max-w-md">
      <h3 className="font-bold mb-4">Select the Premium Plan from the dropdown</h3>
      
      {selected === 'premium' ? (
        <div className="text-green-600">Great choice! Premium Plan selected.</div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex justify-between items-center px-4 py-2 bg-gray-50 border rounded"
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            {selected ? options.find(opt => opt.value === selected)?.label : 'Select a plan'} 
            <span>▼</span>
          </button>
          
          {open && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
              {options.map((option) => (
                <div 
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    simulation === 'low-contrast' && option.value === 'premium' 
                      ? 'text-gray-300' 
                      : ''
                  }`}
                  role="option"
                  aria-selected={selected === option.value}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Error message task - Challenge: identify errors that are only indicated by color
const ErrorMessageTask = ({ simulation, onComplete }: { simulation: SimulationType, onComplete: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const [errorFixed, setErrorFixed] = useState(false);
  
  const handleFix = () => {
    setErrorFixed(true);
    setTimeout(onComplete, 1000);
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm w-full max-w-md">
      <h3 className="font-bold mb-4">Identify and fix the error in your submission</h3>
      
      {errorFixed ? (
        <div className="text-green-600">Error fixed successfully!</div>
      ) : (
        <>
          <div className="border rounded p-4 mb-4">
            <p>Your form has been submitted with the following information:</p>
            <ul className="mt-2 space-y-1">
              <li>Name: John Doe</li>
              <li>Email: john@example</li>
              <li>Phone: (555) 123-4567</li>
            </ul>
            
            {/* Error indicated only by color - inaccessible for color blind users */}
            <div className="mt-4">
              <p className="text-red-500" aria-label={simulation === 'screen-reader' ? 'Error: Email address is invalid' : undefined}>
                Email address is invalid.
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleFix}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Fix Email Address
          </button>
        </>
      )}
    </div>
  );
};