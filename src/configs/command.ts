
import CommandConfigType from "../types/CommandConfigType";
import group from "./commands/group";
import random from "./commands/random";
import downloader from "./commands/downloader";

export default <CommandConfigType> {
    messageHandlers: [
        ...random,
        ...group,
        ...downloader,
    ]
}