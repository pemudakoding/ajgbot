import ResolvePingAction from "../../actions/message/ResolvePingAction.ts";
import ResolveStickerAction from "../../actions/message/ResolveStickerAction.ts";
import MessageHandler from "../../types/MessageHandler.ts";
import ResolveListOfCommandsAction from "../../actions/message/ResolveListOfCommandsAction.ts";

export default <MessageHandler[]> [
    {
        details: {
            usage: (new ResolvePingAction()).usageExample(),
            description: (new ResolvePingAction()).description,
            category: (new ResolvePingAction()).category,
        },
        flag: {
            alias: (new ResolvePingAction()).alias,
            isEnabled: true
        },
        patterns: (new ResolvePingAction()).patterns(),
        concrete: new ResolvePingAction()
    },
    {
        details: {
            usage: (new ResolveStickerAction()).usageExample(),
            description: (new ResolveStickerAction()).description,
            category: (new ResolveStickerAction()).category,
        },
        flag: {
            alias: (new ResolveStickerAction()).alias,
            isEnabled: true
        },
        patterns: (new ResolveStickerAction()).patterns(),
        concrete: new ResolveStickerAction()
    },
    {
        details: {
            usage: (new ResolveListOfCommandsAction()).usageExample(),
            description: (new ResolveListOfCommandsAction()).description,
            category: (new ResolveListOfCommandsAction()).category,
        },
        flag: {
            alias: (new ResolveListOfCommandsAction()).alias,
            isEnabled: true
        },
        patterns: (new ResolveListOfCommandsAction()).patterns(),
        concrete: new ResolveListOfCommandsAction()
    },
]