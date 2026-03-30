import { Link } from "react-router-dom";
import { page, stack } from "../styles/layout";
import { button, emptyState } from "../styles/ui";

function NotFound() {
  return (
    <div className={page}>
      <div className={stack}>
        <div className={emptyState}>
          Page not found. <Link to="/" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200">Go Home</Link>.
        </div>
        <Link to="/" className={`${button} text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800`}>
          Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
