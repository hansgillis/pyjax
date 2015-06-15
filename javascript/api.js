function RPC(method, params)
{
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open(method, "http://127.0.0.1:8080/" + params, true);
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            string=xmlhttp.responseText;
            dict = JSON.parse(string);
            API(dict["url"], dict["data"]);
        }
    }
    xmlhttp.send();
}

function API(url, data) 
{
    console.log(data)
}