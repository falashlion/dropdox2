import React, { useState }  from 'react';
import './DownloadFile.css';
import { downloadData, getUrl } from 'aws-amplify/storage';


const DownloadButton = ({ fileUrl, fileName }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    
    try {
      setLoading(true);
      const downloadResult =  await downloadData({ 
      path: `public/${fileUrl}`,

        }).result;

      const blob = await downloadResult.body.blob();
      console.log(blob);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error downloading file:', error);
  } finally {
    setLoading(false);
  }
  };

  handleDownload();
  return (
    null
  );
};

export default DownloadButton;
