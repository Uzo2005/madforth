import { Token } from "../../types";

interface Props {
  stackState: Token[];
}

const EvalStack = ({ stackState }: Props) => {
  return (
    <div className="row-span-4 col-start-4 row-start-2 flex flex-col gap-2">
      <p className="flex justify-center text-sm text-white italic w-full">
        evaluated stack
      </p>
      <div className="bg-neutral-900 border-x-2 rounded-b-md border-b-2 border-madforth_yellow w-full flex-grow">
        {stackState
          .slice()
          .reverse()
          .map((item, index) => (
            <div key={index} className="border-2 border-madforth_yellow h-10 my-3 font-bold text-xl text-white flex justify-center items-center cursor-move">
              {item.value}
            </div>
          ))}
      </div>
    </div>
  );
};

export default EvalStack;
