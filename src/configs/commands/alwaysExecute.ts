import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";
import AntiSecretAction from "../../actions/message/alwaysExecuted/AntiSecretAction";
import MessageHandler from "../../types/MessageHandler";
import {resolveCommandHandlerConfig} from "../../supports/Command";
import AnswerThanksAction from "../../actions/message/alwaysExecuted/AnswerThanksAction";

const handlers: BaseMessageHandlerAction[] = [
    new AntiSecretAction(),
    new AnswerThanksAction()
];

export default <MessageHandler[]> resolveCommandHandlerConfig(handlers)