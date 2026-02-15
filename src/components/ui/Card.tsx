import { card } from "../../styles/ui";

type Props = {
  children: React.ReactNode;
};

function Card(props: Props) {
  return <div className={card}>{props.children}</div>;
}

export default Card;
