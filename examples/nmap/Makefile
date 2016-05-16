.PHONY: build 

NAME=nmap
VERSION=dev
IMAGE_NAME=$(NAME):$(VERSION)

build:
	docker build --rm -t $(IMAGE_NAME) . 

clean:
	docker rmi $(IMAGE_NAME)
	-docker rmi $(docker images -qf "dangling=true")
