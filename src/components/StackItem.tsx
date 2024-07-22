import React from "react";
import { useDrag, useDrop } from "react-dnd";

export const ItemTypes = {
  STACK_ITEM: "stack_item",
  MADFORTH_KEYWORD: "Madforth_keyword",
};

export interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface StackItemProps {
  id: string;
  text: string;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  removeItem: (index: number) => void;
}

const StackItem: React.FC<StackItemProps> = ({
  id,
  text,
  index,
  moveItem,
  removeItem,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.STACK_ITEM,
    item: { type: ItemTypes.STACK_ITEM, id, index },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && !dropResult) {
        removeItem(index);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop<
    DragItem,
    void,
    { handlerId: string | symbol | null }
  >({
    accept: ItemTypes.STACK_ITEM,
    hover(item: DragItem) {
      if (!drag) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`border-2 border-madforth_yellow h-10 my-3 font-bold text-xl text-white flex justify-center items-center cursor-move ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {text}
    </div>
  );
};

export default StackItem;
