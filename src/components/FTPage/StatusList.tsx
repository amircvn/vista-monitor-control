
import { useBackend } from "@/contexts/BackendContext";

const StatusList = () => {
  const { statusItems } = useBackend();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 text-gray-700">Status</h2>
      <div className="space-y-2">
        {statusItems.map((item) => (
          <div key={item.id} className="flex items-center">
            <span 
              className={`w-4 h-4 rounded-full mr-3 ${
                item.status === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <span className="text-sm font-medium text-gray-800">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusList;
