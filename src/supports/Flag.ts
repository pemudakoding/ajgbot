import Alias from "../enums/message/Alias.ts";
import database from "../services/database.ts";
import Path from "../enums/services/Database/Path.ts";

const isFlagEnabled = async (type: 'group' | 'member', id: string , featureAlias: Alias): Promise<boolean> => {
    try {
        return await database.getData(
            Path
                .Flags
                .replace(':type', type)
                .replace(':id', id)
                .replace(':featureAlias', featureAlias)
        )
    } catch (Error) {
        return false
    }
}

export {
    isFlagEnabled
}