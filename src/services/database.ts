import { JsonDB, Config } from 'node-json-db';

const path = './static/database'
const badwordDatabase = new JsonDB(new Config(path + '/badword', true, true, '/'));

// The first argument is the database filename. If no extension is used, '.json' is assumed and automatically added.
// The second argument is used to tell the DB to save after each push
// If you set the second argument to false, you'll have to call the save() method.
// The third argument is used to ask JsonDB to save the database in a human readable format. (default false)
// The last argument is the separator. By default it's slash (/)
export default new JsonDB(new Config(path + "/database", true, true, '.'));

export {
    badwordDatabase
};

