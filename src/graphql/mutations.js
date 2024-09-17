/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createFile = /* GraphQL */ `
  mutation CreateFile(
    $input: CreateFileInput!
    $condition: ModelFileConditionInput
  ) {
    createFile(input: $input, condition: $condition) {
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
export const updateFile = /* GraphQL */ `
  mutation UpdateFile(
    $input: UpdateFileInput!
    $condition: ModelFileConditionInput
  ) {
    updateFile(input: $input, condition: $condition) {
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
export const deleteFile = /* GraphQL */ `
  mutation DeleteFile(
    $input: DeleteFileInput!
    $condition: ModelFileConditionInput
  ) {
    deleteFile(input: $input, condition: $condition) {
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
export const createFolder = /* GraphQL */ `
  mutation CreateFolder(
    $input: CreateFolderInput!
    $condition: ModelFolderConditionInput
  ) {
    createFolder(input: $input, condition: $condition) {
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
export const updateFolder = /* GraphQL */ `
  mutation UpdateFolder(
    $input: UpdateFolderInput!
    $condition: ModelFolderConditionInput
  ) {
    updateFolder(input: $input, condition: $condition) {
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
export const deleteFolder = /* GraphQL */ `
  mutation DeleteFolder(
    $input: DeleteFolderInput!
    $condition: ModelFolderConditionInput
  ) {
    deleteFolder(input: $input, condition: $condition) {
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
