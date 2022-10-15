import axios from "axios";
export async function getUserName(type) {
    if (type=="github") {
        if (this.$cookies.get('githubName')) {
            return this.$cookies.get('githubName')
        }
    } else if (type=="gitee") {
        if (this.$cookies.get('giteeName')) {
            return this.$cookies.get('giteeName')
        }
    }
    var config = {
        method: "get",
        url: "http://119.91.192.183:3050/api/user/@me?"
        + "type=" + type,
    };

    var res = await axios(config);
    return res.data.name;
}