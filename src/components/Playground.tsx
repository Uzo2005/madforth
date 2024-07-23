import DisplayProgramText from "./DisplayProgramText";
import EvalStack from "./EvalStack";
import InputStack from "./InputStack";
import IoBox from "./IoBox";
import { StackResult } from "../../types";
import { compile } from "../../madforth";

interface Props {
  stackState: string[];
  setStack: (updater: (prevStack: string[]) => string[]) => void;
  evalOutput: StackResult;
  setEvalOutput: (result: StackResult) => void;
  programText: string;
}

const Playground = ({
  stackState,
  setStack,
  evalOutput,
  setEvalOutput,
  programText,
}: Props) => {
  return (
    <div className="col-span-4 bg-blue-200 grid grid-rows-6">
      <div className="row-span-5 gap-2 grid grid-cols-2 grid-rows-3 p-5">
        <div className="col-span-2 row-span-2 flex justify-around items-center">
          <InputStack stackState={stackState} setStack={setStack} />
          <button
            onClick={() => {
              setEvalOutput(compile(programText));
            }}
            className="bg-black p-3 rounded-sm text-white font-semibold text-sm hover:opacity-90"
          >
            Evaluate Stack
          </button>
          <EvalStack stackState={evalOutput.state} />
        </div>
        <IoBox
          io={evalOutput.io}
          variableLookupTable={evalOutput.variableMap}
        />
      </div>
      <DisplayProgramText programText={programText} />
    </div>
  );
};

export default Playground;
