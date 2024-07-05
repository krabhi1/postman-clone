import TabView from "../../tab/TabView";
import TabItem from "../../tab/TabItem";
import { useShallow } from "zustand/react/shallow";
import { EditorMainTab, useLocalStore } from "../../../store/app.store";
import { EnvTab } from "../tabItems/EnvTab";

export function PanelRight() {
  const { activeTabId, tabs, removeTab } = useLocalStore(
    useShallow((state) => ({
      activeTabId: state.editorActiveTabId,
      tabs: state.editorTabs,
      removeTab: state.removeEditorTab,
    }))
  );
  function fromIdToIndex(id?: string) {
    return tabs.findIndex((tab) => tab.id === id);
  }

  function fromIndexToId(index: number) {
    return tabs[index].id;
  }

  function RenderTabContent(tab: EditorMainTab) {
    if (tab.type === "ENV" || tab.type === "GLOBAL_ENV") {
      return <EnvTab id={tab.id} isGlobal={tab.type === "GLOBAL_ENV"} />;
    }
    return "No Render for type " + tab.type;
  }

  function handleCloseTab(i: number) {
    const id = fromIndexToId(i);
    removeTab(id);
    console.log(i, id);
  }

  return (
    <TabView
      onTabClose={handleCloseTab}
      onTabChange={(i) => {}}
      activeIndex={fromIdToIndex(activeTabId)}
    >
      {tabs.map((tab) => (
        <TabItem closable={false} key={tab.id} header={tab.name}>
          <RenderTabContent {...tab} />
        </TabItem>
      ))}
    </TabView>
  );
}
