interface Props {
  values: string[];
}

const Stdin = ({ values }: Props) => {
  return (
    <div className="bg-black">
      <p className="flex justify-center text-sm text-white italic w-full">
        standard input
      </p>
      <div className="overflow-y-scroll p-3">
        {values.length > 0
          ? values.map((item, index) => (
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
  );
};

export default Stdin;
