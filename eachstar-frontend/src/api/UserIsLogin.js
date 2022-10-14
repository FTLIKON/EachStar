import axios from "axios";
export async function UserIsLogin(type){
    var config = {
        method: "get",
        url: "server/api/user/@me?type=" + type,
    };

    var res = await axios(config)
    .then(function(){
        return true;
    })
    .catch(function(){
        return false;
    })
}