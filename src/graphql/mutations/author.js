import { gql } from "apollo-boost";

export const EDIT_BIRTHYEAR = gql`
  mutation editBirthYear($author: String!, $year: Int!) {
    editAuthor(name: $author, setBornTo: $year ) {
        name
        born
      }
}
`