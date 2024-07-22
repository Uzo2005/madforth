import { useDrag } from "react-dnd";
import { ItemTypes } from "./StackItem";

interface Props {
  value: string;
}

const Keyword = ({ value }: Props) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.MADFORTH_KEYWORD ,
    item: { value: value },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      className={`border-white select-none cursor-pointer w-[80%] mx-auto border-2 m-1 p-2 h-16 rounded-sm text-white font-mono font-bold text-xl flex justify-center items-center ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {value}
    </div>
  );
};

export default Keyword;
