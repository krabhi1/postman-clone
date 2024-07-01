import React, {
  Children,
  Fragment,
  ReactElement,
  ReactNode,
  useEffect,
} from "react";
import TabPanel, { TabPanelProps } from "./TabPanel";
import "../../styles/tab-list.css";
import CloseIcon from "../../icons/CloseIcon";
import { ReactChildren } from "../../others/utils";

type TabViewProps = ReactChildren & {
  activeIndex?: number;
  onTabChange?: (index: number) => void;
};

export default function TabView({
  activeIndex = 0,
  onTabChange,
  children,
}: TabViewProps) {
  const [hiddenTab, setHiddenTab] = React.useState<ReactNode[]>([]);
  const tabs = Children.toArray(children).filter(
    (e): e is ReactElement<TabPanelProps> => {
      const child = e as ReactElement<TabPanelProps>;
      const closable = child.props.closable || false;

      for (const t of hiddenTab) {
        const tab = t as ReactElement<TabPanelProps>;
        if (tab.key === child.key) {
          return false;
        }
      }

      if (React.isValidElement(child) && child.type === TabPanel && !closable) {
        return true;
      }
      return false;
    }
  );

  const [index, setIndex] = React.useState(activeIndex);

  function handleTabChange(index: number) {
    setIndex(index);
    onTabChange?.(index);
    console.log("Tab changed to", index);
  }

  function handleCloseTab(index: number) {
    setHiddenTab([...hiddenTab, tabs[index]]);
    if (index === activeIndex) {
      // TODO edge cases
      const nextIndex = tabs.length === 1 ? -1 : index === 0 ? 1 : index - 1;
      handleTabChange(nextIndex);
    }
    console.log("Tab closed", index);
  }
  console.log(tabs)

  useEffect(() => {
    handleTabChange(activeIndex);
  }, [activeIndex]);

  return (
    <div className="tab-list-context">
      <div className="tab-list">
        {tabs.map((tab, i) =>
          tab.props.headerTemplate ? (
            <Fragment key={i}>
              {tab.props.headerTemplate?.({
                onClick: () => handleTabChange(i),
                isActive: index === i,
                index: i,
              })}
            </Fragment>
          ) : (
            <div
              className={`changes ${index === i ? "active" : ""}`}
              key={i}
              onClick={() => handleTabChange(i)}
            >
              <span>{tab.props.header || `Item ${i + 1}`}</span>
              {tab.props.closable != undefined && (
                <span
                  className="close-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseTab(i);
                  }}
                >
                  <CloseIcon />
                </span>
              )}
            </div>
          )
        )}
      </div>
      <div>{tabs.length > 0 && tabs[index]}</div>
    </div>
  );
}

export function TabViewExample() {
  return (
    <TabView>
      <TabPanel closable={false} header="Tab 1">Content 1</TabPanel>
      <TabPanel header="Tab 2">Content 2</TabPanel>
      <TabPanel header="Tab 3">Content 3</TabPanel>
    </TabView>
  );
}
