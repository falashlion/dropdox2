import React, { useState } from 'react';
import { deleteFile } from '../graphql/mutations';
import { getFile } from '../graphql/queries';
import './DeleteFile.css';
import { remove } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

const DeleteFile = ({ fileId }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {

     const filersp = await client.graphql({
        query: getFile,
        variables: { id: fileId },
      }); 

      console.log(filersp);
      const filers = await filersp.data.getFile;

      const fileKey = filers?.url;

       if(!filers) {
        alert('File not found With Id');
        setLoading(false);
        return;
      }

       await client.graphql({
        query: deleteFile,
        variables: { input: { id: fileId } },
      });

      // // If the record has no associated file, we can return early.
      // if (!filers?.url) return;
      await remove({ key: fileKey }); 

      alert('File deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting file:', error);
      setLoading(false);
      window.location.reload();
      // alert('File delete failed');
    }
  };

  return (
    <button onClick={handleDelete} className="delete-button" disabled={loading}>
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
};

export default DeleteFile;
