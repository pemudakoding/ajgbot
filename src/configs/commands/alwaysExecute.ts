import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";
import MessageHandler from "../../types/MessageHandler";
import {resolveCommandHandlerConfig} from "../../supports/Command";
import AnswerThanksAction from "../../actions/message/alwaysExecuted/AnswerThanksAction";
import ResolveAntiSecretAction from "../../actions/message/alwaysExecuted/ResolveAntiSecretAction";
import SaveMessageAction from "../../actions/message/alwaysExecuted/SaveMessageAction";
import ResolveBadwordMessageDeletionAction
    from "../../actions/message/alwaysExecuted/ResolveBadwordMessageDeletionAction";

const handlers: BaseMessageHandlerAction[] = [
    new AnswerThanksAction(),
    new SaveMessageAction(),
    new ResolveAntiSecretAction(),
    new ResolveBadwordMessageDeletionAction(),
];

export default <MessageHandler[]> resolveCommandHandlerConfig(handlers)