import { rowBetween } from "../../styles/layout";
import { h1, muted } from "../../styles/ui";

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

function PageHeader(props: Props) {
  return (
    <div className={rowBetween}>
      <div>
        <div className={h1}>{props.title}</div>
        {props.subtitle ? <div className={muted}>{props.subtitle}</div> : null}
      </div>
      {props.right ? <div>{props.right}</div> : null}
    </div>
  );
}

export default PageHeader;
