import Header from "./Header";
import Main from "./Main";
import "../../styles/editor.css"

export default function WorkspaceEditor() {
    return (
        <div className="w-editor">
          <Header/>
          <Main/>
        </div>
    );
}