
import { useBackend } from "@/contexts/BackendContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
//import WebRTCViewer from "./WebRTCViewer";
import RTSPViewer from "./RTSPViewer"; // If you renamed the file, update accordingly
import { useState } from "react";
import { PlayCircle, StopCircle } from "lucide-react";
import ConsolePanel from "../FTPage/ConsolePanel";
import InfoPanel from "../FTPage/InfoPanel";

const CameraPage = () => {
  const { exposureTime, cameraGain, addConsoleMessage } = useBackend();
  const [exposureValue, setExposureValue] = useState(exposureTime);
  const [gainValue, setGainValue] = useState(cameraGain);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [ipAddress, setIpAddress] = useState("192.168.1.21");
  
  const handleExposureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExposureValue(e.target.value);
    addConsoleMessage(`Exposure time updated: ${e.target.value}`);
  };

  const handleGainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGainValue(e.target.value);
    addConsoleMessage(`Camera gain updated: ${e.target.value}`);
  };

  const handleIpAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIpAddress(e.target.value);
    addConsoleMessage(`Camera IP address updated: ${e.target.value}`);
  };

  const handleStartStream = async () => {
    setIsStreamActive(true);
    addConsoleMessage(`Camera stream started at IP: ${ipAddress}`);
  
    const payload = {
      ip: ipAddress,
      exposure: exposureValue,
      gain: gainValue,
    };
  
    try {
      const res = await fetch("http://127.0.0.1:5000/start_stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (res.ok) {
        const msg = await res.text();
        addConsoleMessage(`Backend response: ${msg}`);
      } else {
        addConsoleMessage(`Backend error: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      addConsoleMessage(`Error sending to backend: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleStopStream = async () => {
    setIsStreamActive(false);
    addConsoleMessage(`Stopping camera stream at IP: ${ipAddress}`);
  
    const payload = {
      ip: ipAddress,
      exposure: exposureValue,
      gain: gainValue,
    };
  
    try {
      const res = await fetch("http://127.0.0.1:5000/stop_stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (res.ok) {
        const msg = await res.text();
        addConsoleMessage(`Backend response: ${msg}`);
      } else {
        addConsoleMessage(`Backend error: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      addConsoleMessage(`Error sending to backend: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleTestConnection = () => {
    addConsoleMessage(`Testing camera connection to ${ipAddress}...`);
    // Simulate connection test
    setTimeout(() => {
      addConsoleMessage(`Camera connection to ${ipAddress} OK`);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-full p-4">
      {/* Top section */}
      <div className="col-span-12 grid grid-cols-12 gap-4">
        {/* Left Column - Camera Controls */}
        <div className="col-span-3">
          <div className="bg-gray-50 border rounded-md p-4 shadow-sm">
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
                <Label htmlFor="ipAddress" className="text-xs text-gray-600 mb-1 block">Camera IP</Label>
                <Input 
                  id="ipAddress" 
                  value={ipAddress} 
                  onChange={handleIpAddressChange}
                  className="w-full" 
                />
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
        </div>
        
        {/* Middle/Right - WebRTC Viewer */}
        <div className="col-span-6">
          <div className="bg-gray-50 border rounded-md p-4 shadow-sm h-full">
          <RTSPViewer isActive={isStreamActive} ipAddress={ipAddress} />
          </div>
        </div>
        
        {/* Right Column - Info Panel */}
        <div className="col-span-3">
          <div className="bg-gray-50 border rounded-md p-4 shadow-sm h-full">
            <InfoPanel />
          </div>
        </div>
      </div>
      
      {/* Bottom Row - Console Panel */}
      <div className="col-span-12 bg-gray-50 border rounded-md p-4 shadow-sm h-48">
        <ConsolePanel />
      </div>
    </div>
  );
};

export default CameraPage;
