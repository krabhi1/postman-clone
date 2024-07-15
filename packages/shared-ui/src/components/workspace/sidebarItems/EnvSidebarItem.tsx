import { useLiveStore } from "../../../configs/liveblocks.config";
import { useShallow } from "zustand/react/shallow";
import { useLocalStore } from "../../../store/app.store";
import AddIcon from "../../../icons/AddIcon";
import { useMemo, useRef, useState } from "react";
import MoreHoriIcon from "../../../icons/MoreHoriIcon";
import { Menu, MenuHandle } from "../../Menu";
import { Environment } from "common-utils/types";

export function EnvSidebarItem() {
  const { globalEnv, environments, addEnv, deleteEnv, duplicateEnv } =
    useLiveStore(
      useShallow((state) => ({
        globalEnv: state.workspaceState?.globalEnvironment!,
        environments: state.workspaceState?.environments!,
        addEnv: state.addEnvironment,
        deleteEnv: state.deleteEnv,
        duplicateEnv: state.duplicateEnv,
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
  const [filter, setFilter] = useState("");

  const filteredEnvs = useMemo(() => {
    return environments.filter((env) =>
      env.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [environments, filter]);

  const [hoveItemId, setHoverItemId] = useState<string | undefined>(undefined);
  const [activeItemId, setActiveItemId] = useState<string | undefined>(
    undefined
  );
  const targetRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<MenuHandle>(null);
  const [menuItems, setMenuItems] = useState<string[]>([
    "delete",
    "duplicate",
    "rename",
  ]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetMenuEnv, setTargetMenuEnv] = useState<Environment>();
  function handleMenuItemSelect(item: string) {
    if (targetMenuEnv) {
      switch (item) {
        case "delete":
          deleteEnv(targetMenuEnv.id);
          break;
        case "duplicate":
          duplicateEnv(targetMenuEnv.id);
          break;
        case "rename":
          break;
      }
    }
  }
  function onMoreClick(env: Environment) {
    setTargetMenuEnv(env);
    const rect = targetRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({ x: rect.left, y: rect.top });
    }
    menuRef.current?.toggle();
  }
  return (
    <>
      <div className="env-panel">
        {/* add new collection & filter */}
        <div className="add-new">
          <span
            className="icon"
            onClick={() => {
              addEnv("New Env");
            }}
          >
            <AddIcon />
          </span>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            type="text"
            className="in"
          />
        </div>
        {/* globals */}
        <div
          className={` globals env-list-item ${globalEnv.id === activeItemId ? "active" : ""} `}
          onClick={(e) => {
            setActiveItemId(globalEnv.id);
            openEnv(undefined, "Globals");
          }}
          onMouseEnter={() => {
            setHoverItemId(globalEnv.id);
          }}
        >
          <span>Globals</span>
        </div>
        {/* line */}
        <hr />
        {/* list of envs */}
        {filteredEnvs.map((env) => {
          const isHover = hoveItemId === env.id;
          return (
            <div
              className={`env-list-item ${env.id === activeItemId ? "active" : ""} `}
              key={env.id}
              onClick={(e) => {
                setActiveItemId(env.id);
                openEnv(env.id, env.name);
              }}
              onMouseEnter={() => {
                setHoverItemId(env.id);
              }}
            >
              <span>{env.name}</span>
              <span
                className="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoreClick(env);
                }}
                ref={isHover ? targetRef : undefined}
              >
                <MoreHoriIcon />
              </span>
            </div>
          );
        })}
      </div>
      <Menu
        onItemSelect={handleMenuItemSelect}
        ref={menuRef}
        items={menuItems}
        position={position}
      />
    </>
  );
}
