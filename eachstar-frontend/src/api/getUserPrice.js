import axios from "axios";

export async function getUserPrice(type) {
    var config = {
        method: "get",
        url: "http://each-star.com:3050/api/user/@me?"
        + "type=" + type,
    };

    let res = await axios(config);
    return res.data.price;
}