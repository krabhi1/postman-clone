import Table, { Column, RowData } from "@components/Table";
import { ContentProps } from "../BodyTabItem";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import { useRequestContext } from "@components/workspace/viewer/RequestViewer";

export default function FormData(props: ContentProps) {
  const { body } = props;
  const { updateRequestItem: setData } = useRequestContext();
  const data: RowData[] = body.formData.map((item, i) => {
    return {
      data: { key: item.key, value: item.value },
    };
  });

  return (
    <Table
      data={data}
      onAdd={(k, v) => {
        setData((draft) => {
          draft.body.formData.push({
            key: "",
            value: "",
            description: "",
            [k]: v,
          });
        });
      }}
      onEdit={(i, k, v) => {
        setData((draft) => {
          const form = draft.body.formData[i];
          form[k] = v;
        });
      }}
      onDelete={(i) => {
        setData((draft) => {
          draft.body.formData.splice(i, 1);
        });
      }}
    >
      <Column header="Key" field="key" />
      <Column canAdd={false} header="Value" field="value" />
    </Table>
  );
}
