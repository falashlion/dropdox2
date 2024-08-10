import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { uploadData, remove} from 'aws-amplify/storage';
import { updateFile } from '../graphql/mutations'; 
import './EditFile.css';
const client = generateClient();

const EditFile = ({ file, onClose }) => {
  const [name, setName] = useState(file.name);
  const [description, setDescription] = useState(file.description);
  const [loading, setLoading] = useState(false);
  const [fileUpdate, setFileUpdate] = useState(null);

  const handleChange = (event) => {
    setFileUpdate(event.target.files[0]);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {

      if(fileUpdate){
        // Upload file to S3
        const result = await uploadData(
          {
            key: `${fileUpdate.name}`,
            data: fileUpdate,
            options: {
            }
          }).result;

          const updateFileDetails = {
            id: file.id,
            url: result?.key
          };

          // Add the file association to the record:
         await client.graphql({
          query: updateFile,
          variables: { input: updateFileDetails }
        });

        await remove({ key: file.url });
      }
      await client.graphql({
        query: updateFile,
        variables: {
          input: {
            id: file.id,
            name,
            description,
          },
        },
      });
      alert('File updated successfully');
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error updating file:', error);
      alert('File update failed');
      window.location.reload();
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-file-modal">
      <div className="edit-file-content">
        <h2>Edit File</h2>
        <label class="input-label">
          Name:
          <input
            type="text"
            class="input-text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
        <input type="file" class="input-file" onChange={handleChange} />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button onClick={handleUpdate} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditFile;
