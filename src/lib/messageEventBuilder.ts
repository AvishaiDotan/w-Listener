import { IMessage } from "../models/IMessage.type";
import { withTryCatchLogging } from "../helpers";

class BaseEventBuilder {

    public messageBuilder(msg: IMessage): IMessage {   
        return msg;
    }
}

export class MessageEventBuilder extends BaseEventBuilder {
    private stepThroughCondition: ((msg: any) => Promise<boolean>);
    private afterCB: ((...args: any[]) => any);
    private onError: ((error: any) => any);

    constructor(
        stepThroughCondition: (msg: IMessage) => any,
        afterCB: (message: IMessage) => any,
        onError: (error: any) => any) {
        super();
        this.stepThroughCondition = this.getAsAsync(stepThroughCondition);
        this.afterCB = afterCB;
        this.onError = onError;

        this.handler = this.handler.bind(this);
    }

    public async handler(msg: any) {
        try {
            if (!(await this.stepThroughCondition(msg)))
                return;

            const messageData = this.messageBuilder(msg);

            this.afterCB(messageData);
        } catch (error) {
            console.log(error);

            this.onError(error);
            throw error;
        }

    }

    private getAsAsync(callback: (msg: IMessage) => any): (msg: IMessage) => Promise<boolean> {
        if (callback.constructor.name === 'AsyncFunction') {
            return callback;
        }

        return async function (msg: IMessage): Promise<boolean> {
            return callback(msg);
        };
    }

}

export class MessageEventBuilderFactory {
    public static create(
        wrapWithTryCatchLogs: boolean = false,
        stepThroughCondition: (msg: any) => Promise<boolean>,
        afterCB: (message: IMessage) => any,
        onError: (error: any) => any
    ): MessageEventBuilder {
        if (wrapWithTryCatchLogs) {
            const wrappedStep = withTryCatchLogging(stepThroughCondition);
            stepThroughCondition = async (msg: any) => {
                const result = await wrappedStep(msg);
                return result === undefined ? false : result;
            };
            afterCB = withTryCatchLogging(afterCB);
            onError = withTryCatchLogging(onError);
        }
        return new MessageEventBuilder(stepThroughCondition, afterCB, onError);
    }
}