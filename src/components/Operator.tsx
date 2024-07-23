import { useDrag } from "react-dnd";
import { ItemTypes } from "../consts";
interface Props {
  explanation: string;
  tokenValue: string;
}

const Operator = ({ explanation, tokenValue }: Props) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.MADFORTH_KEYWORD,
    item: { value: tokenValue },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  return (
    <div
      ref={dragRef}
      className={`relative select-none bg-madforth_yellow ${
        isDragging ? "opacity-50" : "opacity-100"
      } p-2 flex justify-center items-center rounded-sm group cursor-grab`}
    >
      <span className="text-black font-bold text-[10px] md:text-sm">
        {tokenValue}
      </span>

      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {explanation}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-700"></div>
      </div>
    </div>
  );
};

export default Operator;
