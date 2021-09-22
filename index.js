const http = require ('http');
const fs = require('fs');
var requests = require('requests');


const homeFile = fs.readFileSync("./home.html", "utf-8");


const replaceVal=(tempVal, orgVal)=>{
    let orgTemp= (orgVal.main.temp);
    let cTemp=parseFloat(orgTemp-273.15).toFixed(2);
    let temperature = tempVal.replace("{%temperature%}", cTemp);
    temperature = temperature.replace("{%tempDesc%}", orgVal.weather[0].description);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    weatherIcon = orgVal.weather[0].icon;
    iconUrl =  "http://openweathermap.org/img/wn/" + weatherIcon +"@2x.png";
    temperature = temperature.replace("{%icon%}", iconUrl);
    return temperature;

};


const server = http.createServer((req,res)=>{
    if(req.url === "/"){
        requests("http://api.openweathermap.org/data/2.5/weather?q=kolkata&appid=0c752a88eccd92d25132f6aa96dba05b")
        .on('data', (chunk)=>{
            const objData=JSON.parse(chunk); // api JSON data converted into object
            const arrData=[objData];// then the object data stored into in an array
            const realTimeData = arrData.map((val)=> replaceVal(homeFile, val)).join("");
           
            res.write(realTimeData);
            
            console.log(realTimeData); 
        }) 
        .on('end', (err)=>{
            if(err) return console.log("connection closed due to errors", err);
            res.end();
        });
    }
});


server.listen(8000,"127.0.0.1");    