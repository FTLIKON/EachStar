import axios from "axios";

export async function getUserPrice() {
    var config = {
        method: "get",
        url: "server/api/user/@me?type=GitHub",
    };

    let res = await axios(config);
    return res.data.price;
}