import React, { useState, useRef, useEffect } from "react";
import "./UserProfile.css";
import cover from "../assets/images/pexels-magda-ehlers-pexels-3575850.jpg";
import NavBar from "../components/NavBar";
import { fetchUserAttributes } from 'aws-amplify/auth';
import { IoClose } from "react-icons/io5";
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries'; 
import { toast } from "react-toastify";
import { uploadData, getUrl } from 'aws-amplify/storage';

const client = generateClient();

const UserProfile = ({ user, signOut }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [isUserData, setUserData] = useState({});
  const [isUserAttributes, setUserAttributes] = useState({});
  const [formData, setFormData] = useState({});
  const [isFolderAttributes, setFolderAttributes] = useState({});
  const [isFileAttributes, setFileAttributes] = useState({});
  const [isfileUrl , setFileUrl] = useState({});



  const updateAvatar = (event)=> {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFileAttributes(file);
      setSelectedImage(imageUrl);
      setPreviewImage(true);
    }
  }

  // Refs for dropdowns
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);

  // Toggle dropdown
  const toggleDropdown = () => {
    dropdownRef.current.classList.toggle("hidden");
  };

  // Handle outside click to close dropdown
  useEffect(() => {
    handleGetUser();
    const handleOutsideClick = (e) => {
      if (
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        dropdownRef.current.classList.add("hidden");
      }
    };

    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // handling user update
  const handleUserUpdate = async () => {
    try {
      // Log the user attributes object and email field to debug
  
      const userEmail = isUserAttributes.email;
  
      if (userEmail) {
        const response = await client.graphql({
          query: mutations.updateUser,
          variables: {
            input: {
              id: formData.id,          
              fullName: formData.fullName,  
              username: formData.username,  
              email: formData.email,    
              phone: formData.phone, 
            },
            
          },
        });
        
        console.log("GraphQL Response: ", response);
        if (response.errors) {
          console.error("GraphQL Errors: ", response.errors);
          toast.error("User not updated due to an error.");
          return false;
        }
  
        toast.success("Updated successfully!");
        return true;
      } else {
        console.error("User email is not available.");
        toast.error("User not updated: email is missing.");
        return false;
      }
    } catch (error) { 
      console.error("Error during user update: ", error);
      if (error.response) {
        console.error("GraphQL Error Response: ", error.response);
      }
      toast.error("User not updated due to an error.");
      return false;
    }
  };
  

  // get user information 
const handleGetUser = async () => { 

  const users = await fetchUserAttributes();
    setUserAttributes(users);

  const useremail = users.email
    try {
      const variables = {
        limit: 1,
        filter: {
          email: {
            eq: useremail
          } 
        }
      };

    const userdata = await client.graphql({
       query: queries.listUsers,
       variables: variables,
     });
     const data = userdata.data.listUsers.items
     setUserData(data[0]);
     console.log(data[0]);
     
     return data;
    } catch (error) {

    }
  }
    
    // Handle image upload
    const handleImageChange = async () => {
      const file = isFileAttributes;
      if (!file) {
        console.error("No file selected");
        alert("Please select a file to upload.");
        return;
      }
    
      try {
        // Fetch avatar folder
        const folders = await client.graphql({
          query: queries.listFolders,
          variables: {
            filter: {
              name: { eq: 'avatar' }
            },
            limit: 1
          }
        });
    
        let folder;
        if (folders?.data?.listFolders?.items?.length > 0) {
          folder = folders.data.listFolders.items[0];
          console.log("Folder found:", folder);
        } else {
          // Folder doesn't exist, create a new one
          console.log("No folder found with the name 'avatar', creating one...");
          const createFolderDetails = {
            name: 'avatar',
            ownerId: isUserData.id,
          };
          
          const folderResponse = await client.graphql({
            query: mutations.createFolder,
            variables: { input: createFolderDetails },
          });
          folder = folderResponse?.data?.createFolder;
          if (!folder) {
            throw new Error('Folder creation failed');
          }
          console.log("Folder created:", folder);
        }
    
        // Proceed with file upload and creation
        const createDetails = {
          name: file.name,
          ownerId: isUserData.id,
          description: '',
          folderId: folder.id,
          url: '',
          version: 1,
        };
    
        const response = await client.graphql({
          query: mutations.createFile,
          variables: { input: createDetails },
        });
    
        const createdFile = response?.data?.createFile;
        if (!createdFile) {
          throw new Error('File creation failed');
        }
    
        // Upload file data
        const result = await uploadData({
          key: `/${isUserData.id}/avatar/${file.name}`,
          data: file,
        }).result;
        if (!result) {
          throw new Error('File upload failed');
        }
    
        const fileKey = `/${isUserData.id}/avatar/${file.name}`;
        if (fileKey) {
          const getfileUrl = await getUrl({key: fileKey});
          const fileUrl = getfileUrl.url.href;
          console.log(fileUrl);
          setFileUrl(fileUrl)
        
        
        
        // Update user profile with avatar URL
        const updateUserDetails = {
          id: isUserData.id,
          avatar: fileUrl,  
        };
      
        const updateResponse = await client.graphql({
          query: mutations.updateUser,
          variables: { input: updateUserDetails },
        });
      
        // Check if the mutation was successful
        if (!updateResponse?.data?.updateUser) {
          throw new Error('Failed to update user profile');
        }
        console.log("User profile updated successfully with avatar URL:", updateResponse.data.updateUser.avatar);
        
      }
        alert('Profile Image uploaded successfully.');
        window.location.reload();
      } catch (error) {
        console.error('Error during file handling:', error);
        alert('An error occurred while processing the file. Please try again.');
      }
    };
    

  // Close image preview
  const closePreview = () => {
    setPreviewImage(false);
    setSelectedImage(null);
  };

  // Open edit profile modal
  const handleEditProfile = () => {
    setFormData({
      id: isUserData.id,
      fullName: isUserData.fullName || "",
      username: isUserData.username || "",
      email: isUserData.email || "",
      phone: isUserData.phone || "",
    });
    setEditProfile(true);
  };

  // Close edit profile modal
  const closeEditProfile = () => {
    setEditProfile(false);
  };

  // Handle form input change
  const handleFormChange = (event) => {
    const { name, value } = event.target;
  setFormData({ ...formData, [name]: value });
  };



  return (
    <div className="flex flex-col pl-36">
      <NavBar user={user} signOut={signOut} />
      <div className="profile-wrapper">
        <div className="profile-container">
          <div className="overlay"></div>
          <div className="cover-photo">
            <img className="cover-photo" src={cover} alt="Cover Photo" />
          </div>
          <div className="profile-details">
            <div className="profile-photo">
                <img
                  src={
                    isUserData.avatar ||
                    "https://randomuser.me/api/portraits/men/41.jpg"
                  }
                  alt="profile"
                />
            </div>

            <div className="profile-info">
              <h2>{isUserData.fullName}</h2>
              <div className="user-details">
                <p>UserName: {isUserData.username}</p>
                <p>Email: {isUserData.email}</p>
                <p>Phone: {isUserData.phone}</p>
              </div>
              <label
                htmlFor="file-upload"
                className="text-blue-900 cursor-pointer hover:underline"
              >
                Upload Image
              </label>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={updateAvatar}
                  />
                
            </div>

            {/* Dropdown functionality */}
            <div className="dropdown">
            
              <button
                ref={dropdownButtonRef}
                className="dropdown-btn"
                onClick={toggleDropdown}
              >
                ...
              </button>
              <ul
                ref={dropdownRef}
                className="hidden absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg"
              >
                <li className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={handleEditProfile}>
                  Edit Profile
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Preview Image Section */}
        {previewImage && (
          <div className="image-preview">
            <div className="preview-content">
              <img src={selectedImage} alt="Preview" />
              <button onClick={closePreview} className="close-preview-btn">
              <IoClose />
                
              </button>
              <button onClick={handleImageChange} className="change-preview-btn">
                Change
              </button>
            </div>
          </div>
        )}

        {/* Edit Profile Form Modal */}
        {editProfile && (
          <div className="edit-profile-modal">
            <div className="edit-profile-content">
              <h3>Edit Profile</h3>
              <form className="p-8">
                  <input
                    type="text"
                    name="email"
                    value={isUserData.id}
                    onChange={handleFormChange}
                    className="hidden"
                  />
                <label>
                  Name:
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                  />
                </label>
                <label>
                  UserName:
                  <input
                    type="text"
                    name="username"
                    value={isUserData.username}
                    onChange={handleFormChange}
                  />
                </label>
                <label>
                  Phone:
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                </label>
                <button type="button" onClick={handleUserUpdate}>
                  Save
                </button>
                <button type="button" onClick={closeEditProfile}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
