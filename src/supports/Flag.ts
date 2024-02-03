import Alias from "../enums/message/Alias.ts";
import database from "../services/database.ts";

const isFlagEnabled = async (type: 'group' | 'member', id: string , featureAlias: Alias): Promise<boolean> => {
    try {
        return await database.getData('.' + type + '.' + id + '.flags.' + featureAlias)
    } catch (Error) {
        return false
    }
}

export {
    isFlagEnabled
}