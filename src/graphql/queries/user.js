import { gql } from "apollo-boost";

export const USER_INFO = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`