
import CommandConfigType from "../types/CommandConfigType";
import group from "./commands/group";
import random from "./commands/random";
import downloader from "./commands/downloader";
import alwaysExecute from "./commands/alwaysExecute";

export default <CommandConfigType> {
    messageHandlers: [
        ...alwaysExecute,
        ...random,
        ...group,
        ...downloader,
    ]
}