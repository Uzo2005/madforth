import Arena from "./components/Arena";
import Playground from "./components/Playground";
import { useState } from "react";
import { StackResult, Token } from "../types";
import { pushToStdin, io } from "../madforth";

const App = () => {
  const [evalOutput, setEvalOutput] = useState<StackResult>({
    state: [],
    variableMap: new Map(),
    io: { stdin: [], stdout: [], stderr: [] },
  });
  const [stack, setStack] = useState<string[]>([]);
  const [programText, setProgramText] = useState("");
  console.log(stack);

  const updateStack = (updater: (prevStack: string[]) => string[]) => {
    setStack((prevStack) => {
      const newStack = updater(prevStack);
      setProgramText(
        newStack
          .map((item) => {
            return item;
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
      pushToStdin(value);
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
    <div className="grid grid-cols-5 gap-2 h-full w-full">
      <Arena pushStack={pushStack} pushStdin={pushStdin} />
      <Playground
        stackState={stack}
        setStack={updateStack}
        setEvalOutput={setEvalOutput}
        programText={programText}
        evalOutput={evalOutput}
      />
    </div>
  );
};

export default App;
