run:
	docker compose up -d

prepare-yarn-watch:
	docker exec -it touhourpg-app yarn encore dev --watch

db-migrate:
	docker exec -it touhourpg-app php artisan migrate

restart-containers:
	docker exec -it touhourpg-app php artisan cache:clear
	docker exec -it touhourpg-app php artisan config:clear
	docker compose down
	docker compose up -d
