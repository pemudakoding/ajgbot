import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";
import MessageHandler from "../../types/MessageHandler";
import {resolveCommandHandlerConfig} from "../../supports/Command";
import AnswerThanksAction from "../../actions/message/alwaysExecuted/AnswerThanksAction";
import ResolveAntiSecretAction from "../../actions/message/alwaysExecuted/ResolveAntiSecretAction";
import SaveMessageAction from "../../actions/message/alwaysExecuted/SaveMessageAction";

const handlers: BaseMessageHandlerAction[] = [
    new AnswerThanksAction(),
    new SaveMessageAction(),
    new ResolveAntiSecretAction(),
];

export default <MessageHandler[]> resolveCommandHandlerConfig(handlers)