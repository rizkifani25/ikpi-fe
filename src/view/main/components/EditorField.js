import React from 'react';
import ReactQuill from 'react-quill';
import EditorToolbar, { modules, formats } from './EditorToolbar';

const EditorField = ({ fieldId, value, onChange }) => {
  return (
    <>
      <EditorToolbar fieldId={fieldId} />
      <ReactQuill
        theme="snow"
        modules={modules(fieldId)}
        formats={formats}
        value={value}
        onChange={onChange}
        style={{ width: '100%', minHeight: 150 }}
      />
    </>
  );
};

export default EditorField;
