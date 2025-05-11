
import { useBackend } from "@/contexts/BackendContext";
import StatusList from "./StatusList";
import InputBoxes from "./InputBoxes";
import ActionButtons from "./ActionButtons";
import NestedChecklist from "./NestedChecklist";
import ConsolePanel from "./ConsolePanel";
import InfoPanel from "./InfoPanel";

const FTPage = () => {
  const { addConsoleMessage } = useBackend();

  return (
    <div className="grid grid-cols-12 gap-4 h-full p-4">
      {/* Left Column */}
      <div className="col-span-3 flex flex-col gap-4">
        {/* Status List */}
        <div className="bg-gray-50 border rounded-md p-4 shadow-sm">
          <StatusList />
        </div>
        
        {/* Input Boxes */}
        <div className="bg-gray-50 border rounded-md p-4 shadow-sm flex-grow">
          <InputBoxes />
        </div>
        
        {/* Action Buttons */}
        <div className="bg-gray-50 border rounded-md p-4 shadow-sm">
          <ActionButtons />
        </div>
      </div>
      
      {/* Middle Column - Nested Checklist */}
      <div className="col-span-4 bg-gray-50 border rounded-md p-4 shadow-sm overflow-y-auto">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Checklist</h2>
        <NestedChecklist />
      </div>
      
      {/* Right Column - Info Panel (replacing console) */}
      <div className="col-span-5 bg-gray-50 border rounded-md p-4 shadow-sm">
        <InfoPanel />
      </div>

      {/* Bottom Row - Console Panel (moved from right column) */}
      <div className="col-span-12 bg-gray-50 border rounded-md p-4 shadow-sm h-48">
        <ConsolePanel />
      </div>
    </div>
  );
};

export default FTPage;
