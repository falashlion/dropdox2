/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateFile = /* GraphQL */ `
  subscription OnCreateFile(
    $filter: ModelSubscriptionFileFilterInput
    $owner: String
  ) {
    onCreateFile(filter: $filter, owner: $owner) {
      id
      name
      description
      url
      owner
      version
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateFile = /* GraphQL */ `
  subscription OnUpdateFile(
    $filter: ModelSubscriptionFileFilterInput
    $owner: String
  ) {
    onUpdateFile(filter: $filter, owner: $owner) {
      id
      name
      description
      url
      owner
      version
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteFile = /* GraphQL */ `
  subscription OnDeleteFile(
    $filter: ModelSubscriptionFileFilterInput
    $owner: String
  ) {
    onDeleteFile(filter: $filter, owner: $owner) {
      id
      name
      description
      url
      owner
      version
      createdAt
      updatedAt
      __typename
    }
  }
`;
