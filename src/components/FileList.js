import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listFiles } from '../graphql/queries'; // Adjust the import path as needed
import EditFile from './EditFile';
import DeleteFile from './DeleteFile';
import './FileList.css';
import DownloadButton from './DownloadFile';
const client = generateClient();

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [editingFile, setEditingFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const fileData = await client.graphql({
          query: listFiles,
          variables: { limit: 10 },
        })
        const fileList = fileData.data.listFiles.items;
        setFiles(fileList);
      } catch (error) {
        console.log('Error fetching files:', error);
      }
      setLoading(false);
    };

    fetchFiles();
  }, []);

  const handleEdit = (file) => {
    setEditingFile(file);
  };

  const handleCloseEdit = () => {
    setEditingFile(null);
  };

  return (
    <div className="file-list">
      <h2 className='heading2'>UPLOADED FILES</h2>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="file-link">
                  {file.name}
                </a>
              </td>
              <td>{file.description}</td>
              <td>
                <div className="button-group">
                  <button onClick={() => handleEdit(file)} className="edit-button">
                    Edit
                  </button>
                  <DeleteFile fileId={file.id} />
                  <DownloadButton fileUrl={file.url} fileName={file.name}/> 
                </div>
              </td>
            </tr>
          ))}
        
        </tbody>
      </table>
    )}
      {editingFile && <EditFile file={editingFile} onClose={handleCloseEdit} />}
    </div>
  );
};

export default FileList;
