/// <reference path='../typings/jquery/jquery.d.ts' />

$( document ).ready( function()
{
    function htmlEncode(value)
    {
        return $('<div/>').text(value).html();
    }

    function htmlDecode(value)
    {
        return $('<div/>').html(value).text();
    }

    function Window_onHashChange()
    {
        var hash = location.hash;
        if (hash && hash.charAt(0) == '#')
            hash = hash.substr(1);

        if (!hash)
            return;
        if (-1 == hash.lastIndexOf(".html"))
            hash = hash + ".html";
        $("#bodyContent").html("loading " + htmlEncode(hash));
        var path = "/static/" + hash;
        $('#bodyContent').load(path); //  + " DIV.content");

        var navbar = $("#navbar");
        $("li", navbar).removeClass("active");
        $("li a[href='" + location.hash + "']", navbar).parent().addClass("active");
    }

    window.addEventListener("hashchange", Window_onHashChange, false);
    Window_onHashChange();

    // since there is no "home" page yet
    if (!location.hash)
        location.hash="#social";
});
