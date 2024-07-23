import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../consts";

export interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface Props {
  id: string;
  text: string;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  removeItem: (index: number) => void;
}

const StackItem = ({ id, text, index, moveItem, removeItem }: Props) => {
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
      className={` bg-black h-12 mb-1 font-bold text-xl text-white flex justify-center items-center cursor-move ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {text}
    </div>
  );
};

export default StackItem;
