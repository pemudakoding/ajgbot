import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";
import AntiSecretAction from "../../actions/message/alwaysExecuted/AntiSecretAction";
import MessageHandler from "../../types/MessageHandler";
import {resolveCommandHandlerConfig} from "../../supports/Command";
import AnswerThanksAction from "../../actions/message/alwaysExecuted/AnswerThanksAction";
import SaveMessageAction from "../../actions/message/alwaysExecuted/SaveMessageAction";

const handlers: BaseMessageHandlerAction[] = [
    new AntiSecretAction(),
    new AnswerThanksAction(),
    new SaveMessageAction(),
];

export default <MessageHandler[]> resolveCommandHandlerConfig(handlers)