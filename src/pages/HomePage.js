import React, {useState, useEffect} from 'react'
import { fetchUserAttributes } from 'aws-amplify/auth';
import FileList from '../components/FileList';
import NavBar from '../components/NavBar';
import Overlay from './Overlay';
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries'; 
import { toast } from 'react-toastify';

const client = generateClient();

const HomePage = ({user, signOut}) => {

    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [isUserAttributes, setUserAttributes] = useState({});
    const [isUserData, setUserData] = useState({});

     // Function to toggle dropdown
  const toggleDropdown = () => {
    setIsOverlayVisible(true);
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleOverlayClose = () => {
    setIsOverlayVisible(false);
  };
    

  //Handle User creation logic
  const handleCreateUser = async () => {

    const users = await fetchUserAttributes();
    setUserAttributes(users);
    

    if (users) {
      setLoading(true);
  //find if user exist already
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
       
       toast.info(data[0].username)
       return data;
       } catch (error) {
      try {
          const createDetails = { 
            username: user.username,
            email: users.email, 
            phone:users.phone_number ||"",
            fullName:users.name ||'',
           };
          
          const response = await client.graphql({
            query: mutations.createUser,
            variables: { input: createDetails },
          });
          const data = response.data.createUser
          setUserData(data);

          
         setLoading(false);

          if (response.errors) {
            console.error('GraphQL errors:', response.errors);
            setLoading(false);
            return;
          }
        return data;
          }catch(err){
       setLoading(false);
    //  alert('Error while retrieving user');
    }
  }}
  else {
    setLoading(false);}
     return;
  }

  useEffect(() => {
    handleCreateUser();
}, []);

  return (
    <>
    <div className='flex'>
        <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="flex  items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
        </button>

        <div className="flex-1 justify-end p-4 ">
          <div className="flex justify-end ms-3 ">
            <div className='hover:ring-gray-900 rounded-full '>
              <button type="button" className="flex text-sm bg-white rounded-full focus:ring-4 focus:ring-white dark:focus:ring-white " aria-expanded={isDropdownOpen ? "true" : "false"} data-dropdown-toggle="dropdown-user" onClick={toggleDropdown}>
                <div class='flex items-center justify-center space-x-4'>
                
                <img class='w-10 h-10 rounded-full' 
                src={isUserData?.avatar || 'https://pagedone.io/asset/uploads/1704275541.png'}
                alt="Media rounded avatar"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://pagedone.io/asset/uploads/1704275541.png'; 
                }}
                 />
                
                <div class='font-medium'>
                </div>
                </div>
              </button>
            </div>
            
            <div
          className={`z-50 ${
            isDropdownOpen ? "block" : "hidden"
          } my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600`}
          id="dropdown-user"
        >
              <div className="px-4 py-3" role="none">
                <p className="text-sm text-gray-900 dark:text-white" role="none" onClick={<Overlay isVisible={isOverlayVisible} preview={"https://pagedone.io/asset/uploads/1704275541.png"} onClose={handleOverlayClose}/>}>
                  {isUserData?.fullName ||""}
                </p>
                <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                  {isUserData?.email || ""}
                </p>
              </div>
              <ul className="py-1" role="none">
                
                <li>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem" onClick={signOut}>Sign out</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </div>
         <NavBar signOut={signOut}/>


 <div className="p-4 sm:ml-64">
    <FileList user={user.username}/>
 </div> 
</>
  )
}

export default HomePage
