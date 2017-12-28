declare var ga: Function;


import React = require("react");
import social = require("./social");


$( document ).ready( function()
{
    function htmlEncode(value :string)
    {
        return $('<div/>').text(value).html();
    }

    function htmlDecode(value :string)
    {
        return $('<div/>').html(value).text();
    }

    function Window_onHashChange()
    {
        let hash = location.hash;
        if (hash && hash.charAt(0) == '#')
            hash = hash.substr(1);

        if (!hash)
            return;

        const bodyContent = $('#bodyContent');
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

    function Window_onClick(event :Event)
    {
        const target:any = event.target;
        if (ga && target.tagName === "A")
        {
            ga('send', 'event', 'link', 'click', target.href);
        }
    }

    social.renderCards();

    window.addEventListener("hashchange", Window_onHashChange, false);
    window.addEventListener('click', Window_onClick, false);
    Window_onHashChange();

    // since there is no "home" page yet
    if (!location.hash)
        location.hash="#social";
});
