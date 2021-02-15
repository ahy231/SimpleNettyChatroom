const url = "http://localhost:8080/myChat";

$(document).ready(function () {
    const user_photo = $('#user_photo')[0];
    const photo_btn = $('#photo_btn')[0];
    user_photo.addEventListener('change', function () {
        if (!user_photo.value) {
            // alert("没有照片！")
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
    var timeout = null;
    const list = $('#my-chat-list')[0];
    add_mock_data(list);
    $('#search_input').bind('input propertychange', function () {
        if (timeout != null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function () {
            if (search_input.value === "") {
                clear_list(list);
                add_mock_data(list);
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
                        const btn = document.createElement("button");
                        const name = document.createElement("div");
                        name.innerHTML = "姓名：" + json[i].name;
                        const phone = document.createElement("div");
                        phone.innerHTML = "电话：" + json[i].phone;
                        btn.append(name, phone);
                        btn.classList.add("btn", "btn-large", "btn-outline-primary", "my-page");
                        list.appendChild(btn);
                    }
                }
            })
        }, 1000);
    })
})

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

function add_mock_data(list) {
    const btn = document.createElement("btn");
    const name = document.createElement("div");
    name.innerHTML = "姓名：ahy231";
    const phone = document.createElement("div");
    phone.innerHTML = "电话：19883138069";
    btn.append(name, phone);
    btn.classList.add("btn", "btn-large", "btn-outline-primary", "my-page");
    list.appendChild(btn);
}
