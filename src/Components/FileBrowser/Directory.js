// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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

const Directory = ({
  item,
  updateConnectionMetaFileHandle,
  updateConnectionDataFileHandle,
  updateConnectionRecording,
  setCurrentFolder,
  currentFolder,
}) => {
  //const [isExpanded, toggleExpanded] = useState(item.name === 'root'); // expand by default if its the root dir
  if (item.type === 'folder') {
    return (
      <>
        <tr>
          <td></td>
          <td className="align-middle">
            <p
              onClick={() => {
                if (currentFolder === item.name) {
                  setCurrentFolder(item.parentName);
                } else {
                  setCurrentFolder(item.name);
                  console.log('setting current folder to', item.name);
                }
              }}
            >
              {item.name === currentFolder ? <StyledOpenFolderIcon /> : <StyledFolderIcon />}
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
        {item.children.map((item) => (
          <Directory
            key={Math.random()}
            item={item}
            updateConnectionMetaFileHandle={updateConnectionMetaFileHandle}
            updateConnectionDataFileHandle={updateConnectionDataFileHandle}
            updateConnectionRecording={updateConnectionRecording}
            setCurrentFolder={setCurrentFolder}
            currentFolder={currentFolder}
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
