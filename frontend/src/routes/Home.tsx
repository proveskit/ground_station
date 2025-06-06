import { useEffect, useMemo, useRef, useState } from "react";
import type { SlotItemMapArray, Swapy } from "swapy";
import { createSwapy, utils } from "swapy";

type Item = {
  id: string;
  title: string;
};

const initialItems: Item[] = Array.from({ length: 16 }, (_, index) => ({
  id: `${index + 1}`,
  title: `${index + 1}`,
}));

export default function Home() {
  const [items] = useState<Item[]>(initialItems);
  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(
    utils.initSlotItemMap(items, "id")
  );
  const slottedItems = useMemo(
    () => utils.toSlottedItems(items, "id", slotItemMap),
    [items, slotItemMap]
  );
  const swapyRef = useRef<Swapy | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      utils.dynamicSwapy(
        swapyRef.current,
        items,
        "id",
        slotItemMap,
        setSlotItemMap
      ),
    [items]
  );

  useEffect(() => {
    swapyRef.current = createSwapy(containerRef.current!, {
      manualSwap: true,
    });

    swapyRef.current.onSwap((event) => {
      setSlotItemMap(event.newSlotItemMap.asArray);
    });

    return () => {
      swapyRef.current?.destroy();
    };
  }, []);

  return (
    <div className="p-8">
      <div
        className="grid grid-cols-4 gap-6 max-w-4xl mx-auto"
        ref={containerRef}
      >
        {slottedItems.map(({ slotId, itemId, item }) => (
          <div
            className="aspect-square resize"
            key={slotId}
            data-swapy-slot={slotId}
          >
            {item && (
              <div
                className="w-full h-full resize bg-blue-500 rounded-lg flex items-center justify-center text-white text-4xl font-bold cursor-move hover:bg-blue-600 transition-colors"
                data-swapy-item={itemId}
                key={itemId}
              >
                {item.title}
              </div>
            )}
          </div>
        ))}
        <div className="w-screen h-56 bg-red-500 resize overflow-auto">Hey</div>
      </div>
    </div>
  );
}
