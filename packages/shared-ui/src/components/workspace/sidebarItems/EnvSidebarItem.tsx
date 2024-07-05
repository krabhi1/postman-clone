import { useLiveStore } from "../../../configs/liveblocks.config";
import { useShallow } from "zustand/react/shallow";
import { useLocalStore } from "../../../store/app.store";


export function EnvSidebarItem() {
  const { globalEnv, environments, addEnv } = useLiveStore(
    useShallow((state) => ({
      globalEnv: (state.workspaceState?.globalEnvironment)!,
      environments: (state.workspaceState?.environments)!,
      addEnv: state.addEnvironment,
    }))
  );

  const { addAndOpen } = useLocalStore(
    useShallow((state) => ({
      addAndOpen: state.addEditorTabAndSetAsActive,
    }))
  );
  function openEnv(id: string | undefined, name: string) {
    if (id != undefined) {
      addAndOpen({ id, name, type: "ENV" });
    } else {
      //open global env
      addAndOpen({
        id: globalEnv.id,
        name: globalEnv.name,
        type: "GLOBAL_ENV",
      });
    }
  }
  return (
    <div className="env-panel">
      <button
        onClick={() => {
          addEnv("New Env");
        }}
      >
        New
      </button>
      <button onClick={() => openEnv(undefined, "Globals")}>Global</button>
      <hr />
      {environments.map((env) => (
        <button onClick={() => openEnv(env.id, env.name)} key={env.id}>
          {env.name}
        </button>
      ))}
    </div>
  );
}
