import React, { useState } from 'react'; 
import './FolderCreate.css';
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../graphql/mutations';
import { uploadData } from 'aws-amplify/storage';

const client = generateClient();

const FolderCreate = ({ onClose, userId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); // Not used, but kept for future
  const [loading, setLoading] = useState(false);
  const [folderAttributes, setFolderAttributes] = useState(null);
  const [error, setError] = useState(null);

  const createFolder = async () => {
    if (!name) {
      setError('Folder name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const createFolderDetails = {
        name: name,
        ownerId: userId,
      };

      // Upload empty data to create the folder structure in AWS Storage
      await uploadData({
        key: `/${userId}/${name}`,
        data: '',
      });

      // Create folder in GraphQL
      const folderResponse = await client.graphql({
        query: mutations.createFolder,
        variables: { input: createFolderDetails },
      });

      if (folderResponse.data?.createFolder) {
        setFolderAttributes(folderResponse.data.createFolder);
        setName(''); 
        onClose(); 
      } else {
        throw new Error('Folder creation failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while creating the folder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-file-modal">
      <div className="edit-file-content">
        <h2>Create Folder</h2>
        {error && <div className="error-message">{error}</div>}
        <label className="input-label">
          Name:
          <input
            type="text"
            className="input-text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </label>
        <button 
          disabled={loading || !name} 
          onClick={createFolder}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button onClick={onClose} disabled={loading}>Cancel</button>
      </div>
    </div>
  );
};

export default FolderCreate;
