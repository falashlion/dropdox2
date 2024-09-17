import React from 'react'
import NavBar from './NavBar'
import FileList from './FileList'

const FilesList = ({user, signOut}) => {
  return (
    <> 
    <div className="flex flex-col pl-80 ">
    <NavBar signOut={signOut} className="navbar"/>
    <FileList user={user} className=""/>
    </div>
    </>
  )
}

export default FilesList