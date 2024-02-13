import ResolvePingAction from "../../actions/message/ResolvePingAction";
import ResolveStickerAction from "../../actions/message/ResolveStickerAction";
import MessageHandler from "../../types/MessageHandler";
import ResolveListOfCommandsAction from "../../actions/message/ResolveListOfCommandsAction";
import ResolveFeatureSynchronizeAction from "../../actions/message/ResolveFeatureSynchronizeAction";

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
    {
        details: {
            usage: (new ResolveFeatureSynchronizeAction()).usageExample(),
            description: (new ResolveFeatureSynchronizeAction()).description,
            category: (new ResolveFeatureSynchronizeAction()).category,
        },
        flag: {
            alias: (new ResolveFeatureSynchronizeAction()).alias,
            isEnabled: true
        },
        patterns: (new ResolveFeatureSynchronizeAction()).patterns(),
        concrete: new ResolveFeatureSynchronizeAction()
    },
]