import Stdin from "./Stdin";
import { IO } from "../../types";

interface Props {
  ioState: IO;
}
const IOBox = ({ ioState }: Props) => {
  return (
    <div className="col-span-2 row-span-5 col-start-5 row-start-1 bg-black border-2 rounded-sm border-madforth_yellow grid grid-rows-3 gap-2">
      <Stdin state={ioState.stdin} />
      <div className="bg-gray-700">
        <p className="flex justify-center text-sm text-white italic w-full">
          standard output
        </p>
        <div>
          {ioState.stdout.length > 0
            ? ioState.stdout.map((item, index) => (
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
      <div className="bg-gray-700">
        <p className="flex justify-center text-sm text-white italic w-full">
          standard error
        </p>
        <div>
          {ioState.stderr.length > 0
            ? ioState.stderr.map((item, index) => (
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
    </div>
  );
};

export default IOBox;
