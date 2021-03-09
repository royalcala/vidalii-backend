import { Mutation, Query, Resolver } from "type-graphql"

@Resolver()
class Defaults {
  @Query(returns => String)
  async default_query_test() {
    return 'test'
  }
  @Mutation(returns => String)
  async default_mutation_test() {
    return 'test'
  }
}

// private defaults() {
  //   const type = `#graphql
  //   type Query{
  //     vtest:String
  //   }
  //   type Mutation{
  //     vtest:String
  //   }
  //   `
  //   const resolver = {
  //     Query: {
  //       vtest: () => 'testing'
  //     },
  //     Mutation: {
  //       vtest: () => 'testing'
  //     }
  //   }
  //   return {
  //     type,
  //     resolver
  //   }
  // }