// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useState } from 'react';
import FileRow from './File';
import styled from 'styled-components';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpen from '@mui/icons-material/FolderOpen';

const StyledOpenFolderIcon = styled(FolderOpen)`
  color: orange;
  vertical-align: bottom;
  font-size: 20px !important;
  margin-right: 4px;
`;

const StyledFolderIcon = styled(FolderIcon)`
  color: orange;
  vertical-align: bottom;
  font-size: 20px !important;
  margin-right: 4px;
`;

const Directory = ({ files, updateConnectionMetaFileHandle, updateConnectionDataFileHandle, updateConnectionRecording }) => {
  const [isExpanded, toggleExpanded] = useState(false);
  if (files.type === 'folder') {
    return (
      <>
        <tr>
          <td></td>
          <td className="align-middle">
            <p onClick={() => toggleExpanded(!isExpanded)}>
              {isExpanded ? <StyledOpenFolderIcon /> : <StyledFolderIcon />}
              {files.name}
            </p>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        {isExpanded && files.children.map((item) =>
          <Directory
            key={Math.random()}
            files={item}
            updateConnectionMetaFileHandle={updateConnectionMetaFileHandle}
            updateConnectionDataFileHandle={updateConnectionDataFileHandle}
            updateConnectionRecording={updateConnectionRecording}
          />)}
      </>
    );
  }
  return (
    <>
      <FileRow
        key={Math.random()}
        info={files}
        updateConnectionMetaFileHandle={updateConnectionMetaFileHandle}
        updateConnectionDataFileHandle={updateConnectionDataFileHandle}
        updateConnectionRecording={updateConnectionRecording}
      />
    </>
  );
};

export default Directory;
