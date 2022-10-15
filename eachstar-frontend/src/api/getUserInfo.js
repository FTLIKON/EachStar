import axios from "axios";
export async function getUserInfo(type){
    var config = {
        method: "get",
        url: "http://119.91.192.183:3050/api/user/@me?type=" + type,
    };

    var res = await axios(config);
    return res.data;
}