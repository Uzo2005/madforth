import React from "react";
import { Token } from "../../types";

interface Props {
  variableLookupTable: Map<string, Token>;
}

const VariableStates = ({ variableLookupTable }: Props) => {
  console.log(variableLookupTable);
  return (
    <div className="bg-black p-4">
      <p className="flex text-center justify-center text-xs text-white italic w-full mb-2">
        The current state of your variables are displayed here
      </p>
      <div className="max-h-60 overflow-y-auto">
        {Array.from(variableLookupTable).map(([key, value]) => (
          <p
            key={key}
            className="mb-1 bg-yellow-400 text-black w-full max-w-xs mx-auto flex justify-center p-2 rounded"
          >
            {`variable ${key}  has value of ${value.value}`}
          </p>
        ))}
      </div>
    </div>
  );
};

export default VariableStates;
