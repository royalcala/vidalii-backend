import { api } from "../..";
import { Context } from "../../vidalii.server";
import { book as BookEntity } from "./Book.entity";

@api.ObjectType()
export class Book implements Partial<BookEntity>{
    @api.Field(type => String)
    _id: string;

    @api.Field()
    name: string;
}


// @api.InputType()
// export class BookInsert implements Partial<Book>{
//     _id=String(Math.random)

//     @MaxLength(30)
//     @api.Field()
//     name: string;
// }

@api.Resolver(Book)
class BookResolver {
    @api.Query(returns => [Book])
    async BookFind(
        @api.Ctx() context: Context
    ) {
        return context.em.find(BookEntity, {})
        // return [{
        //     _id:1,
        //     name:'rao'
        // }]
    }
    @api.Mutation(returns => Book)
    async BookInsert(
        @api.Arg("book") book: BookEntity,
        @api.Ctx() context: Context
    ) {        
        console.log('inserting::',book)
        context.em.persist(book)
        return book
    }
}