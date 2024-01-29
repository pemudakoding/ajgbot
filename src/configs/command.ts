import ResolvePingAction from "../actions/message/ResolvePingAction";
import CommandConfigType from "../types/CommandConfigType";

export default <CommandConfigType> {
    messageHandlers: [
        {
            patterns: (new ResolvePingAction()).patterns(),
            concrete: new ResolvePingAction()
        }
    ]
}