
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Status = "success" | "error";
type CheckItemStatus = { id: string; checked: boolean; color?: string };

interface BackendContextType {
  statusItems: { id: string; text: string; status: Status }[];
  serialNumber: string;
  outputFolder: string;
  exposureTime: string;
  cameraGain: string;
  consoleMessages: string[];
  infoMessages: string[];
  checklistItems: CheckItemStatus[];
  updateCheckItem: (id: string, checked: boolean) => void;
  handleItemTextClick: (id: string) => void;
  addConsoleMessage: (message: string) => void;
  addInfoMessage: (message: string) => void;
  selectAllCheckboxes: () => void;
  clearAllCheckboxes: () => void;
}

const BackendContext = createContext<BackendContextType | undefined>(undefined);

export const useBackend = () => {
  const context = useContext(BackendContext);
  if (!context) {
    throw new Error("useBackend must be used within a BackendProvider");
  }
  return context;
};

export const BackendProvider = ({ children }: { children: ReactNode }) => {
  const [statusItems, setStatusItems] = useState([
    { id: "1", text: "Text1", status: "success" as Status },
    { id: "2", text: "Text2", status: "error" as Status },
    { id: "3", text: "Text3", status: "success" as Status },
    { id: "4", text: "Text4", status: "error" as Status },
  ]);
  const [serialNumber, setSerialNumber] = useState("SN12345");
  const [outputFolder, setOutputFolder] = useState("/output/data");
  const [exposureTime, setExposureTime] = useState("10000");
  const [cameraGain, setCameraGain] = useState("3.5");
  const [consoleMessages, setConsoleMessages] = useState<string[]>([
    "System initialized",
    "Version 2.3.4",
    "Connected to backend services",
    "Ready for operation",
  ]);
  const [infoMessages, setInfoMessages] = useState<string[]>([
    "System information panel",
    "Contains status updates and important notifications",
    "Check here for system alerts"
  ]);
  const [checklistItems, setChecklistItems] = useState<CheckItemStatus[]>([]);

  useEffect(() => {
    // Simulating changing statuses from backend
    const interval = setInterval(() => {
      setStatusItems((prev) =>
        prev.map((item) => ({
          ...item,
          status: Math.random() > 0.7 ? "error" : "success",
        }))
      );
    }, 5000);

    // Load initial checklist data
    fetch("/src/data/checklistData.json")
      .then((response) => response.json())
      .then((data) => {
        const flattenedItems = flattenChecklist(data);
        setChecklistItems(flattenedItems);
      })
      .catch((error) => {
        console.error("Error loading checklist data:", error);
        addConsoleMessage("Error loading checklist data");
      });
    
    // Simulate info messages coming from backend
    const infoInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        addInfoMessage(`System event at ${new Date().toLocaleTimeString()}`);
      }
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(infoInterval);
    };
  }, []);

  // Helper to flatten the nested checklist for tracking state
  const flattenChecklist = (items: any[], parentId = ""): CheckItemStatus[] => {
    let result: CheckItemStatus[] = [];
    items.forEach((item) => {
      result.push({ id: item.id, checked: item.checked || false });
      if (item.children && item.children.length > 0) {
        result = [...result, ...flattenChecklist(item.children, item.id)];
      }
    });
    return result;
  };

  const updateCheckItem = (id: string, checked: boolean) => {
    // Find all children of this item
    const children = checklistItems.filter((item) => item.id.startsWith(`${id}-`));
    
    // Update the item and all its children
    setChecklistItems((prev) =>
      prev.map((item) => {
        if (item.id === id || children.some((child) => child.id === item.id)) {
          return { ...item, checked };
        }
        return item;
      })
    );
    
    addConsoleMessage(`Item ${id} ${checked ? "checked" : "unchecked"}`);
  };

  const selectAllCheckboxes = () => {
    setChecklistItems((prev) => 
      prev.map(item => ({ ...item, checked: true }))
    );
  };

  const clearAllCheckboxes = () => {
    setChecklistItems((prev) => 
      prev.map(item => ({ ...item, checked: false }))
    );
  };

  const handleItemTextClick = (id: string) => {
    addConsoleMessage(`Clicked on item text: ${id}`);
  };

  const addConsoleMessage = (message: string) => {
    setConsoleMessages((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const addInfoMessage = (message: string) => {
    setInfoMessages((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  return (
    <BackendContext.Provider
      value={{
        statusItems,
        serialNumber,
        outputFolder,
        exposureTime,
        cameraGain,
        consoleMessages,
        infoMessages,
        checklistItems,
        updateCheckItem,
        handleItemTextClick,
        addConsoleMessage,
        addInfoMessage,
        selectAllCheckboxes,
        clearAllCheckboxes,
      }}
    >
      {children}
    </BackendContext.Provider>
  );
};
