docker-start:
	docker-compose -p midterm up -d

docker-stop:
	@docker-compose -p midterm down || true
	@docker rmi $$(docker images 'midterm_app' -q) || true	