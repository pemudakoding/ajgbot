
import CommandConfigType from "../types/CommandConfigType";
import group from "./commands/group.ts";
import random from "./commands/random.ts";
import downloader from "./commands/downloader.ts";

export default <CommandConfigType> {
    messageHandlers: [
        ...random,
        ...group,
        ...downloader,
    ]
}