import axios from "axios";

export async function getUserPrice(type) {
    var config = {
        method: "get",
        url: "https://each-star.com/api/user/@me?"
        + "type=" + type,
    };

    let res = await axios(config);
    return res.data.price;
}