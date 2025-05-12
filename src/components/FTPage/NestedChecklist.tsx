
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useBackend } from "@/contexts/BackendContext";

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  children?: ChecklistItem[];
}

const NestedChecklist = () => {
  const { updateCheckItem, handleItemTextClick } = useBackend();
  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/checklist")
      .then((response) => response.json())
      .then((data: ChecklistItem[]) => {
        setItems(data);
      })
      .catch((error) => {
        console.error("Error loading checklist data:", error);
      });
  }, []);

  const handleCheckboxChange = (item: ChecklistItem, checked: boolean) => {
    updateCheckItem(item.id, checked);
    
    // Update local state for immediate UI feedback
    setItems((prevItems) => {
      return updateItemCheckedStatus(prevItems, item.id, checked);
    });
  };

  const updateItemCheckedStatus = (
    items: ChecklistItem[],
    id: string,
    checked: boolean
  ): ChecklistItem[] => {
    return items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          checked,
          children: item.children
            ? item.children.map((child) => ({ ...child, checked }))
            : undefined,
        };
      } else if (item.children) {
        return {
          ...item,
          children: updateItemCheckedStatus(item.children, id, checked),
        };
      }
      return item;
    });
  };

  const renderChecklistItem = (item: ChecklistItem) => (
    <div key={item.id} className="mb-1">
      <div className="flex items-start">
        <Checkbox
          id={item.id}
          checked={item.checked}
          onCheckedChange={(checked) => handleCheckboxChange(item, checked === true)}
          className="mt-1"
        />
        <label
          htmlFor={item.id}
          className="ml-2 text-sm font-medium text-gray-800 cursor-pointer"
          onClick={() => handleItemTextClick(item.id)}
        >
          {item.text}
        </label>
      </div>
      
      {item.children && item.children.length > 0 && (
        <div className="ml-6 mt-1">
          {item.children.map((child) => (
            <div key={child.id} className="flex items-center mb-1">
              <Checkbox
                id={child.id}
                checked={child.checked}
                onCheckedChange={(checked) => handleCheckboxChange(child, checked === true)}
              />
              <label
                htmlFor={child.id}
                className="ml-2 text-sm text-gray-600 cursor-pointer"
                onClick={() => handleItemTextClick(child.id)}
              >
                {child.text}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="overflow-y-auto h-full">
      {items.map(renderChecklistItem)}
    </div>
  );
};

export default NestedChecklist;
