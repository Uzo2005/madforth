import OperatorBox from "./OperatorBox";
import VariableInputBox from "./VariableInputBox";

interface Props {
  pushStack: (value: string) => void;
  pushStdin: (value: string) => void;
}

const Arena = ({ pushStack, pushStdin }: Props) => {
  return (
    <div className="col-span-1 bg-black p-3 flex flex-col gap-10">
      <OperatorBox />
      <VariableInputBox pushStack={pushStack} pushStdin={pushStdin} />
    </div>
  );
};

export default Arena;
