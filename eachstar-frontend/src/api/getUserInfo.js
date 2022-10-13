import axios from "axios";
export async function getUserInfo(type){
    var config = {
        method: "get",
        url: "server/api/user/@me?type=" + type,
    };

    var res = await axios(config);
    console.log(res.data)
    return res.data.data;
}