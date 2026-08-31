import React, { createContext, useState, useContext, ReactNode } from "react";

const BagContext = createContext<any>(null);

export const BagProvider = ({ children }: { children: ReactNode }) => {
  const [bagItems, setBagItems] = useState<any[]>([]);

  const addToBag = (item: any) => {
    setBagItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id
            ? { ...p, quantity: (p.quantity || 1) + 1 }
            : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };
  const removeFromBag = (id: number) => {
    setBagItems((prev) => prev.filter((item) => item.id !== id));
  };

  const decreaseQuantity = (id: number) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const increaseQuantity = (id: number) => {
    setBagItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };
  return (
    <BagContext.Provider value={{ bagItems, addToBag, removeFromBag, decreaseQuantity, increaseQuantity }}>
      {children}
    </BagContext.Provider>
  );
};

export const useBag = () => useContext(BagContext);
