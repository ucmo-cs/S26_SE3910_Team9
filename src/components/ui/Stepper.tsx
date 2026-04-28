import { row } from "../../styles/layout";

type Props = {
  steps: string[];
  currentIndex: number;
};

function Stepper(props: Props) {
  return (
    <div className="w-full overflow-x-auto overflow-y-visible py-3">
      <div className={`${row} min-w-max gap-1`}>
        {props.steps.map((s, idx) => {
          const isCurrent = idx === props.currentIndex;
          const isDone = idx < props.currentIndex;

          // Dynamic styles based on state
          let circleStyle = "border-slate-300 bg-white text-slate-500";
          let textStyle = "text-slate-500 dark:text-slate-300";
          let lineStyle = "bg-slate-300 dark:bg-slate-700";

          if (isCurrent) {
            circleStyle = "border-teal-600 bg-teal-600 text-white ring-2 ring-teal-200 dark:ring-teal-800";
            textStyle = "text-teal-700 font-semibold dark:text-teal-300";
          } else if (isDone) {
            circleStyle = "border-teal-600 bg-teal-600 text-white";
            textStyle = "text-teal-600 font-medium dark:text-teal-400";
            lineStyle = "bg-teal-600";
          }

          return (
            <div key={s} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${circleStyle}`}
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
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>
                <span className={`text-sm font-medium whitespace-nowrap ${textStyle}`}>{s}</span>
              </div>
              
              {/* Connector Line (except for last item) */}
              {idx < props.steps.length - 1 && (
                <div className={`mx-3 h-1 w-6 rounded md:w-12 transition-colors ${lineStyle}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Stepper;