import React, { useState } from 'react';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';
import './FileUploadPopup.css';
import { generateClient } from 'aws-amplify/api';
import { uploadData } from 'aws-amplify/storage';
const client = generateClient();

const FileUploadPopup = ({ onClose, folderId, userId }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!files.length) return;

    setUploading(true);
    try {
      for (const file of files) {
        const createDetails = {
          name: file.name,
          ownerId: userId,
          description: '',
          folderId: folderId, 
          url: '',
          version: 1,
        };

        const response = await client.graphql({
          query: mutations.createFile,
          variables: { input: createDetails },
        });

        const createdFile = response.data.createFile;
        if (!createdFile) {
          throw new Error('File creation failed');
        }

        const result = await uploadData({
          key: `/${userId}/${file.name}`,
          data: file,
        }).result;

        const updateFileDetails = {
          id: createdFile.id,
          url: result?.key,
        };

        await client.graphql({
          query: mutations.updateFile,
          variables: { input: updateFileDetails },
        });

      }
      alert('Files successfully uploaded!');
      setFiles([]); 
      onClose(); 
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Remove a selected file
  const handleFileRemove = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  return (
    <div className="file-upload-popup-overlay">
      <div className="file-upload-popup">
        <h2 className="text-lg font-semibold mb-4">Upload Files to Folder</h2>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full text-gray-700 mb-4"
        />

        <div className="selected-files-list mb-4">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between mb-2">
              <span className="text-gray-700">{file.name}</span>
              <button
                onClick={() => handleFileRemove(index)}
                className="text-red-500 hover:text-red-700 transition duration-200"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Upload and Close Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleFileUpload}
            disabled={uploading || !files.length}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadPopup;
