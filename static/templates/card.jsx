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
            "background-color":"#eeeeee;",
            "padding":"15pt",
            "margin":"15pt"
        };

        return (
            <div style={cardStyle}>
                <table><tr><td>
                    <img width="150" height="150" src={this.props.img} />
                </td><td style={{"vertical-align":"top"}}>
                    <font style={{"font-family":"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;", "font-size":"24pt", "font-weight":"500", "padding-left":"20px"}}>{this.props.name}</font>
                    <ul style={{"list-style-type": "none"}}>{this.props.links.map(renderLink)}</ul>
                </td></tr></table>
            </div>
        );
    }
});
