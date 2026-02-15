import { row } from "../../styles/layout";

type Props = {
  steps: string[];
  currentIndex: number;
};

function Stepper(props: Props) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className={`${row} min-w-max`}>
        {props.steps.map((s, idx) => {
          const isCurrent = idx === props.currentIndex;
          const isDone = idx < props.currentIndex;

          // Dynamic styles based on state
          let circleStyle = "border-slate-300 bg-white text-slate-500";
          let textStyle = "text-slate-500";
          let lineStyle = "bg-slate-200";

          if (isCurrent) {
            circleStyle = "border-blue-600 bg-blue-600 text-white ring-4 ring-blue-100";
            textStyle = "text-blue-700 font-semibold";
          } else if (isDone) {
            circleStyle = "border-blue-600 bg-blue-600 text-white";
            textStyle = "text-blue-600 font-medium";
            lineStyle = "bg-blue-600";
          }

          return (
            <div key={s} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${circleStyle}`}
                >
                  {isDone ? (
                    // Checkmark icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className="text-xs">{idx + 1}</span>
                  )}
                </div>
                <span className={`text-sm whitespace-nowrap ${textStyle}`}>{s}</span>
              </div>
              
              {/* Connector Line (except for last item) */}
              {idx < props.steps.length - 1 && (
                <div className={`mx-4 h-0.5 w-8 rounded md:w-16 ${lineStyle}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Stepper;