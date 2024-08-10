import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createFile, updateFile } from '../graphql/mutations'; 
import { uploadData, getUrl} from 'aws-amplify/storage';
import './FileUpload.css';
const client = generateClient();

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      setLoading(true);
      try {
        const createDetails = {
            name: file.name,
            description: '', 
            url: '',
            owner: '', 
            version: 1, 
          };

        const response = await client.graphql({
          query: createFile,
          variables: { input: createDetails },
        });

        const filers = response.data.createFile;
        if( filers === null ) {
          alert('File upload failed');
          setLoading(false);
          return;
        }

        // Upload file to S3
        const result = await uploadData(
          {
            key: `${file.name}`,
            data: file,
            options: {
            }
          }).result;
       
          const updateFileDetails = {
            id: filers.id,
            url: result?.key
          };

          // Add the file association to the record:
        const updateFiler = await client.graphql({
          query: updateFile,
          variables: { input: updateFileDetails }
        });

        const updatedFile = updateFiler.data.updateFile;
        if (!updatedFile.url) return;
        
        // Retrieve the file's signed URL:
         await getUrl({ key: updatedFile.url });

        alert('File uploaded successfully and metadata saved.');
        window.location.reload();
      } catch (error) {
        console.error('File upload failed', error);
        alert('File upload failed');
        setLoading(false);
      }
    }
  };

  return (
    <div className="file-upload">
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload} disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
    </div>
  );
};

export default FileUpload;
