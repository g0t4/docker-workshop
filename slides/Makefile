.PHONY: build run shell
IP=$(shell docker-machine ip)

build:
	@docker build --rm -t whigbee/docker-workshop-slides .

run:
	-@docker rm -f -v docker-workshop-slides
	@docker run -d -p 8000:8000 --name="docker-workshop-slides" -v `pwd`:/revealjs/md whigbee/docker-workshop-slides 
	@open "http://$(IP):8000"

shell:
	@docker exec -it docker-workshop-slides bash
