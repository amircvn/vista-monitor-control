
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBackend } from "@/contexts/BackendContext";

const ConsolePanel = () => {
  const { consoleMessages } = useBackend();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleMessages]);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">Console</h2>
      <ScrollArea className="flex-grow bg-[#1A1F2C] text-gray-200 p-3 rounded font-mono text-sm">
        <div className="space-y-1">
          {consoleMessages.map((message, index) => (
            <div key={index} className="whitespace-pre-wrap">{message}</div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConsolePanel;
