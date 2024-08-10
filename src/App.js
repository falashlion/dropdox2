import React from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';

import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import './App.css';
Amplify.configure(config);

const App = 
  
          ({ signOut, user }) => {
            return (
              <>
            <div>
              <button className="signout-button" onClick={signOut}>Sign out</button>
              <h2 className="welcome" >Welcome {user.username}</h2>
              <FileUpload />
              <FileList />
              {/* <FileUpload /> */}
            </div>
            </>
          );
        };
          
        

export default withAuthenticator(App);
