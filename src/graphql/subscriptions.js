/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
      id
      username
      email
      phone
      fullName
      avatar
      files {
        nextToken
        __typename
      }
      folders {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      id
      username
      email
      phone
      fullName
      avatar
      files {
        nextToken
        __typename
      }
      folders {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      id
      username
      email
      phone
      fullName
      avatar
      files {
        nextToken
        __typename
      }
      folders {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateFile = /* GraphQL */ `
  subscription OnCreateFile($filter: ModelSubscriptionFileFilterInput) {
    onCreateFile(filter: $filter) {
      id
      name
      description
      url
      ownerId
      owner {
        id
        username
        email
        phone
        fullName
        avatar
        createdAt
        updatedAt
        __typename
      }
      folderId
      folder {
        id
        name
        ownerId
        createdAt
        updatedAt
        __typename
      }
      version
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateFile = /* GraphQL */ `
  subscription OnUpdateFile($filter: ModelSubscriptionFileFilterInput) {
    onUpdateFile(filter: $filter) {
      id
      name
      description
      url
      ownerId
      owner {
        id
        username
        email
        phone
        fullName
        avatar
        createdAt
        updatedAt
        __typename
      }
      folderId
      folder {
        id
        name
        ownerId
        createdAt
        updatedAt
        __typename
      }
      version
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteFile = /* GraphQL */ `
  subscription OnDeleteFile($filter: ModelSubscriptionFileFilterInput) {
    onDeleteFile(filter: $filter) {
      id
      name
      description
      url
      ownerId
      owner {
        id
        username
        email
        phone
        fullName
        avatar
        createdAt
        updatedAt
        __typename
      }
      folderId
      folder {
        id
        name
        ownerId
        createdAt
        updatedAt
        __typename
      }
      version
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateFolder = /* GraphQL */ `
  subscription OnCreateFolder($filter: ModelSubscriptionFolderFilterInput) {
    onCreateFolder(filter: $filter) {
      id
      name
      ownerId
      owner {
        id
        username
        email
        phone
        fullName
        avatar
        createdAt
        updatedAt
        __typename
      }
      files {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateFolder = /* GraphQL */ `
  subscription OnUpdateFolder($filter: ModelSubscriptionFolderFilterInput) {
    onUpdateFolder(filter: $filter) {
      id
      name
      ownerId
      owner {
        id
        username
        email
        phone
        fullName
        avatar
        createdAt
        updatedAt
        __typename
      }
      files {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteFolder = /* GraphQL */ `
  subscription OnDeleteFolder($filter: ModelSubscriptionFolderFilterInput) {
    onDeleteFolder(filter: $filter) {
      id
      name
      ownerId
      owner {
        id
        username
        email
        phone
        fullName
        avatar
        createdAt
        updatedAt
        __typename
      }
      files {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
