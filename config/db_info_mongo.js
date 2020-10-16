module.exports = (
    function (){
        return{
           local:{ //localhost
           },
           real:{ //real server db info
            host : '',
            port : '',
            user : '',
            password : '',
            database : ''
           },
           dev:{ //dev server db info
            host : 'drkai-docdb.cluster-cl4cjyurrnzb.us-west-2.docdb.amazonaws.com:27017',
            port : 27017,
            user : 'admin0',
            password : 'admin00!!',
            database : 'drkai'
           }
        }
    }
)();