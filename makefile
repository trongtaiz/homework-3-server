docker-start:
	docker-compose -p final up -d

docker-stop:
	@docker-compose -p final down || true
	@docker rmi $$(docker images 'final_backend' -q) || true	