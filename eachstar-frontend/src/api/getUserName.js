import axios from "axios";
export async function getUserName(type) {
    var config = {
        method: "get",
        url: "server/api/user/@me?"
        + "type=" + type,
    };

    var res = await axios(config);
    return res.data.name;
}