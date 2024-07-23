import { IO, Token } from "../../types";
import Stdin from "./Stdin";
import VariableStates from "./VariableStates";
interface Props {
  io: IO;
  variableLookupTable: Map<string, Token>;
}

const IoBox = ({ io, variableLookupTable }: Props) => {
  console.log(io);
  return (
    <div className="col-span-2 row-span-1 bg-madforth_black shadow-lg rounded-md grid grid-cols-4 gap-2">
      <Stdin values={io.stdin} />
      <div className="bg-black">
        <p className="flex justify-center text-sm text-white italic w-full">
          standard output
        </p>
        <div className="overflow-y-scroll p-3">
          {io.stdout.length > 0
            ? io.stdout.map((item, index) => (
                <p
                  key={index}
                  className="mb-1 bg-madforth_yellow text-black w-20 mx-auto flex justify-center"
                >
                  {item}
                </p>
              ))
            : ""}
        </div>
      </div>
      <div className="bg-black">
        <p className="flex justify-center text-sm text-white italic w-full">
          standard error
        </p>
        <div className="overflow-y-scroll p-3">
          {io.stderr.length > 0
            ? io.stderr.map((item, index) => (
                <p
                  key={index}
                  className="mb-1 bg-madforth_yellow text-black w-20 mx-auto flex justify-center"
                >
                  {item}
                </p>
              ))
            : ""}
        </div>
      </div>
      <VariableStates variableLookupTable={variableLookupTable}/>
    </div>
  );
};

export default IoBox;
