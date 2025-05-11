
import { useBackend } from "@/contexts/BackendContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import WebRTCViewer from "./WebRTCViewer";
import { useState } from "react";
import { PlayCircle, StopCircle } from "lucide-react";

const CameraPage = () => {
  const { exposureTime, cameraGain, addConsoleMessage } = useBackend();
  const [exposureValue, setExposureValue] = useState(exposureTime);
  const [gainValue, setGainValue] = useState(cameraGain);
  const [isStreamActive, setIsStreamActive] = useState(false);
  
  const handleExposureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExposureValue(e.target.value);
    addConsoleMessage(`Exposure time updated: ${e.target.value}`);
  };

  const handleGainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGainValue(e.target.value);
    addConsoleMessage(`Camera gain updated: ${e.target.value}`);
  };

  const handleStartStream = () => {
    setIsStreamActive(true);
    addConsoleMessage("Camera stream started");
  };

  const handleStopStream = () => {
    setIsStreamActive(false);
    addConsoleMessage("Camera stream stopped");
  };

  const handleTestConnection = () => {
    addConsoleMessage("Testing camera connection...");
    // Simulate connection test
    setTimeout(() => {
      addConsoleMessage("Camera connection OK");
    }, 1000);
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-full p-4">
      {/* Left Column */}
      <div className="col-span-3 flex flex-col gap-4">
        {/* FT Display (simulated) */}
        <div className="bg-gray-50 border rounded-md p-4 shadow-sm flex items-center justify-center aspect-square">
          <span className="text-lg font-semibold text-gray-800">FT</span>
        </div>
        
        {/* Camera Display (simulated) */}
        <div className="bg-amber-100 border rounded-md p-4 shadow-sm flex items-center justify-center aspect-square">
          <span className="text-lg font-semibold text-gray-800">Camera</span>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="col-span-9 flex flex-col gap-4">
        {/* Camera Configuration */}
        <div className="bg-amber-50 border rounded-md p-4 shadow-sm grid grid-cols-6 gap-4">
          {/* Input Controls */}
          <div className="col-span-2">
            <div className="space-y-4">
              <div>
                <Label htmlFor="serial" className="text-xs text-gray-600 mb-1 block">Serial number</Label>
                <Input id="serial" disabled value="########" className="w-full bg-gray-100" />
              </div>
              <div>
                <Label htmlFor="output" className="text-xs text-gray-600 mb-1 block">Output folder</Label>
                <Input id="output" disabled value="########" className="w-full bg-gray-100" />
              </div>
              <div>
                <Label htmlFor="exposure" className="text-xs text-gray-600 mb-1 block">Exposure time</Label>
                <Input 
                  id="exposure" 
                  value={exposureValue} 
                  onChange={handleExposureChange}
                  className="w-full" 
                />
              </div>
              <div>
                <Label htmlFor="gain" className="text-xs text-gray-600 mb-1 block">Camera gain</Label>
                <Input 
                  id="gain" 
                  value={gainValue} 
                  onChange={handleGainChange}
                  className="w-full" 
                />
              </div>
            </div>
            
            {/* Buttons */}
            <div className="mt-8 space-y-2">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700" 
                onClick={handleStartStream}
                disabled={isStreamActive}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Start
              </Button>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700" 
                onClick={handleStopStream}
                disabled={!isStreamActive}
              >
                <StopCircle className="w-4 h-4 mr-2" />
                Stop
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleTestConnection}
              >
                Test connection
              </Button>
            </div>
          </div>
          
          {/* WebRTC Viewer */}
          <div className="col-span-4">
            <WebRTCViewer isActive={isStreamActive} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraPage;
