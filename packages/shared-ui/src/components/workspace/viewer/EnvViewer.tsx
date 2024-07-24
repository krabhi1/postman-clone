import Table, { RowData, Column } from "@components/Table";
import { useLiveStore } from "@configs/liveblocks.config";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

export type EnvViewerProps = {
  id: string;
  isGlobal?: boolean;
};
export function EnvViewer(props: EnvViewerProps) {
  const { env, ...liveStore } = useLiveStore(
    useShallow((state) => ({
      env: state.getEnvById(props.id),
      addVar: state.addVariable,
      deleteVar: state.deleteVariable,
      updateVar: state.updateVariable,
    }))
  );
  if (!env) {
    return <div>No Environment</div>;
  }

  const data = useMemo<RowData[]>(() => {
    return env.variables.map((variable) => {
      return {
        data: {
          var: variable.key,
          value: variable.value,
        },
      };
    });
  }, [env]);
  return (
    <div className="env-view">
      <Table
        data={data}
        onAdd={(key, value) => {
          if (key == "var") {
            liveStore.addVar(props.id, value, "");
          }
        }}
        onEdit={(i, key, value) => {
          const variable = env.variables[i];
          if (key == "var") {
            liveStore.updateVar(env.id, variable.id, {
              key: value,
            });
          } else {
            liveStore.updateVar(env.id, variable.id, {
              value: value,
            });
          }
        }}
        onDelete={(i) => {
          liveStore.deleteVar(env.id, env.variables[i].id);
        }}
      >
        <Column field="var" header="Variable" />
        <Column field="value" header="Value" canAdd={false} />
      </Table>
    </div>
  );
}
