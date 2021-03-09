import Vidalii from '../../vidalii'
import { Author } from './Author.entity'
import type { Context } from '../..'
const typeDefs = `
type Author{
  name: String
}
type Query {
    test: String
  }
type Mutation {
  AuthorInsert(name:String):Author
  
}
`
Vidalii.api.addType('Query.test', typeDefs)

function test() {
  return `my test`
}
Vidalii.api.addResolver('Query', test)

function AuthorInsert(parent, args: { name: String }, cxt: Context) {
  const author = new Author()
  author.name = args.name
  cxt.em.persist(author)
  return author
}
Vidalii.api.addResolver('Mutation', AuthorInsert)


