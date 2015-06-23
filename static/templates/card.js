var SocialCard = React.createClass(
{displayName: "SocialCard",
    render: function()
    {
        var renderLink = function(link)
        {
            return React.createElement("li", null, React.createElement("a", {href: link.href}, link.text))
        };

        return React.createElement("div", {className: "card"}, 
            React.createElement("h3", null, this.props.name), 
            React.createElement("table", null, React.createElement("tr", null, React.createElement("td", null, 
                React.createElement("img", {width: "150", height: "150", src: this.props.img})
            ), React.createElement("td", null, 
                React.createElement("ul", null, this.props.links.map(renderLink))
            )))
        );
    }
});
