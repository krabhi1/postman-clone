import BreadCrumb from "../../BreadCrumb";
import TabItem from "../../tab/TabItem";
import TabView from "../../tab/TabView";
import Table from "../../Table";

export function RequestPanel() {
  return (
    <div className="req-panel">
      {/*  BreadCrumb*/}
      <BreadCrumb path="a/b/c/123" />
      {/* input box */}
      <RequestInputBox />
      {/* request tab */}
      <RequestTab />
      {/* query tab */}
    </div>
  );
}

function RequestInputBox() {
  return (
    <div className="input-box">
      <div className="input-area">
        <select>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
        <span></span>
        <input type="text" placeholder="https://example.com" />
      </div>
      <button className="btn primary">Send</button>
    </div>
  );
}

function RequestTab() {
  return (
    <div className="req-tab">
      <TabView >
        <TabItem header="Params" >
          <Table
            headers={["Key", "Value", "Description"]}
            tableData={[
              ["name", "Nitesh", "This is the name of the user"],
              ["age", "23", "This is the age of the user"],
              ["age", "23", "This is the age of the user"],
              ["age", "23", "This is the age of the user"],
              ["age", "23", "This is the age of the user"],
            ]}
          />
        </TabItem>
        <TabItem header="Authorization">Authorization</TabItem>
        <TabItem header="Headers">Headers</TabItem>
        <TabItem header="Body">Body</TabItem>
      </TabView>
    </div>
  );
}
