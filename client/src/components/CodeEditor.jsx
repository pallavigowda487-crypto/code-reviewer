import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, setCode, language, theme }) => {
  const handleEditorChange = (value) => {
    setCode(value);
  };

  const monacoTheme = theme === 'dark' ? 'vs-dark' : 'light';

  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      <Editor
        height="500px"
        language={language.toLowerCase()}
        value={code}
        theme={monacoTheme}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'var(--font-mono)',
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          padding: { top: 16 }
        }}
      />
    </div>
  );
};

export default CodeEditor;
