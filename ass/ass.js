const http = require('http');
const server = http.createServer((req,res)=>{
    const url = req.url;
    const method = req.method;

    if(url === '/'){
        res.setHeader('Content-Type','text/html')
        res.write('<html>')
        res.write('<head><title>Assigmnet</title></head>')
        res.write('<body><form action="/create-user" method="POST"><input type="text" name="username" /><button type="submit">Submit</button></form></body>')
        res.write('</html>')
        return res.end()
    }
    if(url === '/users'){
        res.setHeader('Content-Type','text/html')
        res.write('<html>')
        res.write('<head><title>Assigmnet</title></head>')
        res.write('<body><ul><li>User1</li><li>User2</li></ul></body>')
        res.write('</html>')
        return res.end()

    }
    if(url ==='/create-user' && method ==='POST'){
                    const arr= []
                req.on('data',(chunk)=>{
                    arr.push(chunk)
                })
                req.on('end',(chunk)=>{
                    const parse = Buffer.concat(arr).toString();
                    const data = parse.split('=')[1];
                        console.log(data);

                })
                res.statusCode = 200;
                res.setHeader('Location' ,'/');
                res.end()
                
    }


});
server.listen(5000);
