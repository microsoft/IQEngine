// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useEffect, useState } from 'react';
import Directory from './FileBrowser/Directory';
import Spinner from 'react-bootstrap/Spinner';

function isFolder(file) {
  return file.name.endsWith('/');
}

function GroupByFolder(files, root) {
  const fileTree = {
    contents: [],
    children: [],
  };

  files.map((file) => {
    file.relativeKey = file.name.substr(root.length);
    let currentFolder = fileTree;
    const folders = file.relativeKey.split('/');
    folders.forEach((folder, folderIndex) => {
      if (folderIndex === folders.length - 1 && isFolder(file)) {
        for (const key in file) {
          currentFolder[key] = file[key];
        }
      }
      if (folder === '') {
        return;
      }
      const isAFile = !isFolder(file) && folderIndex === folders.length - 1;
      if (isAFile) {
        currentFolder.contents.push({
          ...file,
          keyDerived: true,
          type: 'file',
          name: file.name.replaceAll('/', '(slash)'), // because we cant use slashes in the url, we undo this replace before grabbing the blob, as well as displaying it in the table
        });
      } else {
        if (folder in currentFolder.children === false) {
          currentFolder.children[folder] = {
            contents: [],
            children: [],
            type: 'folder',
          };
        }
        currentFolder = currentFolder.children[folder];
      }
    });
    return file;
  });

  function addAllChildren(level, prefix) {
    if (prefix !== '') {
      prefix += '/';
    }
    let files = [];
    for (const folder in level.children) {
      //console.log('children');
      //console.log(folder);
      files.push({
        ...level.children[folder],
        contents: undefined,
        keyDerived: true,
        name: folder,
        relativeKey: prefix + folder + '/',
        children: addAllChildren(level.children[folder], prefix + folder),
      });
    }
    files = files.concat(level.contents);
    return files;
  }

  files = addAllChildren(fileTree, '');
  return files;
}

export default function RecordingsBrowser(props) {
  const { recording, updateConnectionMetaFileHandle, updateConnectionDataFileHandle, updateConnectionRecording } = props;
  const data = recording.recordingsList;

  const [currentFolder, setCurrentFolder] = useState('root');
  const [load, toggleLoader] = useState(recording.loading || false);
  useEffect(() => {
    toggleLoader(recording.loading);
  }, [recording.loading]);

  const gfiles = data.map((data) => data.name);
  let dataTree = [];
  let currentDataTree = [];

  if (gfiles.length > 0) {
    dataTree = GroupByFolder(data, '');
    dataTree = { children: dataTree, name: 'root', type: 'folder' };
    // find the portion corresponding to current folder
    function findCurrentFolder(x) {
      // 1 layer deep (TODO: Make recursive)
      if (x.name === currentFolder) {
        x.parentName = 'root';
        return x;
      }
      // 2 layers deep
      for (const child of x.children) {
        if (child.type === 'folder') {
          if (child.name === currentFolder) {
            child.parentName = x.name;
            return child;
          }
        }
      }
      // 3 layers deep
      for (const child of x.children) {
        if (child.type === 'folder') {
          for (const c of child.children) {
            if (c.name === currentFolder) {
              c.parentName = child.name;
              return c;
            }
          }
        }
      }
    }
    currentDataTree = findCurrentFolder(dataTree);

    // remove all children from folders in currentDataTree so they dont show up
    for (let i = 0; i < currentDataTree.children.length; i++) {
      if (currentDataTree.children[i].type === 'folder') {
        currentDataTree.children[i].children = [];
      }
    }
  }

  // Hide menu if the data hasnt loaded yet
  if (currentDataTree.length === 0) {
    return <></>;
  }

  return (
    <div className="container-fluid" style={{ width: '90%' }}>
      {load ? (
        <Spinner animation="border" variant="light" style={{ width: '25em', height: '25em', margin: '10em 0 0 32em' }} />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Spectrogram</th>
              <th style={{ width: '25%' }}>Recording Name</th>
              <th style={{ textAlign: 'center' }}>Data Type</th>
              <th style={{ textAlign: 'center' }}>Freq [MHz]</th>
              <th style={{ textAlign: 'center' }}>Sample Rate [MHz]</th>
              <th style={{ textAlign: 'center' }}># of Annotations</th>
              <th style={{ width: '10%' }}>Author</th>
              <th style={{ width: '10%' }}>Email</th>
            </tr>
          </thead>
          <tbody>
            <Directory
              key={Math.random()}
              item={currentDataTree}
              updateConnectionMetaFileHandle={updateConnectionMetaFileHandle}
              updateConnectionDataFileHandle={updateConnectionDataFileHandle}
              updateConnectionRecording={updateConnectionRecording}
              setCurrentFolder={setCurrentFolder}
              currentFolder={currentFolder}
            />
          </tbody>
        </table>
      )}
    </div>
  );
}
