const app = require('./app');
const fp = require("find-free-port");

const port = app.get('port');

// Finding an empty port
fp(port).then(([freep]) => { 
    app.listen(freep); // puerto en el que escucha
    console.log('server on port ', freep);
}).catch((err)=>{
    console.error(err);
});
