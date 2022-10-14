import axios from "axios";
export async function getUserName(type) {
    console.log(this.$cookies.get('githubName'));
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
        url: "server/api/user/@me?"
        + "type=" + type,
    };

    var res = await axios(config);
    return res.data.name;
}