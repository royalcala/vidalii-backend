import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools'
import glob from 'glob'


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

    public getSchemaApi() {
        const data = {
          typeDefs: [...this.type.values()].join('\n'),
          resolvers: {
            Query: Object.fromEntries(this.resolver.Query),
            ...Object.fromEntries(this.resolver.Type)
          } as any
        }
        if (this.resolver.Mutation.size > 0)
          data.resolvers.Mutation = Object.fromEntries(this.resolver.Mutation)
        const schema = makeExecutableSchema(data)
        return schema
      }
}