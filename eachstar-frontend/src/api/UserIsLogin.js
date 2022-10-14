import axios from "axios";
export async function UserIsLogin(type){
    if (type=="github") {
        if (this.$cookies.get('githubId')) {
            return true;
        }
    } else if (type=="gitee") {
        if (this.$cookies.get('giteeId')) {
            return true;
        }
    }
    var config = {
        method: "get",
        url: "server/api/user/@me?type=" + type,
    };
    
    var login = false;
    var res = await axios(config)
    .then(function(){
        login = true;
    })
    .catch(function(){
        login = false;
    })

    return login;
}