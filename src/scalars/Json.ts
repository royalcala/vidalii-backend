import { GraphQLScalarType, Kind, print } from 'graphql';
const identity = value => {
    return value;
}
const parseObject = (typeName, ast, variables) => {
    const value = Object.create({});
    ast.fields.forEach((field) => {
        // eslint-disable-next-line no-use-before-define
        value[field.name.value] = parseLiteral(typeName, field.value, variables);
    });

    return value;
}

const parseLiteral = (typeName, ast, variables) => {
    switch (ast.kind) {
        case Kind.STRING:
        case Kind.BOOLEAN:
            return ast.value;
        case Kind.INT:
        case Kind.FLOAT:
            return parseFloat(ast.value);
        case Kind.OBJECT:
            return parseObject(typeName, ast, variables);
        case Kind.LIST:
            return ast.values.map((n) => parseLiteral(typeName, n, variables));
        case Kind.NULL:
            return null;
        case Kind.VARIABLE:
            return variables ? variables[ast.name.value] : undefined;
        default:
            throw new TypeError(`${typeName} cannot represent value: ${print(ast)}`);
    }
}

export const JsonScalar = new GraphQLScalarType({
    name: 'Json',
    description:
        'The `Json` scalar type represents json values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',
    serialize: identity,
    parseValue: identity,
    parseLiteral: (ast, variables) => {
        return parseLiteral('json', ast, variables)
    }
})