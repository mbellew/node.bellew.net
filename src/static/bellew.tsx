/// <reference path='../../typings/jquery/jquery.d.ts' />
/// <reference path='../../typings/react/react.d.ts' />

declare var ga: Function;

import React = require("react");

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

        var bodyContent = $('#bodyContent');
        bodyContent.hide();

        if ($('#page-'+hash).length)
        {
            bodyContent.html($('#page-' + hash).html());
            if (bodyContent.is(":hidden"))
                bodyContent.slideDown("fast");
        }
        else
        {
            var path = "/static/" + hash + ".html";
            bodyContent.load(path, function ()
            {
                ga('set', 'page', location);
                ga('send', 'pageview');
                if (bodyContent.is(":hidden")) {
                    bodyContent.slideDown("fast");
            }
            });
        }

        var navbar = $("#navbar");
        $("li", navbar).removeClass("active");
        $("li a[href='" + location.hash + "']", navbar).parent().addClass("active");
    }

    function Window_onClick(a)
    {
        if (a.target.tagName === "A")
        {
            ga('send', 'event', 'link', 'click', a.target.href);
        }
    }

    window.addEventListener("hashchange", Window_onHashChange, false);
    window.addEventListener('click', Window_onClick, false);
    Window_onHashChange();

    // since there is no "home" page yet
    if (!location.hash)
        location.hash="#social";
});
