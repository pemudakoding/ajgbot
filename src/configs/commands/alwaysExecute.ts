import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";
import AntiSecretAction from "../../actions/message/AntiSecretAction";
import MessageHandler from "../../types/MessageHandler";
import {resolveCommandHandlerConfig} from "../../supports/Command";

const handlers: BaseMessageHandlerAction[] = [
    new AntiSecretAction,
];

export default <MessageHandler[]> resolveCommandHandlerConfig(handlers)