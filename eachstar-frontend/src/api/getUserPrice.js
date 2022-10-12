import axios from "axios";

export async function getUserPrice() {
    var config = {
        method: "get",
        url: ":3050/api/user/@me",
    };

    let res = await axios(config);
    return res.data.price;
    // axios(config)
    // .then(function (response) {
    //     that.userPrice = response.data.price;
    // })
    // .catch(function (error) {
    //     console.log(error);
    // });
}