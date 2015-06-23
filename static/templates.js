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
            "backgroundColor":"#eeeeee",
            "padding":"15pt",
            "margin":"15pt"
        };

        return (
            React.createElement("div", {style: cardStyle}, 
                React.createElement("table", null, React.createElement("tr", null, React.createElement("td", null, 
                    React.createElement("img", {width: "150", height: "150", src: this.props.img})
                ), React.createElement("td", {style: {"verticalAlign":"top"}}, 
                    React.createElement("font", {style: {"fontFamily":"'Helvetica Neue', Helvetica, Arial, sans-serif", "fontSize":"24pt", "fontWeight":"500", "paddingLeft":"20px"}}, this.props.name), 
                    React.createElement("ul", {style: {"listStyleType": "none"}}, this.props.links.map(renderLink))
                )))
            )
        );
    }
});
