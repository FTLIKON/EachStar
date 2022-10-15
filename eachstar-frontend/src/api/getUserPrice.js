import axios from "axios";

export async function getUserPrice(type) {
    var config = {
        method: "get",
        url: "http://119.91.192.183:3050/api/user/@me?"
        + "type=" + type,
    };

    let res = await axios(config);
    return res.data.price;
}