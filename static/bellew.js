/// <reference path='../typings/jquery/jquery.d.ts' />
$(document).ready(function () {
    function htmlEncode(value) {
        return $('<div/>').text(value).html();
    }
    function htmlDecode(value) {
        return $('<div/>').html(value).text();
    }
    function Window_onHashChange() {
        var hash = location.hash;
        if (hash && hash.charAt(0) == '#')
            hash = hash.substr(1);
        if (-1 != hash.lastIndexOf(".html")) {
            $("#content").html("loading " + htmlEncode(hash));
            var path = "/static/" + hash;
            $('#content').load(path);
        }
        else {
            $("#content").html(location.hash || "hello world");
        }
    }
    window.addEventListener("hashchange", Window_onHashChange, false);
    Window_onHashChange();
});
