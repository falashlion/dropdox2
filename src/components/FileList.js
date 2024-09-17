import React, { useEffect, useState, useRef } from 'react';
import { generateClient } from 'aws-amplify/api';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations'; 
import EditFile from './EditFile';
import './FileList.css';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { remove, downloadData, getUrl } from 'aws-amplify/storage';
import DropdownButton from './DropdownButton';


const client = generateClient();

const FileList = (user) => {
  const [files, setFiles] = useState([]);
  const [editingFile, setEditingFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserData, setUserData] = useState({});
  const [isUserAttributes, setUserAttributes] = useState({});
  const [signedUrls, setSignedUrls] = useState({});
  const [hoveredFile, setHoveredFile] = useState(null); 
  const [loadingImages, setLoadingImages] = useState({});
  const [folderNames, setFolderNames] = useState({});

  // Fetch user information
  const handleGetUser = async () => {
    try {
      const users = await fetchUserAttributes();
      setUserAttributes(users);

      const userEmail = users.email;
      const variables = {
        limit: 1,
        filter: { email: { eq: userEmail } }
      };

      const userdata = await client.graphql({
        query: queries.listUsers,
        variables: variables,
      });

      const data = userdata.data.listUsers.items[0];
      if (data) {
        setUserData(data);
      } else {
        throw new Error('User not found in database');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      handleGetUser();
    }
  }, [user]);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const fileData = await client.graphql({
          query: queries.filesByOwnerId,
          variables: {
            ownerId: isUserData.id,
          },
        });
        const fileList = fileData.data.filesByOwnerId.items;
        setFiles(fileList);

        // Fetch signed URLs for each file
        const signedUrlsMap = {};
        await Promise.all(
          fileList.map(async (file) => {
            const signedUrl = await handleGenerateOneTimeUrl(file.url); 
            signedUrlsMap[file.id] = signedUrl; 
          })
        );
        setSignedUrls(signedUrlsMap); 

      } catch (error) {
        console.log('Error fetching files:', error);
      }
      setLoading(false);
    };

    fetchFiles();
  }, [isUserData]);

  const handleEdit = (file) => {
    setEditingFile(file);
  };

  const handleCloseEdit = () => {
    setEditingFile(null);
  };

  // Create refs for the dropdown button and menu
  const dropdownRefs = useRef([]);

  const toggleDropdown = (index) => {
    dropdownRefs.current[index].classList.toggle('hidden');
  };

  const handleOutsideClick = (e) => {
    dropdownRefs.current.forEach((dropdownMenu) => {
      if (dropdownMenu && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add('hidden');
      }
    });
  };

  useEffect(() => {
    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // Handle file delete
  const handleDelete = async (fileId, fileUrl) => {
    try {
      // First, delete the file record in the GraphQL API
      await client.graphql({
        query: mutations.deleteFile,
        variables: { input: { id: fileId } },
      });

      // Then, remove the actual file from S3
      await remove({ key: fileUrl });

      alert('File deleted successfully');
      window.location.reload(); // Reload the page to refresh the file list
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  // Handle file download
  const handleDownload = async (fileUrl, fileName) => {
    try {
      const downloadResult = await downloadData({ path: `public/${fileUrl}` }).result;
      const blob = await downloadResult.body.blob();
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
    }
  };

  // Generating one-time file links
  const handleGenerateOneTimeUrl = async (fileUrl) => {
    try {
      const expirationTime = 300; 
      const signedUrl = await getUrl({ key: fileUrl, options: { level: 'guest', expiresIn: expirationTime } });
      return signedUrl.url.href; 
    } catch (error) {
      console.error('Error generating one-time URL:', error);
      return ''; 
    }
  };

  const handleImageLoad = (fileId) => {
    setLoadingImages((prev) => ({ ...prev, [fileId]: false }));
  };

  const handleImageLoading = (fileId) => {
    setLoadingImages((prev) => ({ ...prev, [fileId]: true }));
  };

  const getFolderById = async (folderId) => {
    try {
      const folder = await client.graphql({
        query: queries.getFolder,
        variables: { id: folderId }
      });
      return folder.data.getFolder.name;
    } catch (error) {
      console.error('Error fetching folder:');
      return 'Unknown Folder'; // Fallback in case of error
    }
  };

  useEffect(() => {
    const fetchFolderNames = async () => {
      const folderNamesMap = {};
      for (const file of files) {
        if (file.folderId) {
          folderNamesMap[file.folderId] = await getFolderById(file.folderId);
        }
      }
      setFolderNames(folderNamesMap);
    };

    if (files.length > 0) {
      fetchFolderNames();
    }
  }, [files]);

  return (
    <>
      <div className="file-list-container flex">
        <div className="file-list">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Version</th>
                  <th>Actions</th>
                  <th>Generate Link</th>
                  <th>Folder</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, index) => (
                  <tr>
                  <td>
                    <a
                      className="file-link"
                      key={file.id}
                      onMouseEnter={() => {
                        setHoveredFile(file.id);
                        handleImageLoading(file.id); // Set loading state
                      }}
                      onMouseLeave={() => setHoveredFile(null)}
                    >
                      {file.name}
                      {hoveredFile === file.id && (
                        <article className="group hasImage w-24 h-24 rounded-md bg-gray-100 cursor-pointer relative text-transparent hover:text-white shadow-sm">
                          {loadingImages[file.id] && (
                            <div className="loading-spinner">Loading...</div>
                          )}
                          <img
                            alt={file.name}
                            className="img-preview w-24 h-24 object-cover rounded-md"
                            src={file.url }
                            onLoad={() => handleImageLoad(file.id)} 
                          />
                          <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
                            <h1 className="flex-1">{file.name}</h1>
                            <div className="flex"></div>
                          </section>
                        </article>
                      )}
                    </a>
                    </td>
                    <td>{file.description}</td>
                    <td>{file.version}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(index);
                        }}
                        className="text-gray-600 hover:text-gray-800 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-7"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M4 10a2 2 0 100-4 2 2 0 000 4zM10 10a2 2 0 100-4 2 2 0 000 4zM16 10a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>

                      {/* Dropdown menu */}
                      <div
                        ref={(el) => (dropdownRefs.current[index] = el)}
                        className="hidden absolute right mt-2 w-32 bg-white rounded-lg shadow-lg"
                      >
                        <ul className="py-2 text-sm text-gray-700">
                          <li>
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => handleEdit(file)}
                            >
                              Edit
                            </button>
                          </li>
                          <li>
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => handleDelete(file.id, file.url)}
                            >
                              Delete
                            </button>
                          </li>
                          <li>
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => handleDownload(file.url, file.name)}
                            >
                              Download
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                    <td>
                      {/* Generate link logic goes here */}
                      <DropdownButton link={signedUrls[file.id] || file.url} details={file.description} name={file.name} />
                    </td>
                    <td>{folderNames[file.folderId] || 'Loading...'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {editingFile && <EditFile file={editingFile} onClose={handleCloseEdit} />}
        </div>
      </div>
    </>
  );
};

export default FileList;
