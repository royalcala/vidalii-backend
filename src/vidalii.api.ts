import { makeExecutableSchema } from 'graphql-tools'
import { buildTypeDefsAndResolvers, } from 'type-graphql';
import { OptionsCli } from './service.cli';
import { composeResolvers } from "graphql-tools";

export class Api {
  public type = new Map() as Map<string, string>
  public resolver = {
    Query: new Map() as Map<string, Function>,
    Mutation: new Map() as Map<string, Function>,
    Type: new Map() as Map<string, Function>,
  }
  public resolversComposition = new Map() as Map<string, Function[]>
  public addResolversComposition(nested: string, fns: Function[], pos: 'before' | 'after' = 'after') {
    switch (pos) {
      case 'before':
        if (this.resolversComposition.has(nested)) {
          const data = this.resolversComposition.get(nested)
          fns.push(...data)
          this.resolversComposition.set(nested, fns)
        }
        this.resolversComposition.set(nested, fns)
        break;
      case 'after':
        if (this.resolversComposition.has(nested)) {
          const data = this.resolversComposition.get(nested)
          data.push(...fns)
          this.resolversComposition.set(nested, data)
        }
        this.resolversComposition.set(nested, fns)
        break;
    }
  }
  
  public addResolver(type: keyof Api['resolver'], resolver: Function
    // , options: 'replace' | 'pre' | 'post' = 'replace'
  ) {
    // console.log('addResolver:', resolver.name)
    // const optionReplace = (type: keyof Api['resolver'], resolver) => {
    this.resolver[type].set(resolver.name, resolver)
    // }
    // switch (options) {
    //   case 'replace':
    //     optionReplace(type, resolver)
    //     break;
    // }
  }
  public addType(name: string, type: string) {
    // console.log('addType', name)
    this.type.set(name, type)
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
  private async getGqlClass(cli: OptionsCli) {
    const dataClass = await buildTypeDefsAndResolvers({
      resolvers: [cli.INPUT + ".api.{ts,js}", __dirname + '/vidalii.default.api.{ts,js}'],
      //by default all the fields are required! {nullable:false}
      nullableByDefault: true,
      //by default validate with class validator
      validate: false

    })
    return dataClass
  }

  public async getSchemaApi(cli: OptionsCli) {
    const dataClass = await this.getGqlClass(cli)
    const dataFn = this.getGqlPlain()
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
      resolvers: composeResolvers(resolvers, Object.fromEntries(this.resolversComposition) as any)
    })
    return schema
  }
}