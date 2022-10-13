import axios from "axios";

export async function deleteCard(type, cardId){
    var config = {
        method: "delete",
        url: "server/api/card?" 
        + "type=" + type + "&cardId=" + cardId,
    };
    var res = await axios(config)
    .then(function (response) {
        return true;
    })
    .catch(function (error) {
        return false;
    });
}