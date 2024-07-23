import { useCallback } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../consts";
import StackItem from "./StackItem";

interface Props {
  stackState: string[];
  setStack: (updater: (prevStack: string[]) => string[]) => void;
}

const InputStack = ({ stackState, setStack }: Props) => {
  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setStack((prevStack: string[]) => {
        const newStack = [...prevStack];
        let a = newStack[dragIndex];
        newStack[dragIndex] = newStack[hoverIndex];
        newStack[hoverIndex] = a;
        return newStack;
      });
    },
    [setStack]
  );

  const removeItem = useCallback(
    (index: number) => {
      setStack((prevStack: string[]) =>
        prevStack.filter((_, i) => i !== index)
      );
    },
    [setStack]
  );

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: [ItemTypes.MADFORTH_KEYWORD, ItemTypes.STACK_ITEM],
    drop: (item: { value: string }, monitor) => {
      if (!monitor.didDrop()) {
        setStack((prevStack: string[]) => [...prevStack, item.value]);
      }
      return item;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div className="flex flex-col">
      <p className="flex justify-center text-sm font-semibold text-black italic w-full">
        input stack
      </p>
      <div
        ref={dropRef}
        className={`${
          isOver ? "bg-opacity-70" : "bg-opacity-100"
        } bg-yellow-300 rounded-b-md w-64 h-96 mx-auto border-black border-b-4 border-x-4 relative overflow-hidden`}
      >
        <div className="absolute inset-0 overflow-y-auto ">
          <div className="flex flex-col-reverse">
            {stackState.map((item, index) => (
              <StackItem
                key={item + index}
                id={item + index}
                text={item}
                index={index}
                moveItem={moveItem}
                removeItem={removeItem}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputStack;
