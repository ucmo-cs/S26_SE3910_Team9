import { row } from "../../styles/layout";
import { pill } from "../../styles/ui";

type Props = {
  steps: string[];
  currentIndex: number; // 0-based
};

function Stepper(props: Props) {
  return (
    <div className={row}>
      {props.steps.map((s, idx) => {
        const isCurrent = idx === props.currentIndex;
        const isDone = idx < props.currentIndex;

        const tone = isCurrent
          ? "bg-slate-900 text-white border-slate-900"
          : isDone
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-white text-slate-600 border-slate-200";

        return (
          <span key={s} className={`${pill} ${tone}`}>
            {idx + 1}. {s}
          </span>
        );
      })}
    </div>
  );
}

export default Stepper;
