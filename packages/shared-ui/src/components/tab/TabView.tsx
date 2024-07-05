import React, {
  Children,
  Fragment,
  ReactElement,
  ReactNode,
  useEffect,
} from "react";
import TabItem, { TabPanelProps } from "./TabItem";
import "../../styles/tab-list.css";
import CloseIcon from "../../icons/CloseIcon";
import { ReactChildren } from "../../others/utils";

type TabViewProps = ReactChildren & {
  activeIndex?: number;
  onTabChange?: (index: number) => void;
  onTabClose?: (index: number) => void;
  renderEmpty?: () => ReactNode;
};

export default function TabView({
  activeIndex = 0,
  onTabChange,
  children,
  renderEmpty,
  onTabClose,
}: TabViewProps) {
  useEffect(() => {
    console.log("TabView mounted");
  }, []);
  // const [hiddenTabs, setHiddenTabs] = React.useState<(string | number)[]>([]);
  const tabs = Children.toArray(children).filter(
    (e): e is ReactElement<TabPanelProps> => {
      const child = e as ReactElement<TabPanelProps>;
      const closable = child.props.closable || false;

      // for (const key of hiddenTabs) {
      //   if (key === child.key) {
      //     return false;
      //   }
      // }

      if (React.isValidElement(child) && child.type === TabItem && !closable) {
        return true;
      }
      return false;
    }
  ) as ReactElement<any>[];

  const [index, setIndex] = React.useState(activeIndex);

  function handleTabChange(index: number) {
    setIndex(index);
    onTabChange?.(index);
    console.log("Tab changed to", index);
  }

  function handleCloseTab(index: number) {
    // setHiddenTabs([...hiddenTabs, tabs[index].key!]);
    if(!onTabClose) return;
    if (index === activeIndex) {
      // TODO edge cases
      const nextIndex = tabs.length === 1 ? -1 : index === 0 ? 1 : index - 1;
      handleTabChange(nextIndex);
    }
    onTabClose?.(index);
    console.log("Tab closed", index);
  }
  // console.log({ tabs, hiddenTab: hiddenTabs, count: Children.count(children) });

  useEffect(() => {
    handleTabChange(activeIndex);
  }, [activeIndex]);

  const isEmpty = tabs.length === 0;
  console.log(isEmpty);

  if (isEmpty && renderEmpty) {
    return <>{renderEmpty()}</>;
  }

  if (isEmpty) {
    return <div className="tab-list-empty">Empty</div>;
  }

  return (
    <div className="tab-list-parent">
      <div className="tab-list">
        <div className="tab-header">
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
      </div>
      {tabs.length > 0 && tabs[index]}
    </div>
  );
}

export function TabViewExample() {
  return (
    <TabView>
      <TabItem closable={false} header="Tab 1">
        Content 1
      </TabItem>
      <TabItem closable={false} header="Tab 2">
        Content 2
      </TabItem>
      <TabItem closable={false} header="Tab 3">
        Content 3
      </TabItem>
    </TabView>
  );
}
