import React, { useCallback } from "react";
import { useDrop } from "react-dnd";
import StackItem, { ItemTypes } from "./StackItem";
import { StackResult } from "../../types";
import { compile } from "../../madforth";

interface Props {
  stack: string[];
  setStack: (updater: (prevStack: string[]) => string[]) => void;
  setEvalOutput: (result: StackResult) => void;
  programText: string;
}

const InputStack: React.FC<Props> = ({
  stack,
  setStack,
  setEvalOutput,
  programText,
}) => {
  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setStack((prevStack: string[]) => {
        const newStack = [...prevStack];
        const [reorderedItem] = newStack.splice(dragIndex, 1);
        newStack.splice(hoverIndex, 0, reorderedItem);
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

  const [{ isOver }, drop] = useDrop(() => ({
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
    <div className="row-span-4 col-start-3 row-start-2 flex flex-col gap-2">
      <button
        className="bg-madforth_red p-2 text-white"
        onClick={() => {
          setEvalOutput(compile(programText));
        }}
      >
        compile program
      </button>
      <p className="flex justify-center text-sm text-white italic w-full">
        input stack
      </p>
      <div
        ref={drop}
        className={`bg-neutral-900 overflow-y-scroll border-x-2 rounded-b-md border-b-2 border-madforth_yellow w-full flex-grow p-2 ${
          isOver ? "bg-opacity-70" : "bg-opacity-100"
        }`}
      >
        {stack
          .slice()
          .reverse()
          .map((item, index) => (
            <StackItem
              key={item + index}
              id={item + index}
              text={item}
              index={stack.length - index - 1}
              moveItem={moveItem}
              removeItem={removeItem}
            />
          ))}
      </div>
    </div>
  );
};

export default InputStack;
