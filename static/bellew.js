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
        if (!hash)
            return;
        if (-1 == hash.lastIndexOf(".html"))
            hash = hash + ".html";
        $('#bodyContent').hide();
        var path = "/static/" + hash;
        $('#bodyContent').load(path, function () {
            if ($('#bodyContent').is(":hidden")) {
                $('#bodyContent').slideDown("fast");
            }
        });
        var navbar = $("#navbar");
        $("li", navbar).removeClass("active");
        $("li a[href='" + location.hash + "']", navbar).parent().addClass("active");
    }
    window.addEventListener("hashchange", Window_onHashChange, false);
    Window_onHashChange();
    // since there is no "home" page yet
    if (!location.hash)
        location.hash = "#social";
});
var cardRT = function () {
    function repeatLink1(link, linkIndex) {
        return React.createElement('li', { 'key': link.key }, React.createElement('a', { 'href': link.href }, link.text || link.key));
    }
    return React.createElement('div', {
        'style': {
            backgroundColor: '#eeeeee',
            padding: '15pt',
            margin: '15pt'
        }
    }, React.createElement('table', {}, React.createElement('tr', {}, React.createElement('td', {}, React.createElement('img', {
        'width': '150',
        'height': '150',
        'src': this.props.img
    })), React.createElement('td', { 'style': { verticalAlign: 'top' } }, React.createElement('div', {
        'style': {
            fontFamily: '\'Helvetica Neue\', Helvetica, Arial, sans-serif',
            fontSize: '24pt',
            fontWeight: '500',
            paddingLeft: '20pt'
        }
    }, this.props.name), React.createElement.apply(this, [
        'ul',
        { 'style': { listStyleType: 'none' } },
        _.map(this.props.links, repeatLink1.bind(this))
    ])))));
};