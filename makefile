ROOT=`pwd`

all: _server _static

_server: server.js

server.js: server.ts
	tsc server.ts -out server.js

_static: static/bellew.js
	tsc static/bellew.ts -out static/bellew.js

static/bellew.js: static/bellew.ts
	tsc static/bellew.ts -out static/bellew.js

run: all
	node server.js

deploy:
	eb deploy
