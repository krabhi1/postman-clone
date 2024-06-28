import React from "react";
import List from "./components/List";
import TabPanel from "./components/tab/TabPanel";
import TabView, {
  HeaderOptions,
  Tab,
  TabView2,
} from "./components/tab/TabView";
import CloseIcon from "./icons/CloseIcon";

function Example({
  title,
  children: component,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="">
      <h3>{title}</h3>
      {component}
    </div>
  );
}
function Ok() {
  return <div>Ok</div>;
}
function Hello(props: { name: string; age: number }) {
  return (
    <div>
      Hello {props.name}
      <Ok />
    </div>
  );
}

export default function App() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [closable, setClosable] = React.useState(false);

  function CustomHeader(name: string, e: HeaderOptions) {
    return (
      <div className={`${e.isActive ? "active" : ""}`} onClick={e.onClick}>
        {name}
      </div>
    );
  }
  const [tabs, setTabs] = React.useState<Tab[]>([
    {
      header: (e) => {
        return CustomHeader("Tab 1", e);
      },
      content: <Hello name="abhi" age={22} />,
      closable: false,
    },
    {
      header: (e) => {
        return CustomHeader("Tab 2", e);
      },
      content: "hello abhi",
      closable: false,
    },
  ]);

  return (
    <List>
      <Example title="test 1">
        <TabView activeIndex={activeIndex} onTabChange={setActiveIndex}>
          <TabPanel header="Tab 1">Tab 1 content</TabPanel>
          <TabPanel header="Tab 2">Tab 2 content</TabPanel>
          <TabPanel header="Tab 3">Tab 3 content</TabPanel>
          <div>hello</div>
          <Hello name="John" age={20} />
        </TabView>
      </Example>
      <Example title="test 2">
        <button onClick={() => setClosable((old) => !old)}>toggle</button>
        <TabView activeIndex={activeIndex}>
          <TabPanel closable={closable}>Tab 1 content</TabPanel>
          <TabPanel
            headerTemplate={(e) => (
              <div
                className={`${e.isActive ? "active" : ""}`}
                onClick={e.onClick}
              >
                Custom Header
              </div>
            )}
          >
            Tab 2 content
          </TabPanel>
          <TabPanel header="Tab 3">Tab 3 content</TabPanel>
        </TabView>
      </Example>

      <Example title="test 3">
        <TabView2
          tabs={tabs}
          activeIndex={1}
          onCloseTab={(i) => {
            setTabs((old) =>
              old.map((tab, index) => {
                if (i == index) {
                  return { ...tab, closable: true };
                }
                return tab;
              })
            );
          }}
        />
      </Example>
    </List>
  );
}
