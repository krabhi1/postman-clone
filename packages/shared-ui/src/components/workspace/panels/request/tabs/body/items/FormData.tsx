import Table, { Column, RowData } from "@components/Table";
import { ContentProps } from "../BodyTabItem";
import { useImmer } from "use-immer";

export default function FormData(props: ContentProps) {
  const { body } = props;
  const [data, setData] = useImmer<RowData[]>([]);
  return (
    <Table data={data}>
      <Column header="Key" field="key" />
      <Column canAdd={false} header="Value" field="value" />
    </Table>
  );
}
