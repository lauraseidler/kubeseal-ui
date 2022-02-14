init: install chown start logs

start:
	docker-compose up -d

stop:
	docker-compose stop

logs:
	docker-compose logs -f

install:
	docker-compose run --rm ui npm install
	docker-compose run --rm ui ./node_modules/.bin/remix setup node

chown:
	docker-compose run --rm ui chown -R 1000:1000 .cache build public/build

enter:
	docker-compose run --rm ui sh

copy-node-modules:
	docker cp $$(docker-compose ps -q ui):/srv/node_modules/. src/node_modules
