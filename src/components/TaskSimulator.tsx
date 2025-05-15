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
// Update the SmallTextTask component to accept the hasBlurredVisionFix prop
const SmallTextTask = ({ 
  simulation, 
  onComplete,
  hasBlurredVisionFix
}: { 
  simulation: SimulationType, 
  onComplete: () => void,
  hasBlurredVisionFix: boolean 
}) => {
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
      
      {hasBlurredVisionFix && simulation === 'blurred-vision' && (
        <div className="mb-4 text-green-600 bg-green-50 p-2 rounded border border-green-200">
          <strong>✓ Accessibility Fix Applied:</strong> Font size has been increased for better readability.
        </div>
      )}
      
      {answered ? (
        <div className="text-green-600">Well done! You've read the tiny text.</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="my-8 h-32 flex items-end">
            <p className={`${hasBlurredVisionFix ? 'text-[12px]' : 'text-[6px]'} text-gray-500`} 
               aria-label={simulation === 'screen-reader' ? answer : undefined}>
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
const LowContrastTask = ({ 
  simulation, 
  onComplete,
  hasLowContrastFix,
  hasHighContrastFix
}: { 
  simulation: SimulationType, 
  onComplete: () => void,
  hasLowContrastFix: boolean,
  hasHighContrastFix: boolean
}) => {
  const [found, setFound] = useState(false);
  
  const handleClick = (isCorrect: boolean) => {
    if (isCorrect) {
      setFound(true);
      setTimeout(onComplete, 1000);
    }
  };
  
  const hasContrastFix = hasLowContrastFix || hasHighContrastFix;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm w-full max-w-md">
      <h3 className="font-bold mb-4">Find and click the "Settings" option</h3>
      
      {hasContrastFix && (simulation === 'low-contrast' || simulation === 'high-contrast') && (
        <div className="mb-4 text-green-600 bg-green-50 p-2 rounded border border-green-200">
          <strong>✓ Accessibility Fix Applied:</strong> Contrast has been improved for better visibility.
        </div>
      )}
      
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
            <span className={hasContrastFix ? "text-gray-800" : "text-gray-300"} 
                  aria-label={simulation === 'screen-reader' ? 'Settings' : undefined}>
              Settings
            </span>
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
const ComplexFormTask = ({ 
  simulation, 
  onComplete,
  hasCognitiveOverloadFix,
  hasScreenReaderFix
}: { 
  simulation: SimulationType, 
  onComplete: () => void,
  hasCognitiveOverloadFix: boolean,
  hasScreenReaderFix: boolean
}) => {
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
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm w-full max-w-md">
      <h3 className="font-bold mb-4">Complete all required fields</h3>
      
      {(hasCognitiveOverloadFix || hasScreenReaderFix) && (
        simulation === 'cognitive-overload' || simulation === 'screen-reader'
      ) && (
        <div className="mb-4 text-green-600 bg-green-50 p-2 rounded border border-green-200">
          <strong>✓ Accessibility Fix Applied:</strong> Form labels and instructions have been improved.
        </div>
      )}
      
      {submitted ? (
        <div className="text-green-600">Form submitted successfully!</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {(hasScreenReaderFix || hasCognitiveOverloadFix) && <label className="block mb-1">Your Name (required)</label>}
            <input 
              type="text" 
              name="name" 
              placeholder="Enter name"
              className="w-full border rounded px-3 py-2"
              aria-label={simulation === 'screen-reader' && !hasScreenReaderFix ? 'Your full name, required' : undefined}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            {(hasScreenReaderFix || hasCognitiveOverloadFix) && <label className="block mb-1">Email Address (required)</label>}
            <input 
              type="email" 
              name="email" 
              placeholder="Enter email"
              className="w-full border rounded px-3 py-2"
              aria-label={simulation === 'screen-reader' && !hasScreenReaderFix ? 'Your email address, required' : undefined}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          <div>
            {(hasScreenReaderFix || hasCognitiveOverloadFix) && <label className="block mb-1">Category (optional)</label>}
            <select 
              name="category" 
              className="w-full border rounded px-3 py-2 bg-white"
              aria-label={simulation === 'screen-reader' && !hasScreenReaderFix ? 'Select category, optional' : undefined}
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
            <label htmlFor="agree" className={simulation === 'cognitive-overload' && !hasCognitiveOverloadFix ? 'text-xs opacity-60' : ''}>
              {hasCognitiveOverloadFix && simulation === 'cognitive-overload' 
                ? 'I agree to the terms and conditions' 
                : 'I agree to the terms and conditions that are very long and complicated but you need to agree anyway...'
              }
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
const ImageSelectionTask = ({ 
  simulation, 
  onComplete,
  hasScreenReaderFix,
  hasBlurredVisionFix
}: { 
  simulation: SimulationType, 
  onComplete: () => void,
  hasScreenReaderFix: boolean,
  hasBlurredVisionFix: boolean
}) => {
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
      
      {(hasScreenReaderFix || hasBlurredVisionFix) && (
        simulation === 'screen-reader' || simulation === 'blurred-vision'
      ) && (
        <div className="mb-4 text-green-600 bg-green-50 p-2 rounded border border-green-200">
          <strong>✓ Accessibility Fix Applied:</strong> Images now have descriptive labels.
        </div>
      )}
      
      {selected === 'dog' ? (
        <div className="text-green-600">Correct! You found the dog.</div>
      ) : selected ? (
        <div className="text-red-500">That's not a dog. Try again.</div>
      ) : null}
      
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button 
          onClick={() => handleSelect('cat')} 
          className="h-24 bg-gray-200 rounded-lg flex items-center justify-center"
          aria-label={hasScreenReaderFix || simulation === 'screen-reader' ? 'Image of a cat' : undefined}
        >
          {hasBlurredVisionFix && simulation === 'blurred-vision' ? '🐱 (Cat)' : '🐱'}
        </button>
        <button 
          onClick={() => handleSelect('dog')} 
          className="h-24 bg-gray-200 rounded-lg flex items-center justify-center"
          aria-label={hasScreenReaderFix || simulation === 'screen-reader' ? 'Image of a dog' : undefined}
        >
          {hasBlurredVisionFix && simulation === 'blurred-vision' ? '🐕 (Dog)' : '🐕'}
        </button>
        <button 
          onClick={() => handleSelect('bird')} 
          className="h-24 bg-gray-200 rounded-lg flex items-center justify-center"
          aria-label={hasScreenReaderFix || simulation === 'screen-reader' ? 'Image of a bird' : undefined}
        >
          {hasBlurredVisionFix && simulation === 'blurred-vision' ? '🐦 (Bird)' : '🐦'}
        </button>
        <button 
          onClick={() => handleSelect('rabbit')} 
          className="h-24 bg-gray-200 rounded-lg flex items-center justify-center"
          aria-label={hasScreenReaderFix || simulation === 'screen-reader' ? 'Image of a rabbit' : undefined}
        >
          {hasBlurredVisionFix && simulation === 'blurred-vision' ? '🐰 (Rabbit)' : '🐰'}
        </button>
      </div>
    </div>
  );
};

// Dropdown menu task - Challenge: use a dropdown with poor contrast or keyboard accessibility
const DropdownMenuTask = ({ 
  simulation, 
  onComplete,
  hasLowContrastFix,
  hasZoomedUIFix,
  hasCognitiveOverloadFix
}: { 
  simulation: SimulationType, 
  onComplete: () => void,
  hasLowContrastFix: boolean,
  hasZoomedUIFix: boolean,
  hasCognitiveOverloadFix: boolean
}) => {
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
  
  const hasAnyFix = hasLowContrastFix || hasZoomedUIFix || hasCognitiveOverloadFix;
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm w-full max-w-md">
      <h3 className="font-bold mb-4">Select the Premium Plan from the dropdown</h3>
      
      {hasAnyFix && (
        simulation === 'low-contrast' || simulation === 'zoomed-ui' || simulation === 'cognitive-overload'
      ) && (
        <div className="mb-4 text-green-600 bg-green-50 p-2 rounded border border-green-200">
          <strong>✓ Accessibility Fix Applied:</strong> Dropdown design has been improved for better usability.
        </div>
      )}
      
      {selected === 'premium' ? (
        <div className="text-green-600">Great choice! Premium Plan selected.</div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className={`w-full flex justify-between items-center px-4 py-2 ${
              hasAnyFix ? "bg-blue-50 border-2 border-blue-300" : "bg-gray-50 border"
            } rounded`}
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
                    simulation === 'low-contrast' && option.value === 'premium' && !hasLowContrastFix
                      ? 'text-gray-300' 
                      : ''
                  } ${
                    option.value === 'premium' && hasAnyFix ? 'bg-blue-50 font-bold' : ''
                  }`}
                  role="option"
                  aria-selected={selected === option.value}
                  tabIndex={hasZoomedUIFix ? 0 : undefined}
                >
                  {option.label}
                  {option.value === 'premium' && hasAnyFix && <span className="ml-2">⭐</span>}
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
const ErrorMessageTask = ({ 
  simulation, 
  onComplete,
  hasColorBlindFix,
  hasScreenReaderFix
}: { 
  simulation: SimulationType, 
  onComplete: () => void,
  hasColorBlindFix: boolean,
  hasScreenReaderFix: boolean
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [errorFixed, setErrorFixed] = useState(false);
  
  const handleFix = () => {
    setErrorFixed(true);
    setTimeout(onComplete, 1000);
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm w-full max-w-md">
      <h3 className="font-bold mb-4">Identify and fix the error in your submission</h3>
      
      {(hasColorBlindFix || hasScreenReaderFix) && (
        simulation === 'color-blind' || simulation === 'screen-reader'
      ) && (
        <div className="mb-4 text-green-600 bg-green-50 p-2 rounded border border-green-200">
          <strong>✓ Accessibility Fix Applied:</strong> Error messages are now more clearly indicated.
        </div>
      )}
      
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
              <p className={
                hasColorBlindFix && simulation === 'color-blind'
                  ? "text-red-500 bg-red-50 p-2 border border-red-300 rounded flex items-center gap-2" 
                  : "text-red-500"
              } aria-label={hasScreenReaderFix || simulation === 'screen-reader' ? 'Error: Email address is invalid' : undefined}>
                {hasColorBlindFix && simulation === 'color-blind' && <span>❌</span>}
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