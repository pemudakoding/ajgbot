import PQueue from 'p-queue';

const queue = new PQueue({
    concurrency: 5,
})

const handlerQueue = new PQueue()

export default queue;

export {
    handlerQueue
}