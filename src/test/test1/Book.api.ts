import { api } from "../..";
@api.ObjectType()
export class Book {
    @api.Field(type => String)
    id: string;

    @api.Field()
    title: string;

    @api.Field({ nullable: true })
    description?: string;

    @api.Field()
    creationDate: Date;

    @api.Field(type => [String])
    ingredients: string[];
}

@api.Resolver(Book)
class BookResolver {
    @api.Query(returns => String)
    async Booki(
    ) {
        return 'test'
    }
}