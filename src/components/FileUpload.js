import React, { useState, useEffect, useRef } from 'react';
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';
import { uploadData, getUrl } from 'aws-amplify/storage';
import NavBar from './NavBar';
import './FileUpload.css';
import { fetchUserAttributes } from 'aws-amplify/auth';

const client = generateClient();

const FileUpload = ({ user }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUserAttributes, setUserAttributes] = useState({});
  const [isUserData, setUserData] = useState({});
  const [isFolderAttributes, setFolderAttributes] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      handleGetUser(); 
    }
  }, [user]);

  // Handle input file change
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // Handle upload button click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!isUserData.id) {
      alert('User data not loaded yet. Please wait.');
      return;
    }

    try {
      const folders = await client.graphql({
        query: queries.listFolders,
        variables: { limit: 1 }
      });

      const folder = folders.data.listFolders?.items[0];

      if (folder) {
        setFolderAttributes(folder);
      } else {
        // Create initial public folder if none exists
        const createFolderDetails = {
          name: 'public',
          ownerId: isUserData.id,
        };

        const folderResponse = await client.graphql({
          query: mutations.createFolder,
          variables: { input: createFolderDetails },
        });
        setFolderAttributes(folderResponse.data.createFile);
      }
    } catch (error) {
      console.error('Error creating or fetching folder:', error);
    }

    if (files.length === 0) {
      alert('No files selected.');
      return;
    }

    setLoading(true);

    try {
      for (const file of files) {
        const createDetails = {
          name: file.name,
          ownerId: isUserData.id,
          description: '',
          folderId: isFolderAttributes?.id, // Ensure folder is set
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
          key: `/${isUserData.id}/${file.name}`,
          data: file,
        }).result;

        if(result){
          const fileurl = await getUrl({
            key:result.key,
          });
          
         const Url = fileurl.url.href;

          const updateFileDetails = {
            id: createdFile.id,
            url: Url,
          };
  
          await client.graphql({
            query: mutations.updateFile,
            variables: { input: updateFileDetails },
          });
        }

        

        
      }

      alert('Files uploaded successfully.');
      window.location.reload();
    } catch (error) {
      console.error('File upload failed:', error);
      alert('File upload failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle drag events
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // Handle file removal
  const handleRemoveFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter(file => file.name !== fileName));
  };

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
  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm">
        <NavBar />
        <main className="container mx-auto w-full h-full sm:w-3/4 md:w-2/3 lg:w-7/12 xl:w-8/12 pl-40">
          <article aria-label="File Upload Modal" className="relative h-full w-full flex flex-col bg-white shadow-xl rounded-md">
            <div
              id="overlay"
              className="w-full h-full absolute top-0 left-0 pointer-events-none z-50 flex flex-col items-center justify-center rounded-md"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <i>
                <svg
                  className="fill-current w-12 h-12 mb-3 text-blue-700"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z" />
                </svg>
              </i>
              <p className="text-lg text-blue-700">Drop files to upload</p>
            </div>

            <section className="h-full overflow-auto p-8 w-full h-full flex flex-col"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            >
              <header className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center"
              onClick={handleButtonClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              >
                <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                  <span>Drag and drop your files anywhere or</span>
                </p>
                <input
                  id="hidden-input"
                  type="file"
                  multiple
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <button
                  id="button"
                  className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-400"
                  onClick={handleButtonClick}
                >
                  Upload a file
                </button>
              </header>

              <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">
                To Upload
              </h1>

              {/* Preview section */}
              <ul id="gallery" className="flex flex-1 flex-wrap -m-1">
                {files.length === 0 ? (
                  <li id="empty" className="h-full w-full text-center flex flex-col items-center justify-center">
                    <img
                      className="mx-auto w-32"
                      src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                      alt="no data"
                    />
                    <span className="text-small text-gray-500">No files selected</span>
                  </li>
                ) : (
                  files.map((file, index) => (
                    <li key={index} className="block p-1 w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-1/8 h-24">
                      <article className="group hasImage w-full h-full rounded-md bg-gray-100 cursor-pointer relative text-transparent hover:text-white shadow-sm">
                        <img
                          alt={file.name}
                          className="img-preview w-full h-full object-cover rounded-md"
                          src={URL.createObjectURL(file)}
                        />
                        <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
                          <h1 className="flex-1">{file.name}</h1>
                          <div className="flex">
                            <button
                              className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md"
                              onClick={() => handleRemoveFile(file.name)}
                            >
                              <svg
                                className="pointer-events-none fill-current w-4 h-4 ml-auto"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                              >
                                <path d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" />
                              </svg>
                            </button>
                          </div>
                        </section>
                      </article>
                    </li>
                  ))
                )}
              </ul>
            </section>

            <footer className="flex justify-end px-8 pb-8 pt-4">
              <button
                id="submit"
                className="rounded-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white focus:shadow-outline focus:outline-none"
                onClick={handleUpload}
              >
                Submit
              </button>
              <button
                id="cancel"
                className="ml-3 rounded-md px-3 py-1 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                onClick={() => setFiles([])}
              >
                Cancel
              </button>
            </footer>
          </article>
        </main>
      </div>
    </>
  );
};

export default FileUpload;
