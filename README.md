# [Part 8 | Fullstack course](https://fullstackopen.com/en/part8/graph_ql_server)
## GraphQL Frontend

The backend is [here](https://github.com/marcorichetta/part8-backend)

- The library system allows users to add books, filter by genre, update data on authors.
- To run on your machine, 
    1. `git clone`
    2. `yarn install`
    3. `yarn start`

## Contents

### [Apollo Client](https://www.apollographql.com/docs/react/)
- Library used to make GraphQL requests, fetch and cache data and update the React UI

### Queries
- Queries are defined with `gql`
    - It can be named and can use variables
    - Fragments can also be declared to make queries more compact by reusing code
    - Example:

```js
// Fragment defined to query book details
const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    genres
    author {
      name
    }
  }
`

// Every query that needs the book fields can use the fragment defined above
const ALL_BOOKS = gql`
  query {
    allBooks {
      ...BookDetails
    }
  }
${BOOK_DETAILS}
`
```

### Apollo Hooks:
- [useQuery](https://www.apollographql.com/docs/react/data/queries/#executing-a-query)
- [useMutation](https://www.apollographql.com/docs/react/data/mutations/#executing-a-mutation)
- [useSubscription](https://www.apollographql.com/docs/react/data/subscriptions/#usesubscription-hook)
- These hooks return an object that contains `data`, `loading` and `error` properties which can be used for conditional rendering

### Updating the cache
- The simplest way to mantain the cache updated is to **refetch queries** everytime a mutation happens
- One or more queries can be defined
- Example: Everytime an author is edited the query for `ALL_AUTHORS` is fired
```js
const [editAuthor] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
})
```

- It is possible to optimize the solution by updating the cache manually with the `update-callback`
```js
const [addPerson] = useMutation(CREATE_PERSON, {
    onError: handleError,
    update: (store, response) => {
        // Manually query the cache to find all persons
        const dataInStore = store.readQuery({ query: ALL_PERSONS })

        // Add the created person to the array
        dataInStore.allPersons.push(response.data.addPerson)

        // Update the cache by writing to it
        store.writeQuery({
            query: ALL_PERSONS,
            data: dataInStore
        })
    }
})
```