ROOT=`pwd`

build: _server _static

_server: server.js

server.js: server/server.ts
	tsc server/server.ts -out server.js

_static: static/bellew.js static/templates.js

static/templates.js : static/templates/card.jsx
	jsx static/templates/*.jsx > static/templates.js

static/bellew.js: static/bellew.ts
	tsc static/bellew.ts -out static/bellew.js

_run: build
	node server.js

_deploy: build
	/opt/local/Library/Frameworks/Python.framework/Versions/2.7/bin/eb deploy
