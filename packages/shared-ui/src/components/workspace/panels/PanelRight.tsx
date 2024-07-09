import TabView from "../../tab/TabView";
import TabItem from "../../tab/TabItem";
import { useShallow } from "zustand/react/shallow";
import { EditorTabItemState, useLocalStore } from "../../../store/app.store";
import { EnvViewer } from "../viewer/EnvViewer";
import RequestViewer from "../viewer/RequestViewer";

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

  function RenderTabContent(tab: EditorTabItemState) {
    if (tab.type === "ENV" || tab.type === "GLOBAL_ENV") {
      return <EnvViewer id={tab.id} isGlobal={tab.type === "GLOBAL_ENV"} />;
    }
    if (tab.type === "REQUEST") {
      return (
        <RequestViewer
          id={tab.id}
          collectionId={tab.data.collectionId}
          method={tab.data.subtype}
        />
      );
    }
    return "No Viewer for type " + tab.type + " " + JSON.stringify(tab);
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
