
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BackendProvider } from "@/contexts/BackendContext";
import FTPage from "@/components/FTPage/FTPage";
import CameraPage from "@/components/CameraPage/CameraPage";

const Index = () => {
  const [activeTab, setActiveTab] = useState("FT");

  return (
    <BackendProvider>
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar tabs */}
        <div className="w-20 bg-[#1A1F2C] flex flex-col items-center py-4 shadow-lg">
          <button
            className={`w-16 h-16 mb-4 flex items-center justify-center rounded-md ${
              activeTab === "FT" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setActiveTab("FT")}
          >
            <span className="text-lg font-semibold">FT</span>
          </button>
          <button
            className={`w-16 h-16 mb-4 flex items-center justify-center rounded-md ${
              activeTab === "Camera" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setActiveTab("Camera")}
          >
            <span className="text-sm font-semibold">Camera</span>
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4">
          <Card className="w-full h-[calc(100vh-2rem)] bg-white shadow-md rounded-lg overflow-hidden">
            {activeTab === "FT" ? <FTPage /> : <CameraPage />}
          </Card>
        </div>
      </div>
    </BackendProvider>
  );
};

export default Index;
