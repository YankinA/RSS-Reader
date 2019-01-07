 
install:
	npm install

publish:
	npm publish

	lint:
 	npm run eslint .

build:
	rm -rf dist
	NODE_ENV=production npm run webpack

develop:
	npm run webpack-dev-server
