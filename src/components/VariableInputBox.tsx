import { useState } from "react";

interface Props {
  pushStack: (value: string) => void;
  pushStdin: (value: string) => void;
}

const VariableInputBox = ({ pushStack, pushStdin }: Props) => {
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddToStdin = () => {
    pushStdin(inputValue);
    setInputValue("");
  };

  const handlePushToStack = () => {
    pushStack(inputValue);
    setInputValue("");
  };

  return (
    <div className="flex-grow flex flex-col justify-between gap-4 items-center max-w-md w-full mx-auto">
      <div>
        <p className="text-sm sm:text-[10px] text-center text-white italic border border-white p-2 w-full">
          Enter your numbers, strings and variable names here. Then push the
          values to the stack or to standard input.
        </p>
        <p className="text-sm text-center text-white italic border border-white p-2 w-full">
          Remember that variable assignment starts with `$`, while using a
          variable value ends with `[]`
        </p>
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="p-3 bg-black border-2 border-madforth_yellow text-madforth_yellow font-black text-sm md:text-lg rounded-md focus:outline-none w-full"
        placeholder="Enter a value..."
      />
      <div className="flex flex-col sm:flex-row justify-between w-full gap-2">
        <button
          onClick={handleAddToStdin}
          className="bg-blue-300 text-black font-bold text-sm p-2 rounded-sm hover:opacity-90 w-full sm:w-auto"
        >
          Add to Stdin
        </button>
        <button
          onClick={handlePushToStack}
          className="bg-madforth_yellow text-black font-bold text-sm p-2 rounded-sm hover:opacity-90 w-full sm:w-auto"
        >
          Push to Stack
        </button>
      </div>
    </div>
  );
};

export default VariableInputBox;
