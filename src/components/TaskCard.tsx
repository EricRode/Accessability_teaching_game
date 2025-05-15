import { Task } from '@/store/useGameStore';

interface TaskCardProps {
  task: Task;
  completed?: boolean;
}

export const TaskCard = ({ task, completed = false }: TaskCardProps) => {
  return (
    <div className={`p-6 bg-white border rounded-xl shadow-sm transition-all w-full max-w-md ${
      completed ? 'border-green-500 bg-green-50' : 'border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold">{task.text}</h3>
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
          task.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
          task.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {task.difficulty}
        </span>
      </div>
      
      {completed && (
        <div className="mb-2 text-green-600 animate-pulse font-bold">
          Task completed! 
        </div>
      )}
      
      <p className="text-sm text-gray-500">
        <strong>Accessibility insight:</strong> {task.description}
      </p>
    </div>
  );
};