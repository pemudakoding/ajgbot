import Alias from "../enums/message/Alias";
import database from "../services/database";
import Path from "../enums/services/Database/Path";

const isFlagEnabled = async (type: 'group' | 'member', id: string , featureAlias: Alias): Promise<boolean> => {
    try {
        return await database.getData(
            Path
                .FlagsWithFeatureAlias
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