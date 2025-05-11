
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBackend } from "@/contexts/BackendContext";

const InfoPanel = () => {
  const { infoMessages } = useBackend();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [infoMessages]);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">Information</h2>
      <ScrollArea className="flex-grow bg-white text-gray-700 p-3 rounded border">
        <div className="space-y-1">
          {infoMessages.map((message, index) => (
            <div key={index} className="whitespace-pre-wrap">{message}</div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default InfoPanel;
