import axios from "axios";
export async function getUserInfo(type){
    var config = {
        method: "get",
        url: "https://each-star.com:3050/api/user/@me?type=" + type,
    };

    var res = await axios(config);
    return res.data;
}