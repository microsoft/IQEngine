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

const Directory = ({ item, updateConnectionMetaFileHandle, updateConnectionDataFileHandle, updateConnectionRecording, setCurrentFolder }) => {
  //const [isExpanded, toggleExpanded] = useState(item.name === 'root'); // expand by default if its the root dir
  const [isExpanded, toggleExpanded] = useState(true);
  if (item.type === 'folder') {
    return (
      <>
        <tr>
          <td></td>
          <td className="align-middle">
            <p
              onClick={() => {
                toggleExpanded(!isExpanded);
                setCurrentFolder(item.name);
                console.log('setting current folder to', item.name);
              }}
            >
              {isExpanded ? <StyledOpenFolderIcon /> : <StyledFolderIcon />}
              {item.name}
            </p>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        {isExpanded &&
          item.children.map((item) => (
            <Directory
              key={Math.random()}
              item={item}
              updateConnectionMetaFileHandle={updateConnectionMetaFileHandle}
              updateConnectionDataFileHandle={updateConnectionDataFileHandle}
              updateConnectionRecording={updateConnectionRecording}
              setCurrentFolder={setCurrentFolder}
            />
          ))}
      </>
    );
  }
  return (
    <>
      <FileRow
        key={Math.random()}
        item={item}
        updateConnectionMetaFileHandle={updateConnectionMetaFileHandle}
        updateConnectionDataFileHandle={updateConnectionDataFileHandle}
        updateConnectionRecording={updateConnectionRecording}
      />
    </>
  );
};

export default Directory;
