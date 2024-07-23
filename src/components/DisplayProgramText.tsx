interface Props {
  programText: string;
}

const DisplayProgramText = ({ programText }: Props) => {
  return (
    <div className="bg-black row-span-1 flex justify-center items-center px-5">
      <code className=" text-white font-extralight text-lg">{programText}</code>
    </div>
  );
};

export default DisplayProgramText;
