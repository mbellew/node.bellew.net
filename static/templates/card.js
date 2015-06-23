var SocialCard = React.createClass(
{displayName: "SocialCard",
    render: function()
    {
        var renderLink = function(link)
        {
            return React.createElement("li", null, React.createElement("a", {href: link.href}, link.text))
        };

        var cardStyle =
        {
            "background-color":"#eeeeee;",
            "padding":"15pt",
            "margin":"15pt"
        };

        return (
            React.createElement("div", {style: cardStyle}, 
                React.createElement("table", null, React.createElement("tr", null, React.createElement("td", null, 
                    React.createElement("img", {width: "150", height: "150", src: this.props.img})
                ), React.createElement("td", {style: {"vertical-align":"top"}}, 
                    React.createElement("font", {style: {"font-family":"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;", "font-size":"24pt", "font-weight":"500", "padding-left":"20px"}}, this.props.name), 
                    React.createElement("ul", {style: {"list-style-type": "none"}}, this.props.links.map(renderLink))
                )))
            )
        );
    }
});
