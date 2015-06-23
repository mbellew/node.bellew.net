var SocialCard = React.createClass(
{
    render: function()
    {
        var renderLink = function(link)
        {
            return <li><a href={link.href}>{link.text}</a></li>
        };

        var cardStyle =
        {
            "backgroundColor":"#eeeeee",
            "padding":"15pt",
            "margin":"15pt"
        };

        return (
            <div style={cardStyle}>
                <table><tr><td>
                    <img width="150" height="150" src={this.props.img} />
                </td><td style={{"verticalAlign":"top"}}>
                    <font style={{"fontFamily":"'Helvetica Neue', Helvetica, Arial, sans-serif", "fontSize":"24pt", "fontWeight":"500", "paddingLeft":"20px"}}>{this.props.name}</font>
                    <ul style={{"listStyleType": "none"}}>{this.props.links.map(renderLink)}</ul>
                </td></tr></table>
            </div>
        );
    }
});
