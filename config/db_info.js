module.exports = (
    function (){
        return{
           local:{ //localhost
            host : '127.0.0.1', //db ip address
            port : 3306, //db port number
            user : 'root', //db id
            password : 'root00!!',
            database : 'aidoctor' //db schema name
           },
           real:{ //real server db info
            host : '',
            port : '',
            user : '',
            password : '',
            database : ''
           },
           dev:{ //dev server db info
            host : '10.0.0.1',
            port : 3306,
            user : 'aidoctor',
            password : 'aidoctor00!!',
            database : 'aidoctor'
           }
        }
    }
)();