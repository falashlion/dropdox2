import React from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator, ThemeProvider, createTheme, View, Image, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import logo from './assets/images/dropbox-logo.png'

import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import './App.css';
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
            return (
              <>
            <div>
              <button className="signout-button" onClick={signOut}>Sign out</button>
             <img src={logo} className='logo' alt="dropbox-logo" />
              <h2 className="welcome" >Dropbox</h2>
              <h3 className="info">UPLOAD AND MANAGE FILES </h3>
              <FileUpload />
              <FileList />
            </div>
            </>
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
