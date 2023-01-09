import React from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

// this is duplicate of the code in ConnectionString.jsx but includes file handles
function parseMeta(json_string, baseUrl, fName, metaFileHandle, dataFileHandle) {
  const obj = JSON.parse(json_string); // string to JSON
  return {
    name: fName,
    sampleRate: obj['global']['core:sample_rate'] / 1e6, // in MHz
    dataType: obj['global']['core:datatype'],
    frequency: obj['captures'][0]['core:frequency'] / 1e6, // in MHz
    annotations: obj['annotations'],
    numberOfAnnotation: obj['annotations'].length,
    author: obj['global']['core:author'],
    type: 'file',
    thumbnailUrl: baseUrl + fName + '.png',
    metaFileHandle: metaFileHandle,
    dataFileHandle: dataFileHandle,
  };
}

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

async function handleDirectoryEntry(handle, out, dir) {
  for await (const entry of handle.values()) {
    if (entry.kind === 'file') {
      const file = await entry.getFile();
      if (file.name.split('.').pop() === 'sigmf-meta') {
        // Find the .sigmf-data file to go along with this meta file, and if not found then dont add the meta file
        for await (const val of handle.values()) {
          // FIXME: there might be a bug here when there are multiple files of the same name in diff directories...
          if (val.name === file.name.replace('sigmf-meta', 'sigmf-data')) {
            const json_string = await readFileAsync(file); // grab the metafile text
            out.push(parseMeta(json_string, 'local/', dir + file.name, entry, val));
          }
        }
      }
    }
    if (entry.kind === 'directory') {
      const newHandle = await handle.getDirectoryHandle(entry.name, { create: false });
      await handleDirectoryEntry(newHandle, out, dir + entry.name + '/');
    }
  }
  return out;
}

const LocalFileBrowser = (props) => {
  const navigate = useNavigate();

  const openFile = async () => {
    const [handle1, handle2] = await window.showOpenFilePicker({ multiple: true });
    const file1 = await handle1.getFile();
    const file2 = await handle2.getFile();
    if (file1.name.includes('.sigmf-meta')) {
      props.updateConnectionMetaFileHandle(handle1); // store it in redux
      props.updateConnectionDataFileHandle(handle2); // assume other file is data
      navigate('/spectrogram/' + file2.name); // data file
    } else {
      props.updateConnectionMetaFileHandle(handle2);
      props.updateConnectionDataFileHandle(handle1);
      navigate('/spectrogram/' + file1.name); // data file
    }
  };

  const openDir = async () => {
    const dirHandle = await window.showDirectoryPicker();
    const entries = await handleDirectoryEntry(dirHandle, [], '');
    //console.log(entries);
    props.setRecordingList({ entries: entries }); // updates the parent (App.js) state with the RecordingList
  };

  return (
    <div className="container-fluid">
      <h4 style={{ textAlign: 'center' }}>Browse Local Files</h4>
      <Button onClick={openDir}>Open Local Directory</Button>
      &nbsp; &nbsp; or &nbsp; &nbsp;
      <Button onClick={openFile}>Select 1 .sigmf-meta and 1 .sigmf-data</Button>
      <br />
    </div>
  );
};

export default LocalFileBrowser;
