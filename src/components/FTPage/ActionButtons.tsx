
import { Button } from "@/components/ui/button";
import { useBackend } from "@/contexts/BackendContext";
import { Start, Stop } from "lucide-react";

const ActionButtons = () => {
  const { addConsoleMessage } = useBackend();

  const handleClick = (action: string) => {
    addConsoleMessage(`Action: ${action}`);
  };

  return (
    <div className="space-y-2">
      <Button 
        className="w-full bg-green-600 hover:bg-green-700" 
        onClick={() => handleClick("Start")}
      >
        <Start className="w-4 h-4 mr-2" />
        Start
      </Button>
      <Button 
        className="w-full bg-red-600 hover:bg-red-700" 
        onClick={() => handleClick("Stop")}
      >
        <Stop className="w-4 h-4 mr-2" />
        Stop
      </Button>
      <Button 
        className="w-full" 
        variant="outline"
        onClick={() => handleClick("Test connection")}
      >
        Test connection
      </Button>
      <Button 
        className="w-full" 
        variant="outline"
        onClick={() => handleClick("Select all")}
      >
        Select all
      </Button>
      <Button 
        className="w-full" 
        variant="outline"
        onClick={() => handleClick("Clear all")}
      >
        Clear all
      </Button>
    </div>
  );
};

export default ActionButtons;
