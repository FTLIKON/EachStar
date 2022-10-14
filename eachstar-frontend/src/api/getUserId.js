import axios from "axios";
import cookies from "vue-cookies"
export function getUserId(type) {
    if (type=="github") {
        if (this.$cookies.get('githubId')) {
            return this.$cookies.get('githubId')
        }
    } else if (type=="gitee") {
        if (this.$cookies.get('giteeId')) {
            return this.$cookies.get('giteeId')
        }
    }
    var config = {
        method: "get",
        url: "server/api/user/@me?"
        + "type=" + type,
    };

    var res = await axios(config);
    return res.data.id;
}