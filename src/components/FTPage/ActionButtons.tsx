
import { Button } from "@/components/ui/button";
import { useBackend } from "@/contexts/BackendContext";
import { PlayCircle, StopCircle } from "lucide-react";

const ActionButtons = () => {
  const { addConsoleMessage, selectAllCheckboxes, clearAllCheckboxes, checklistItems } = useBackend();

  const handleClick = (action: string) => {
    addConsoleMessage(`Action: ${action}`);
  };

  const handleSelectAll = () => {
    selectAllCheckboxes();
    addConsoleMessage("Selected all checkboxes");
  };

  const handleClearAll = () => {
    clearAllCheckboxes();
    addConsoleMessage("Cleared all checkboxes");
  };

  const handleStart = () => {
    // Send checkbox data to backend
    const checkedItems = checklistItems.filter(item => item.checked);
    addConsoleMessage(`Action: Start`);
    addConsoleMessage(`Sending ${checkedItems.length} checked items to backend`);
    addConsoleMessage(`Checkbox data: ${JSON.stringify(checkedItems)}`);
  };

  return (
    <div className="space-y-2">
      <Button 
        className="w-full bg-green-600 hover:bg-green-700" 
        onClick={handleStart}
      >
        <PlayCircle className="w-4 h-4 mr-2" />
        Start
      </Button>
      <Button 
        className="w-full bg-red-600 hover:bg-red-700" 
        onClick={() => handleClick("Stop")}
      >
        <StopCircle className="w-4 h-4 mr-2" />
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
        onClick={handleSelectAll}
      >
        Select all
      </Button>
      <Button 
        className="w-full" 
        variant="outline"
        onClick={handleClearAll}
      >
        Clear all
      </Button>
    </div>
  );
};

export default ActionButtons;
