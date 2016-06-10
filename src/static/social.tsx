/// <reference path='../../typings/jquery/jquery.d.ts' />
/// <reference path='../../typings/react/react.d.ts' />
/// <reference path='../../typings/react/react-dom.d.ts' />
/// <reference path='../../typings/react/react-global.d.ts' />



var staticHost = '/static/';

interface Link
{
    href:string,
    key?:string,
    fa?:string,
    text?:string
}
interface Person
{
    name:string;
    key?:string;
    target:string;
    img:string;
    links:Link[]
}

interface CardProps
{
    person:Person;
}


class Card extends React.Component<CardProps, {}>
{
    render()
    {
        var person = this.props.person;
        return (
            <div style={{backgroundColor:'#eeeeee', padding:'15pt', margin:'15pt'}}>
                <table><tbody>
                    <tr><td>
                        <img width="150" height="150" src={person.img} />
                    </td>
                    <td style={{verticalAlign:'top'}}>
                        <div style={{fontFamily:'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize:'24pt', fontWeight:500, paddingLeft:'20pt'}}>{person.name}</div>
                        <ul style={{listStyleType:'none'}}>
                            {person.links.map(function (link)
                                {
                                    return (
                                        <li	style={{whiteSpace: 'nowrap'}} key={link.key}>
                                            <a href={link.href}><i style={{width:"16px"}} className={link.fa ? "fa fa-"+link.fa : 'fa fa-external-link'}>&nbsp;</i> {link.text||link.key}</a>
                                        </li> );
                                })
                            }
                        </ul>
                     </td></tr>
                </tbody></table>
            </div>);
    }
}


var people:Person[] = [
    {
        name: "Matthew",
        target:'#matt',
        img: staticHost + "matthew.jpg",
        links:[
            {href:'https://instagram.com/matbelnet', key:'Instagram', fa:'instagram'},
            {href:'https://www.labkey.org/', key:'LabKey', fa:'flask'},
            {href:"https://www.facebook.com/WashingtonAllianceforGunResponsibility",key:"Center for Gun Responsibility"}
        ]
    },
    {
        name: "Donna",
        target:'#donna',
        img: staticHost + "donna.jpg",
        links:[
            {href:'https://instagram.com/bellewd', key:'Instagram', fa:'instagram'},
            {href:'https://www.facebook.com/donna.bellew.94', key:'Facebook', fa:'facebook'}
        ]
    },
    {
        name: "Evie",
        target:'#evie',
        img: staticHost + "evie.jpg",
        links:[
            {href:'https://instagram.com/evieeblue', key:'Instagram', fa:'instagram'},
            {href:'https://www.facebook.com/evie.bellew', key:'Facebook', fa:'facebook'},
            {href:'https://vimeo.com/user17097391', key:'Vimeo', fa:'vimeo'},
            {href:'https://soundcloud.com/evie-bellew', key:'Soundcloud', fa:'soundcloud'}
        ]

    },
    {
        name: "John",
        target: '#john',
        img: staticHost + "john.jpg",
        links:[
            {href:'https://instagram.com/jown___', key:'Instagram', fa:'instagram'}
        ]
    },
    {
        name: "Helen",
        target: '#helen',
        img: staticHost + "helen.jpg",
        links:[
            {href:'https://instagram.com/loubellew', key:'Instagram', fa:'instagram'},
            {href:"http://chocolatismblog.weebly.com/", key:"Chocolatism"}
        ]
    },
    {
        name:"Maxine",
        target:'#maxine',
        img: staticHost + "maxine.jpg",
        links:[{href:"https://instagram.com/maxinebellew/", key:"Instagram", fa:'instagram'}]
    },
    {
        name:"Justine",
        target:'#justine',
        img: staticHost + "justine.jpg",
        links:[
            {href:"https://www.facebook.com/justine.bellewbavaro", key:"Facebook", fa:'facebook'},
            {href:"https://instagram.com/jbavaro1719", key:"Instagram", fa:'instagram'}
        ]
    },
    {
        name:"Bill",
        target:'#bill',
        img: staticHost + "bill.jpg",
        links:[{href:"https://www.facebook.com/bill.bellew.7", key:"Facebook", fa:'facebook'}]
    },
    {
        name:"Brendan",
        target:'#brendan',
        img: staticHost + "brendan.jpg",
        links:[{href:"https://www.nsa.gov/", key:" ", fa:'user-secret'}]
    }
];

function renderCards()
{
    for (var i=0;i<people.length;i++)
        people[i].key = "person["+i+"]";
   people.map(function(person){ReactDOM.render(<Card person={person} key={person.key}/>, $(person.target)[0]);});
}
