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
            host : 'aidoctor-db.ckhpnljabh2s.us-west-2.rds.amazonaws.com', // sonseongil61@gmail.com 계정
            port : 3306,
            user : 'aidoctor',
            password : 'aidoctor00!!',
            database : 'aidoctor'
           }
        }
    }
)();