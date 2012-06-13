    // If you want to prevent dragging, uncomment this section
    /*
    function preventBehavior(e)
    {
      e.preventDefault();
    };
    document.addEventListener("touchmove", preventBehavior, false);
    */

    /* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
    see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
    for more details -jm */
    /*
    function handleOpenURL(url)
    {
        // TODO: do something with the url passed in.
    }
    */

var username = '';
var password = '';

var storage = window.localStorage;

$(document).ready(function() {
    document.addEventListener('deviceready',documentAndDeviceReady, false);
});

function documentAndDeviceReady() {

    username = storage.getItem('username');
    password = storage.getItem('password');
    if (username === null || password === null) {
        if (username.length > 0) {
            $('#login #username').val(username);
        } else if (password.length > 0) {
            $('#login #password').val(password);
        }
        $.mobile.changePage('#login');
    }

    $(document).bind('pagebeforeshow', function () {
        UpdataPurchaseList();
    });

    $('#login').submit(function () {
        username = $(this).find('#username').val();
        password = $(this).find('#password').val();
        if (username.length > 0) {
            storage.setItem('username', username);
        }
        if (password.length > 0) {
            storage.setItem('password', password);
        }
        if (username.length > 0 && password.length > 0) {
            return true;
        }
        return false;
    });

    $('#addform').submit(function () {
        var money = parseInt($(this).find('#money').val(), 10);
        var comment = $(this).find('#comment').val();
        AddPurchase(money, comment);
        return false;
    });
}

function UpdataPurchaseList()
{
    $.ajax({
        type: 'GET',
        url: 'http://atyx.ru/money/api/purchase/',
        dataType: 'json',
        beforeSend : auth,
        success: function(data) {
            var val;
            $("#contentlist").empty();
            for (key in data.objects) {
                val = data.objects[key];
                // list.append(new Option('------test', 1, true, true));
                $("#contentlist").append("<li>" + val.comment + "<span class=\"ui-li-count\">" + val.money + "</span></li>");
            }
            $("#contentlist").listview('refresh');
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
        }
    });
}

function AddPurchase (money, comment)
{
    if (money <= 0) {
        return false;
    }
    var data = {money: money, comment: comment};
    $.ajax({
        type: 'POST',
        url: 'http://atyx.ru/money/api/purchase/',
        dataType: "application/json",
        contentType: "application/json",
        beforeSend : auth,
        data: JSON.stringify(data),
        complete: function (data) {
            $('#addform #money').val('');
            $('#addform #comment').val('');
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
        }
    });
}

function auth (xhr)
{
    var bytes = Crypto.charenc.Binary.stringToBytes(username + ":" + password);
    var base64 = Crypto.util.bytesToBase64(bytes);
    xhr.setRequestHeader("Authorization", "Basic " + base64);
}
