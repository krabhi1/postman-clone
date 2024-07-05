import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceMain from "./WorkspaceMain";
import "../../styles/editor.css"

export default function WorkspaceEditor() {
    return (
        <div className="w-editor">
          <WorkspaceHeader/>
          <WorkspaceMain/>
        </div>
    );
}