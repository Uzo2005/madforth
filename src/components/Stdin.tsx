interface Props {
  state: string[];
}

const Stdin = ({ state }: Props) => {
  return (
    <div className="bg-gray-700">
      <p className="flex justify-center text-sm text-white italic w-full">
        standard input
      </p>
      <div>
        {state.length > 0
          ? state.map((item, index) => (
              <p
                key={index}
                className="mb-1 text-madforth_yellow underline mx-2"
              >
                {item}
              </p>
            ))
          : ""}
      </div>
    </div>
  );
};

export default Stdin;
