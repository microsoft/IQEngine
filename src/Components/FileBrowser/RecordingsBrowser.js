// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import Directory from './Directory';

function isFolder(file) {
  return file.name.endsWith('/');
}

function GroupByFolder(files, root) {
  const fileTree = {
    contents: [],
    children: {},
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
            children: {},
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

export default function RecordingsBrowser({ data, updateConnectionMetaFileHandle, updateConnectionDataFileHandle, updateConnectionRecording }) {
  const gfiles = data.map((data) => data.name);
  let dataTree = [];

  if (gfiles.length > 0) {
    dataTree = GroupByFolder(data, '');
    dataTree = { children: dataTree, name: 'root', type: 'folder' };
  }

  // Hide menu if the data hasnt loaded yet
  if (dataTree.length === 0) {
    return <></>;
  }

  return (
    <div className="container-fluid">
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
            item={dataTree}
            updateConnectionMetaFileHandle={updateConnectionMetaFileHandle}
            updateConnectionDataFileHandle={updateConnectionDataFileHandle}
            updateConnectionRecording={updateConnectionRecording}
          />
        </tbody>
      </table>
    </div>
  );
}
