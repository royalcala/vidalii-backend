import { Resolver, Query, Arg, Ctx, ClassType, Mutation } from "type-graphql";
import { Context } from ".";
import { JsonScalar } from "./scalars/Json";

// export function createBaseResolverFind(prefix: string, ReturnType, EntityToFind) {
//     @Resolver({ isAbstract: true })
//     abstract class BaseResolver {
//         @Query(type => [ReturnType], { name: `${prefix}Find` })
//         async prefixFind(
//             @Arg('operators', () => JsonScalar)
//             operators: Object,
//             @Ctx() context: Context
//         ) {

//             return context.em.find(EntityToFind, operators)
//         }
//     }

//     return BaseResolver;
// }

// export function createBaseResolverInsert<TInputType extends ClassType>(
//     // prefix: string,
//     ReturnType: ClassType,
//     nameArg: string,
//     InputAndEntityType: TInputType,
//     fnPersist: (persist: () => {}, arg: TInputType, context: Context) => any
// ) {
//     @Resolver({ isAbstract: true })
//     abstract class BaseResolver {
//         @Mutation(returns => ReturnType, { name: `${ReturnType.name}Insert` })
//         async [`${ReturnType.name}Insert`](
//             @Arg(nameArg, () => InputAndEntityType, { validate: true }) arg,
//             @Ctx() context: Context
//         ) {
//             return fnPersist(
//                 () => context.em.persist(arg),
//                 arg,
//                 context
//             )


//             // UserVersion.insert(user._id, 'id_session_HERE', context)
//         }
//     }

//     return BaseResolver;
// }