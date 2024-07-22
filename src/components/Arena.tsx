import Keyword from "./Keyword";
import { allOperators } from "../../types";
import { useState } from "react";

interface Props {
  pushStack: (value: string) => void;
  pushStdin: (value: string) => void;
}

const Arena = ({ pushStack, pushStdin }: Props) => {
  const [inputValue, setInputValue] = useState("");
  const allKeywords = Object.keys(allOperators).reverse();
  const allKeywordsElem = allKeywords.map((keyword) => {
    return <Keyword key={keyword} value={keyword} />;
  });

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
    <div className="col-span-2 row-span-5 col-start-1 row-start-1 bg-black border-2 rounded-sm border-madforth_yellow grid grid-rows-3 gap-2">
      <div className="row-span-2 overflow-y-scroll">
        <div className="grid grid-cols-2 *:col-span-1 h-fit">
          {allKeywordsElem}
        </div>
      </div>
      <div className="bg-gray-700 p-4 flex flex-col items-center justify-between">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="h-10 w-40 m-2 p-1 bg-gray-800 text-white rounded"
          placeholder="Enter value..."
        />
        <button
          onClick={handleAddToStdin}
          className="bg-madforth_red p-1 text-white px-3 rounded mr-2"
        >
          Add to Stdin
        </button>
        <button
          onClick={handlePushToStack}
          className="bg-madforth_yellow text-black px-3 py-1 rounded"
        >
          Push to Stack
        </button>
      </div>
    </div>
  );
};

export default Arena;
