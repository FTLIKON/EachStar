import axios from "axios";
export async function UserIsLogin(type){
    var config = {
        method: "get",
        url: "server/api/user/@me?type=" + type,
    };

    console.log(config.url);

    var login = false;
    var res = await axios(config)
    .then(function(){
        login = true;
    })
    .catch(function(){
        login = false;
    })

    return login;
}