$(document).ready(function () {
    GetToken();
    ShowOrHidePopup(false);
});
var userName = "";
var password = "";
var token;
var guest = false;

//Cookies functions
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function GetToken() {
    token = getCookie("token");
    if (token == "" || !token) {
        userName = getCookie("username");
        password = getCookie("password");
        if (!userName || !password) {
            guest = true;
        }
        var myHeaders = new Headers();
        myHeaders.append("accept", "text/plain");
        myHeaders.append("Content-Type", "application/json");

        var raw = "{\r\n    username: \"#userame#\",\r\n    password: \"#password#\",\r\n    guest: #guest#,\r\n    remember_me: true\r\n}"
            .replace("#userame#", userName).replace("#password#", password).replace("#guest#", guest);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        var a = fetch("/token", requestOptions)
            .then(response => response.json())
            .then((result) => {
                token = result.access_token;
                setCookie("token", token, 356);
            })
            .catch(error => console.log('error', error));
    }
}

function GetAllStores() {
    var apiHeaders = new Headers();
    apiHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
        method: 'GET',
        headers: apiHeaders,
        redirect: 'follow'
    };

    fetch("/api/stores", requestOptions)
        .then(response => response.json())
        .then((result) => {
            stores = result.stores;
            var holderTempelet = $("#stores_holder");
            $("#stores_holder").empty();

            for (let i = 0; i < stores.length; i++) {
                var appendTempelet = $("#store_template").html();
                appendTempelet = appendTempelet.replace(/#Id#/g, stores[i].id)
                    .replace(/#Name#/g, stores[i].name)
                    .replace(/#url#/g, stores[i].url);
                holderTempelet.append(appendTempelet);
                GetProductByStore(stores[i].id);
            }
        })
        .catch(error => console.log('error', error));
}

function ShowOrHidePopup(show) {
    var popup = $("#create_popup");
    if (show == true) {
        popup.css("display", "block");
    }
    else {
        popup.css("display", "none");
    }
}

function GetProductByStore(id) {
    var apiHeaders = new Headers();
    apiHeaders.append("Content-Type", "application/json");
    apiHeaders.append("Authorization", "Bearer " + toke);

    var requestOptions = {
        method: 'GET',
        headers: apiHeaders,
        redirect: 'follow'
    };

    fetch("/api/products/store/" + id, requestOptions)
        .then(response => response.json())
        .then((result) => {
            var products = result.products;
            var holderTempelet = $(".product_holder");
            $(".product_holder").empty();
            for (let i = 0; i < products.length; i++) {
                var productTempelet = $("#product_template").html();
                productTempelet = productTempelet.replace(/#Id#/g, products[i].id)
                    .replace(/#img_src#/g, products[i].images[0].src)
                    .replace(/#Name#/g, products[i].name)
                    .replace(/#href#/g, "/" + products[i].se_name)
                    .replace(/#Price#/g, products[i].price)
                    .replace(/#Titel#/g, products[i].se_name);
                holderTempelet.append(productTempelet);
            }
        })
        .catch(error => console.log('error', error));
}




