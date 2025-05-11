
import { useState } from "react";
import { useBackend } from "@/contexts/BackendContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InputBoxes = () => {
  const { serialNumber, outputFolder, addConsoleMessage } = useBackend();
  const [serialValue, setSerialValue] = useState(serialNumber);
  const [folderValue, setFolderValue] = useState(outputFolder);

  const handleSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSerialValue(e.target.value);
    addConsoleMessage(`Serial number updated: ${e.target.value}`);
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolderValue(e.target.value);
    addConsoleMessage(`Output folder updated: ${e.target.value}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="serial" className="text-xs text-gray-600 mb-1 block">Serial number</Label>
        <Input
          id="serial"
          value={serialValue}
          onChange={handleSerialChange}
          className="w-full"
        />
      </div>
      <div>
        <Label htmlFor="output" className="text-xs text-gray-600 mb-1 block">Output folder</Label>
        <Input
          id="output"
          value={folderValue}
          onChange={handleFolderChange}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default InputBoxes;
