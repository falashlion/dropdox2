import React, { useRef, useEffect, useState } from 'react';
import './Folders.css';
import NavBar from './NavBar';
import folderImg from '../assets/images/folders-svgrepo-com.svg';
import FolderCreate from './FolderCreate';
import FileList from './FileList';
import { Link } from 'react-router-dom';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';
import { generateClient } from 'aws-amplify/api';
import { fetchUserAttributes } from 'aws-amplify/auth';
import FileUploadPopup from './FileUploadPopup';

const client = generateClient();

const Folders = ({ user }) => {
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [isUserAttributes, setUserAttributes] = useState({});
  const [isUserData, setUserData] = useState({});
  const [isFolderData, setFolderData] = useState([]);
  const [showAllFolders, setShowAllFolders] = useState(false); 
  const [showFileUploadPopup, setShowFileUploadPopup] = useState(false); // New state for showing popup
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  useEffect(() => {
    if (user) {
      handleGetUser();
    }
  }, [user]);

  useEffect(() => {
    if (isUserData.id) {
      getFolders();
    }
  }, [isUserData]);

  const handleCloseEdit = () => {
    setCreatingFolder(false); 
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

  const getFolders = async () => {
    console.log(isUserData.id);
    try {
      // Attempt to fetch folders from the GraphQL API
      const folders = await client.graphql({
        query: queries.foldersByOwnerId,
        variables: {
          ownerId: isUserData.id
        }
      });
  
      if (folders?.data?.foldersByOwnerId?.items) {
        const foldersData = folders.data.foldersByOwnerId.items;
        setFolderData(foldersData);
      } else {
        console.error('Unexpected response format', folders);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };
  

  // Display a limited number of folders
  const displayedFolders = showAllFolders ? isFolderData : isFolderData.slice(0, 8);

   // Function to handle folder deletion
   const handleDeleteFolder = async (folderId) => {
    try {
      await client.graphql({
        query: mutations.deleteFolder,
        variables: { input: { id: folderId } },
      });
      // Remove the deleted folder from the state
      setFolderData((prev) => prev.filter((folder) => folder.id !== folderId));
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  
  // Function to open popup when folder image is clicked
  const handleFolderClick = (folderId) => {
    setSelectedFolderId(folderId);
    setShowFileUploadPopup(true); // Show the file upload popup
  };
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col pl-64">
        {/* Navbar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center"></header>
        <NavBar />

        {/* Main Content */}
        <div className="flex-1 p-6 flex flex-col ">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-700">Folders</h2>
            <div>
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200 mr-4"
                onClick={() => setCreatingFolder(true)} // Open the folder create popup
              >
                + New Folder
              </button>
              <Link to="/upload" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
                Upload Files
              </Link>
            </div>
          </div>

          {/* Folder Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Folder Card */}
            {displayedFolders.map((folder) => (
              <div className="space-x-4 bg-white shadow-sm rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition duration-200" key={folder.id}>
                <div className="flex items-center space-x-2 p-2">
                <img
                    className="cursor-pointer" 
                    src={folderImg}
                    alt="folder"
                    onClick={() => handleFolderClick(folder.id)} 
                  />
                  <span className="ml-4 text-gray-700 flex-grow text-wrap">{folder.name}</span>
                </div>
                <div className="flex space-x-4">
                  {/* Eye Icon for Viewing Folder */}
                   <button className="text-gray-500 hover:text-gray-700 transition duration-200 hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12c0-2.761-2.239-5-5-5S5 9.239 5 12s2.239 5 5 5 5-2.239 5-5zm5 0c0-3.038-2.462-5.5-5.5-5.5S9 8.962 9 12s2.462 5.5 5.5 5.5S20 15.038 20 12z"
                      />
                    </svg>
                  </button> 
                  {/* Delete Icon for Deleting Folder */}
                  <button
                    className="text-red-500 hover:text-red-700 transition duration-200 top-0"
                    onClick={() => handleDeleteFolder(folder.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 20 20"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Show "More" button if there are more than 8 folders */}
          {isFolderData.length > 8 && (
            <div className="mt-4">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                onClick={() => setShowAllFolders(!showAllFolders)}
              >
                {showAllFolders ? 'Show Less' : 'Show More'}
              </button>
            </div>
          )}

          {/* File List */}
          <FileList user={user.username} />

          {/* Show FolderCreate modal */}
          {creatingFolder && <FolderCreate onClose={handleCloseEdit} userId={isUserData.id} />}

          {/* Show FileUploadPopup when image is clicked */}
          {showFileUploadPopup && (
            <FileUploadPopup onClose={() => setShowFileUploadPopup(false)} folderId={selectedFolderId} userId={isUserData.id} />
          )}
        </div>
      </div>
    </>
  );
};

export default Folders;
