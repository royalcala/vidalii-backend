import { makeExecutableSchema } from 'graphql-tools'
import { buildSchema, buildTypeDefsAndResolvers, Resolver, Query, Mutation } from 'type-graphql';


export class Api {
  public type = new Map() as Map<string, string>
  public resolver = {
    Query: new Map() as Map<string, Function>,
    Mutation: new Map() as Map<string, Function>,
    Type: new Map() as Map<string, Function>
  }

  public addType(name: string, type: string) {
    console.log('addType', name)
    this.type.set(name, type)
  }
  public addResolver(type: keyof Api['resolver'], resolver: Function, options: 'replace' | 'pre' | 'post' = 'replace') {
    console.log('addResolver:', resolver.name)
    const optionReplace = (type: keyof Api['resolver'], resolver) => {
      this.resolver[type].set(resolver.name, resolver)
    }
    switch (options) {
      case 'replace':
        optionReplace(type, resolver)
        break;
    }
  }
  private getGqlPlain() {
    const dataPlain = {
      typeDefs: [...this.type.values()].join('\n'),
      resolvers: {
        Query: Object.fromEntries(this.resolver.Query),
        ...Object.fromEntries(this.resolver.Type)
      } as any
    }
    if (this.resolver.Mutation.size > 0)
      dataPlain.resolvers.Mutation = Object.fromEntries(this.resolver.Mutation)
    return dataPlain
  }
  private async getGqlClass() {
    const dataClass = await buildTypeDefsAndResolvers({
      resolvers: [__dirname + "**/*.api.{ts,js}", __dirname + '/vidalii.default.api.{ts,js}'],
    })
    console.log(dataClass.typeDefs)
    console.log(dataClass.resolvers)
    return dataClass
  }

  public async getSchemaApi() {
    const dataFn = this.getGqlPlain()
    const dataClass = await this.getGqlClass()
    const typeDefs =
     dataFn.typeDefs
      + '\n'
      + dataClass.typeDefs
    const resolvers = {
      ...dataFn.resolvers,
      ...dataClass.resolvers,
    }
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    })
    return schema
  }
}