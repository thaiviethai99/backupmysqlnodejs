var yargs = require('yargs');
const { exec } = require('child_process');
// environment variables
process.env.NODE_ENV = 'development';

// uncomment below line to test this code against staging environment
// process.env.NODE_ENV = 'staging';

// config variables
const config = require('./config/config.js');

var argv = yargs
    .command('export', 'export mysql database', function (yargs) {
        return yargs.options({
            host: {
                demand: false,
                type: 'string',
                default: 'localhost',
                describe: 'host name'
            },
            user: {
                demand: false,
                type: 'string',
                default: 'root',
                describe: 'user '
            },
            pass: {
                demand: true,
                type: 'string',
                describe: 'password'
            },
            database: {
                demand: true,
                type: 'string',
                describe: 'database '
            },
            fx: {
                demand: true,
                type: 'string',
                describe: 'file export name '
            }
        });
    })
    .command('import', 'import mysql database', function (yargs) {
        return yargs.options({
            host: {
                demand: false,
                type: 'string',
                default: 'localhost',
                describe: 'host name'
            },
            user: {
                demand: false,
                type: 'string',
                default: 'root',
                describe: 'user '
            },
            pass: {
                demand: true,
                type: 'string',
                describe: 'password'
            },
            database: {
                demand: true,
                type: 'string',
                describe: 'database '
            },
            fx: {
                demand: true,
                type: 'string',
                describe: 'file import or export name '
            }
        });
    })
    .argv;

/*XỬ LÝ ACTION*/
// Lấy tên action
var action = argv._[0];
if (action == 'export') {
    var host = argv.host;
    var user = argv.user;
    var pass = argv.pass;
    var database = argv.database;
    var fileExportName = argv.fx;
    // Database connection settings.
    let exportFrom = {
        host: host,
        user: user,
        password: pass,
        database: database
    }
    //node index.js export --host localhost --user root  --pass ''  --database topgame --fx hehe2.sql
    exec(`${global.gConfig.dir_mysql_bin}mysqldump -u${exportFrom.user} -p${exportFrom.password} -h${exportFrom.host} --compact ${exportFrom.database} --add-drop-table > ${fileExportName}`, (err, stdout, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
            return;
        }
        console.log(`The export has finished.`);
    });
} else if (action == 'import') {
    var host = argv.host;
    var user = argv.user;
    var pass = argv.pass;
    var database = argv.database;
    var fileImportName = argv.fx;
    // Database connection settings.
    let importTo = {
        host: host,
        user: user,
        password: pass,
        database: database
    }
    //node index.js import --host localhost --user root  --pass ''  --database demo --fx hehe.sql
    exec(`${global.gConfig.dir_mysql_bin}mysql -u${importTo.user} -p${importTo.password} -h${importTo.host} ${importTo.database} < ${fileImportName}`, (err, stdout, stderr) => {
        if (err) { console.error(`exec error: ${err}`); return; }
        console.log(`The import has finished.`);
    });
}
