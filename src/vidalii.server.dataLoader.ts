import { AnyEntity, EntityName } from "@mikro-orm/core"
import DataLoader from "dataloader"
import { Context } from "."

export function getDataLoader<T extends AnyEntity<T>>(entity: EntityName<T>, namedNestedFieldDataloader: string, pk: keyof T, context: Context): DataLoader<any, T, any> {
    if (!context.dataLoader.has(namedNestedFieldDataloader)) {
        context.dataLoader.set(
            namedNestedFieldDataloader,
            new DataLoader(async (ids: string[]) => {
                const childDocs = await context.em.find(entity as any, { [pk]: { $in: ids } })
                const map = {}
                for (let index = 0; index < childDocs.length; index++) {
                    let childDoc = childDocs[index]
                    map[
                        childDoc[pk as string]
                    ] = childDoc
                }
                return ids.map(key => map[key] || [])
            })
        )

    }
    return context.dataLoader.get(namedNestedFieldDataloader)
}
