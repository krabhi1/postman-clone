import { useShallow } from "zustand/react/shallow";
import { useLiveStore } from "../../../configs/liveblocks.config";
export type EnvTabProps = {
  id: string;
  isGlobal?: boolean;
};
export function EnvTab(props: EnvTabProps) {
  const { env } = useLiveStore(
    useShallow((state) => ({
      env: state.getEnvById(props.id),
    }))
  );
  if (!env) {
    return <div>No Environment</div>;
  }
  return (
    <div>
      {env.id} <br /> {env.variables.toString()}
    </div>
  );
}
