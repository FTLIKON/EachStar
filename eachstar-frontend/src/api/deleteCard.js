import axios from "axios";

export async function deleteCard(type, cardId){
    var config = {
        method: "delete",
        url: "http://119.91.192.183:3050/api/card?" 
        + "type=" + type + "&cardId=" + cardId,
    };
    var access = false;
    var res = await axios(config)
    .then(function (response) {
        access = true;
    })
    .catch(function (error) {
        access = false;
    });
    return access;
}