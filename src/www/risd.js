var ROWS=25, COLS=80;
var CharData = function(row, col)
{
	this.el = null;
	this.row = row;
	this.col = col;
	this.id = row + ":" + col;
	this.char = " ";
	this.opacity=1.0;
}
CharData.prototype = 
{
	update : function()
	{
	    this.el = this.el || document.getElementById(this.id);
		if (this.el)
		{
			var html = '&nbsp;'
			if (this.char == ' ' || this.opacity <= 0)
				html = '&nbsp';	
			if (this.char == '<')
				html = '&lt;';
			else
				html = this.char;
			if (this.opacity > 0 && this.opacity < 1)
				this.el.innerHTML= '<span style="opacity:' + this.opacity + '">' + html + '</span>';
			else
				this.el.innerHTML= html;
			var selected = (this.row == State.cursor.row && this.col == State.cursor.col);
			this.el.className = selected ? "selected" : "";
		}
	},
	fade : function()
	{
		if (this.char == ' ')
		  return;
		this.opacity = this.opacity*0.99 - 0.005;
		if (this.opacity <= 0)
		    this.char = ' ';
		this.update();
	}
};
var State;
var ws;


function initState()
{
	State = {cursor: {row:Math.floor(Math.random()*20), col:Math.floor(Math.random()*60)}, chars:[]};
	for (var r=0 ; r<ROWS ; r++) 
	{
		State.chars[r] = [];
		for (var c=0; c<COLS ; c++) 
			State.chars[r][c] = new CharData(r,c);
	}
}
function isprint(char) 
{
     return !( /[\x00-\x08\x0E-\x1F\x80-\xFF]/.test(char));
}
function onKeyPress()
{
	if (event.ctrlKey || event.metaKey)
	    return;
	var prev_cursor = {row:State.cursor.row, col:State.cursor.col };
	if (event.key.length == 1)
	{
		var char = event.key; // String.fromCharCode(event.keyCode);
		if (isprint(char))
		{
			ws.send(JSON.stringify({row:State.cursor.row, col:State.cursor.col, text:char}));
			State.cursor.col += 1;
			if (State.cursor.col >= COLS)
				State.cursor.row+=1;
		}
		else
		{
			console.log(event.keyCode);
		}
	}
	else if (event.key == "ArrowUp")
		State.cursor.row -= 1;
	else if (event.key == "ArrowDown")
		State.cursor.row += 1;
	else if (event.key == "ArrowRight")
		State.cursor.col += 1;
	else if (event.key == "ArrowLeft")
		State.cursor.col -= 1;
	else if (event.key == "Backspace")
		State.cursor.col -= 1;
	else if (event.key == "Enter")
	{
		State.cursor.col = 0;
		State.cursor.row += 1;
	}
	if (State.cursor.row >= ROWS)
		State.cursor.row -= ROWS;
	else if (State.cursor.row < 0)
		State.cursor.row += ROWS;
	if (State.cursor.col >= COLS)
		State.cursor.col -= COLS;
	else if (State.cursor.col < 0)
		State.cursor.col += COLS;

    State.chars[State.cursor.row][State.cursor.col].update();
	State.chars[prev_cursor.row][prev_cursor.col].update();
}
function onLoad()
{
	initState();
	document.body.onkeydown=onKeyPress;
	drawApp();
	fadeAll();
	State.chars[State.cursor.row][State.cursor.col].update();
} 
function fadeAll()
{
	for (var r=0 ; r<ROWS; r++)
	for (var c=0 ; c<COLS ; c++)
	    State.chars[r][c].fade();
	window.setTimeout(fadeAll,500);
}
function drawApp()
{
	var el = document.getElementById("app");
	var html = [];
	html.push('<table class="app" cellspacing=0>');
	for (var r=0 ; r<ROWS; r++)
	{
		html.push("<tr>");
		for (var c=0 ; c<COLS ; c++)
		{
			var ch = State.chars[r][c].char;
			var opacity = State.chars[r][c].opacity;
			html.push('<td style="opacity:' + opacity + ';" id=\"' + r + ":" + c + '\">' + (ch==' '?'&nbsp;':ch)+'</td>');
		}
		html.push("</tr>");
	}
	html.push("</table>");
	el.innerHTML=html.join('');
	setupWebSocket();
}
function setupWebSocket()
{		
	ws = new WebSocket("ws://34.216.152.61:8081/");
	//ws = new WebSocket("ws://www.bellew.net:81/")
	ws.onmessage = function (evt) 
	{ 
		var change = JSON.parse(evt.data);
		if (change.row >= 0 && change.row < ROWS && change.col >=0 && change.col <= COLS && change.text)
		{
			var len = change.text.length;
			for (var i=0 ; i<len ; i++)
			{
				var to = change.col + i;
				if (to < COLS)
				{
					var char = State.chars[change.row][to];
					char.char = change.text[i];
					char.opacity=1.0;
					char.update();
				}
			}
		}
	};
	ws.onopen = function() 
	{
//		ws.send("refresh"); 
	};
}

window.onload=onLoad;
