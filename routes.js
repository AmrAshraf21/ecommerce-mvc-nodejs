
const fs = require('fs');
const requestHandler = (req,res)=>{
     // console.log(req.url , req.method , req.headers);
    // process.exit(); // exit from server after i make request but this is not recommended because the server will stop and can't any one make a request 
      
        const url = req.url;
        const method = req.method

    if(url === '/'){
        res.write('<html>')
        res.write('<head><title>My First page</title></head>')
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"/> <button type="submit">Send</button></form></body>')
        res.write('</html>')
    
       return res.end(); // this the end point 
       }
       if(url ==='/message' && method==='POST'){
           const body = [];
           req.on('data',(chunk)=>{
              
               body.push(chunk)
           })
          return req.on('end',(chunk)=>{ //this is a callback function and it's run the latest thing in application because nodejs will store it in her registry and after execute the down blow then will call back it's function
               const parseBody = Buffer.concat(body).toString();
               console.log(parseBody);
               const message = parseBody.split('=')[0];
              // fs.writeFileSync('message.txt',message); //block the execution of the next code until this line will execute and create a file  
               
              
               fs.writeFile('message.txt',message,(err)=>{
                   
                    res.statusCode = 302;
                    res.setHeader('Location' , '/');
                    return res.end()
                  
               })
           })
         

    
       }
    res.setHeader('Content-Type' , 'text/html'); // her this code will run before above because this not a callback func and not event listener so has a priority to execute
    res.write('<html>')
    res.write('<head><title>My First pages</title></head>')
    res.write('<body><h1>Hello from node js server</h1></body>')
    res.write('</html>')
    
    res.end(); // this the end point 
    

}

module.exports= requestHandler 
//or 

// module.exports.handler = requestHandler
//or 
    // module.exports = {
//     handler : requestHandler
// }