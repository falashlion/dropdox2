import React from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator, ThemeProvider, createTheme, View, Image, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import logo from './assets/images/dropbox-logo.png'
import * as ReactDOM from "react-dom/client";
import NotFoundPage from './components/NotFoundPage';
import FileUploadComponent from "./components/FileUploadPopup";
import {
  Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate
} from "react-router-dom";
import FileUpload from './components/FileUpload';
import FilesList from './components/FilesList';
import Folders from './components/Folders';
import './App.css';
import HomePage from './pages/HomePage';
import UserProfile from './pages/UserProfile';
Amplify.configure(config);

const theme = createTheme({
  name: 'custom-theme',
  tokens: {
    colors: {
      background: { primary: { value: '#f7f7f7' } }, 
      font: { primary: { value: '#333333' } }, 
      border: { primary: { value: '#e6e6e6' } }, 
      brand: { primary: { value: '#0061ff' } }, 
    },
    components: {
      authenticator: {
        container: {
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});


const App = 
          ({ signOut, user }) => {
            const router = createBrowserRouter(
              createRoutesFromElements(
                <>
                <Route path='/' element={<HomePage signOut={signOut} user={user}/>}/>
                <Route path='/upload' element={<FileUpload user={user}/>}/>
                <Route path='/files' element={<FilesList user={user.username} signOut={signOut}  />}/>
                <Route path='/folders' element={<Folders user={user}/>}/> 
                <Route path='/user' element={<UserProfile signOut={signOut} user={user}/>}/>
                <Route path='/folderp' element={<FileUploadComponent/>}/>

                <Route path="*" element={<NotFoundPage />} />
                </>
              ));
            return (
            <RouterProvider
              router={router}
              // onNavigate={(location) => handleNavigation(location.pathname)}
            />
            
          );
        };
          
        
        export default withAuthenticator(App, {
          components: {
            Header() {
              return (
                <View textAlign="center" padding="large">
                  <Image src={logo} className='login-logo' alt="Dropbox Logo" />
                  <Heading level={3}>Welcome To My Dropbox</Heading>
                </View>
              );
            },
          },
          theme: theme,
        });
