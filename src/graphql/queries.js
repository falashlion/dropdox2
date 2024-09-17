/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getFile = /* GraphQL */ `
  query GetFile($id: ID!) {
    getFile(id: $id) {
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
export const listFiles = /* GraphQL */ `
  query ListFiles(
    $filter: ModelFileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        url
        ownerId
        folderId
        version
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getFolder = /* GraphQL */ `
  query GetFolder($id: ID!) {
    getFolder(id: $id) {
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
export const listFolders = /* GraphQL */ `
  query ListFolders(
    $filter: ModelFolderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFolders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        ownerId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const filesByOwnerId = /* GraphQL */ `
  query FilesByOwnerId(
    $ownerId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelFileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    filesByOwnerId(
      ownerId: $ownerId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        description
        url
        ownerId
        folderId
        version
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const filesByFolderId = /* GraphQL */ `
  query FilesByFolderId(
    $folderId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelFileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    filesByFolderId(
      folderId: $folderId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        description
        url
        ownerId
        folderId
        version
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const foldersByOwnerId = /* GraphQL */ `
  query FoldersByOwnerId(
    $ownerId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelFolderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    foldersByOwnerId(
      ownerId: $ownerId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        ownerId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
