const url = "http://localhost:8080/myChat";
const webSocketUrl = "ws://localhost:8888/channel";

let socket;
let checked;
let username
$(function () {
    username = $('#user-name-label').text();
    const user_photo = $('#user_photo')[0];
    const photo_btn = $('#photo_btn')[0];
    user_photo.addEventListener('change', function () {
        if (!user_photo.value) {
            return;
        }
        const file = user_photo.files[0];
        if (file.size > 4 * 1024 * 1024) {
            alert('文件大小超出限制！');
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = e.target.result;
            photo_btn.style.backgroundImage = 'url(' + data + ')';
        }
        reader.readAsDataURL(file);
    })

    const search_input = $('#search_input')[0];
    let timeout = null;
    const list = $('#my-chat-list')[0];
    const btn = btn_factory(list, "ahy231", "19888888888", "btn", "btn-large", "btn-outline-primary", "my-page");
    btnActive(btn);
    $('#search_input').bind('input propertychange', function () {

        checked = "";
        clear_list($('#my_chat_room')[0]);
        $('#my_textarea').val("");
        if (!$('#send_btn').hasClass('disabled')) {
            toggleDisabled($('#send_btn'));
        }

        if (timeout != null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function () {
            if (search_input.value === "") {
                clear_list(list);
                const btn = btn_factory(list, "ahy231", "19888888888", "btn", "btn-large", "btn-outline-primary", "my-page");
                btnActive(btn);
                return;
            }
            $.ajax({
                url: url + "/user/search",
                data: {
                    "msg": search_input.value
                },
                async: true,
                method: "post",
                success: function (e) {
                    if (e === "") {
                        alert("请求失败！");
                        return;
                    }
                    clear_list(list);
                    const json = JSON.parse(e);
                    for (let i = 0; i < json.length; i++) {
                        const btn = btn_factory(list, json[i].name, json[i].phone, "btn", "btn-large", "btn-outline-primary", "my-page");
                        btnActive(btn);
                    }
                }
            })
        }, 1000);
    })

    $('#my_textarea').bind('input propertychange', function () {
        if (($('#my_textarea').val() === "" || checked === "") && !$('#send_btn').hasClass("disabled")) {
            toggleDisabled($('#send_btn'));
        } else if (($('#my_textarea').val() !== "" && checked !== "") && $('#send_btn').hasClass("disabled")) {
            toggleDisabled($('#send_btn'));
        }
    })

    if (window.WebSocket) {
        function systemNamePackage(nameSpan) {
            $(nameSpan).css("color", "red");
        }

        socket = new WebSocket(webSocketUrl)
        socket.onopen = function (ev) {
            addCard("系统小助手", "通信打开了...", systemNamePackage)
        }
        socket.onclose = function (ev) {
            addCard("系统小助手", "通信关闭了...", systemNamePackage)
        }
        socket.onmessage = function (ev) {
            addCard(checked, ev.data)
        }
    } else {
        alert("浏览器不支持WebSocket！\n请升级浏览器或更换浏览器。");
    }

    let timeout2 = setInterval(function () {
        if (socket.readyState !== WebSocket.OPEN) {
            alert("连接未开启！");
        } else {
            socket.send("$login" + username);
            timeout2 = clearInterval(timeout2);
        }
    }, 500)
})

function send(message) {

    function packageName(nameSpan) {
        $(nameSpan).css('color', 'orange');
    }

    toggleDisabled($('#send_btn'));
    const text = $('#my_textarea').val();

    if (!socket) { //先判断socket是否创建好了
        alert("socket未创建！")
        return;
    }
    if (socket.readyState === WebSocket.OPEN) {
        let jsonObject = {
            to: checked,
            text: message
        };
        let jsonString = JSON.stringify(jsonObject);
        socket.send(jsonString);
    } else {
        alert("连接未开启！")
    }

    $('#my_textarea').val("");
    addCard(username, text, packageName);
}

function logout() {
    $.ajax({
        async: false,
        url: url + "/user/logout",
        method: "post"
    }).success(function (e) {
        alert(e);
        window.location.href = url + "/";
    })
}

function upload_photo() {
    document.getElementById("user_photo").click();
}

function clear_list(list) {
    const childNodes = list.childNodes;
    for (let i = childNodes.length - 1; i >= 0; i--) {
        list.removeChild(childNodes[i]);
    }
}

function btn_factory(list, nameStr, phoneStr, ...classes) {
    const btn = document.createElement("btn");
    const name = document.createElement("div");
    name.classList.add('page-username');
    name.innerHTML = "姓名：" + nameStr;
    const phone = document.createElement("div");
    phone.innerHTML = "电话：" + phoneStr;
    btn.append(name, phone);
    for (let i = 0; i < classes.length; i++) {
        btn.classList.add(classes[i]);
    }
    list.appendChild(btn);
    return btn;
}

/*
function send() {
    $(function () {

        function packageName(nameSpan) {
            $(nameSpan).css('color', 'orange');
        }

        toggleDisabled($('#send_btn'));
        const username = $('#user-name-label').text();
        const text = $('#my_textarea').val();
        $.ajax({
            url: url + "/user/send",
            method: "post",
            async: true,
            data: {
                // username: username,
                text: text,
                to: checked
            },
            success: function (e) {
                if (e !== "OK") {
                    alert("发送失败！");
                } else {
                    $('#my_textarea').val("");
                }
                addCard(username, text, packageName);
            }
        })
    })
}
*/

function toggleDisabled(jquery_obj) {
    if (!jquery_obj.hasClass('disabled')) {
        jquery_obj.attr('disabled', true);
        jquery_obj.addClass('disabled');
    } else {
        jquery_obj.attr('disabled', false)
        jquery_obj.removeClass('disabled');
    }
}

checked = ""; // username of which checked
function toggleActive(jquery_obj) {

    const my_chat_room = document.getElementById('my_chat_room');
    clear_list(my_chat_room);

    let active = true;
    if (jquery_obj.hasClass("active")) {
        active = false;
    }
    const children = jquery_obj.parent().children();
    for (let i = 0; i < children.length; i++) {
        if ($(children[i]).hasClass("active")) {
            $(children[i]).removeClass("active");
        }
    }
    if (active) {
        checked = jquery_obj.children('.page-username').html().substring(3);
        jquery_obj.addClass("active");
        $('#my_textarea').val("");

        addCard(checked, "你好鸭！我是：" + checked);
    } else {
        checked = "";
        $('#my_textarea').val("");
        if (!$('#send_btn').hasClass("disabled")) {
            toggleDisabled($('#send_btn'));
        }
    }
}

function btnActive(btn) {
    btn.addEventListener("click", function (e) {
        toggleActive($(btn));
    })
}

function addCard(username, text, name_handler = function (nameSpan) {
}, box = document.getElementById('my_chat_room')) {
    const my_card = my_card_factory(username, text, name_handler);
    box.appendChild(my_card);
}

function my_card_factory(username, text, name_handler) {
    const my_card = document.createElement("div");
    const $my_card = $(my_card);
    $my_card.addClass('my-card');
    $my_card.css('padding', '0');
    $my_card.css('max-width', '80%');
    $my_card.css('margin', '10px 20px');

    const card = document.createElement("div");
    $my_card.append(card);
    const $card = $(card);
    $card.addClass('card');
    $card.addClass('text-left');

    const card_header = document.createElement("div");
    $card.append(card_header);
    const $card_header = $(card_header);
    $card_header.addClass('card-header');
    // $card_header.text(username + "：");

    let nameSpan = document.createElement("span");
    $(nameSpan).text(username);
    name_handler(nameSpan);
    $card_header.append(nameSpan);

    const card_body = document.createElement("div");
    $card.append(card_body);
    const $card_body = $(card_body);
    $card_body.addClass('card-body');

    const card_text = document.createElement('div');
    $card_body.append(card_text);
    const $card_text = $(card_text);
    $card_text.addClass('card-text');
    $card_text.text(text);

    return my_card;
}
