var SocialCard = React.createClass(
{
    render: function()
    {
        var renderLink = function(link)
        {
            return <li><a href={link.href}>{link.text}</a></li>
        };

        return <div className="card">
            <h3>{this.props.name}</h3>
            <table><tr><td>
                <img width="150" height="150" src={this.props.img} />
            </td><td>
                <ul>{this.props.links.map(renderLink)}</ul>
            </td></tr></table>
        </div>;
    }
});
