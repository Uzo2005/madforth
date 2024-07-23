import { Token } from "../../types";
interface Props {
  stackState: Token[];
}

const EvalStack = ({ stackState }: Props) => {
  return (
    <div className="flex flex-col">
      <p className="flex justify-center text-sm font-semibold text-black italic w-full">
        evaluated stack
      </p>
      <div className="bg-yellow-300 overflow-y-scroll flex-grow rounded-b-md w-64 h-96 mx-auto border-black border-b-4 border-x-4 flex flex-col-reverse">
        {stackState.map((item, index) => (
          <div
            key={index}
            className="bg-black h-12 my-3 font-bold text-xl text-white flex justify-center items-center"
          >
            {item.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvalStack;
