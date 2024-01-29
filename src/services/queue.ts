import PQueue from 'p-queue';

const queue = new PQueue({
    concurrency: 5,
})

export default queue;