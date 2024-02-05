import React, { useState } from "react";

import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({}) => {
//const CodeEditorWindow = ({ onChange, language, code, theme }) => {
//   const [value, setValue] = useState(code || "");

//   const handleEditorChange = (value) => {
//     setValue(value);
//     onChange("code", value);
//   };

  return (
    <div className="Editor-container">
      <Editor
        width={`100%`} 
        // language={language || "javascript"}
        // value={value}
        theme="vs-dark"
        // defaultValue="hello world"
        // onChange={handleEditorChange}
        // className={'Editor-container'}
      />
    </div>
  );
};
export default CodeEditorWindow;