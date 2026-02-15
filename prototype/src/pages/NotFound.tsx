import { Link } from "react-router-dom";
import { page, stack } from "../styles/layout";
import { button, emptyState } from "../styles/ui";

function NotFound() {
  return (
    <div className={page}>
      <div className={stack}>
        <div className={emptyState}>
          Page not found. <Link to="/">Go Home</Link>.
        </div>
        <Link to="/" className={button}>
          Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
