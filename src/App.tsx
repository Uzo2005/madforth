import Arena from "./components/Arena";
import IOBox from "./components/IOBox";
import InputStack from "./components/InputStack";
import EvalStack from "./components/EvalStack";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState } from "react";
import { allOperators, StackResult, Token } from "../types";
import { io } from "../madforth";

function App() {
  const [evalOutput, setEvalOutput] = useState<StackResult>();
  const [programText, setProgramText] = useState("");
  const [stack, setStack] = useState<string[]>([]);

  const updateStack = (updater: (prevStack: string[]) => string[]) => {
    setStack((prevStack) => {
      const newStack = updater(prevStack);
      setProgramText(
        newStack
          .map((item) => {
            if (item in allOperators) {
              return allOperators[item];
            } else {
              return item;
            }
          })
          .join(" ")
      );
      return newStack;
    });
  };
  function pushStack(value: string) {
    if (value.trim().length > 0) {
      updateStack((prevStack) => [...prevStack, value]);
    }
  }

  function pushStdin(value: string) {
    if (value.trim().length > 0) {
      io.stdin.push(value);
      setEvalOutput({
        state: evalOutput?.state ? evalOutput?.state : [],
        variableMap: evalOutput?.variableMap
          ? evalOutput?.variableMap
          : new Map<string, Token>(),
        io: io,
      });
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full w-full py-1 flex flex-col justify-between gap-2">
        <div className="w-full h-20 bg-white  flex justify-center items-center overflow-x-scroll">
          <span className="bg-black font-bold text-lg text-white p-2">
            {programText}
          </span>
        </div>
        <div className="grid grid-cols-6 grid-rows-5 gap-4 h-[90%]">
          <Arena pushStack={pushStack} pushStdin={pushStdin} />
          <InputStack
            stack={stack}
            setStack={updateStack}
            programText={programText}
            setEvalOutput={setEvalOutput}
          />
          <EvalStack stackState={evalOutput?.state ? evalOutput?.state : []} />
          <IOBox
            ioState={
              evalOutput?.io
                ? evalOutput.io
                : { stdin: [], stdout: [], stderr: [] }
            }
          />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
