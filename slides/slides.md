
## Cleanup

```
# VMs
docker-machine ls
docker-machine stop default # put VM to sleep if not needed
docker-machine rm -y default # Blow away the whole VM and recreate it

# Containers
docker ps -a # list all containers
docker ps -f 'status=exited' # list exited containers

docker stop CONTAINER # for unused containers
docker rm -v $(docker ps -qf 'status=exited') # -q is quiet mode - just the CID returned, -v remove the volumes too (be careful)
docker rm -v $(docker ps -aq) # will remove everything not running, will error on running containers

# Images
# Growth here is often from rebuilding images and reusing tags which results in dangling images (no longer have a tag because a new image has the tag).
docker images -a # list all images
docker images -f "dangling=true"

docker rmi IMAGE # for unused images
docker rmi $(docker images -f 'dangling=true' -q)

# Volumes
# Growth here is from running containers with volumes that aren't removed when the container is removed. This sureptitiously happens when an image defines a volume and you don't know it.
docker volume ls -f "dangling=true"

docker volume rm $(docker volume ls -qf "dangling=true")

# Networks (these would be removed when no longer needed, growth here would be from docker-compose which creates a new network per project)
docker network ls
docker network rm NETWORK 

# Removing images
docker rmi $(docker images -q)

```

- Most of these are commands you'd use locally and not in a production environment. This is to cleanup experiments. Be careful running some of these commands like rm -v in prod, know what you're doing.
- Growth can be avoided by running temporary containers with --rm which removes both the container and the volume when you stop it.

### Building images

```
*****docker build -t TAG .
docker tag IMAGE[:TAG] [REGISTRYHOST/][USERNAME/]NAME[:TAG] 
*****docker commit
*****docker cp
*****docker import FILE|URL|-
```
- [`docker build`](https://docs.docker.com/engine/reference/commandline/build/)
- [`docker commit`](https://docs.docker.com/engine/reference/commandline/commit/)
- [`docker cp`](https://docs.docker.com/engine/reference/commandline/cp/)

### Managing images

```

docker images

docker export CONTAINER > container.tar # export filesystem of container, NOT volumes
docker save IMAGE > image.tar # export image to archive 
docker load < image.tar.gz # load image from an archive

docker search TERM
docker search -s 3 --automated TERM # must have at least 3 stars and be automated (trusted)
docker pull IMAGE # pulls latest if no tag specified
docker login [SERVER] # login to a registry server, like docker hub
docker logout [SERVER]

# tag and push, tag tells where to push
docker tag IMAGE[:TAG] [REGISTRYHOST/][USERNAME/]NAME[:TAG]
docker push IMAGE

docker rmi IMAGE
```
- Name Format: [REGISTRY_HOST[:REGISTRY_PORT]/]NAME[:TAG]
- [`docker export`](https://docs.docker.com/engine/reference/commandline/export/)
- [`docker images`](https://docs.docker.com/engine/reference/commandline/images/)
- [`docker load`](https://docs.docker.com/engine/reference/commandline/load/)
- [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/)

### Managing containers

```

docker create # same as run, just doesn't start container
docker run IMAGE # create and start a container, run given command
docker run --rm IMAGE # remove container, and volumes, when stopped

docker ps
docker ps -a
docker ps -f "status=exited"

docker inspect CONTAINER # verbose details about a container
docker inspect --format="{{.Mounts}}" CONTAINER
docker port CONTAINER
docker diff # list changed files in a container
docker stats [CONTAINER] # live stream of stats, CPU, MEMORY, NET, I/O

docker top CONTAINER # running processes
docker exec CONTAINER ps aux # run ps in container

docker update CONTAINER # mostly used to update constraints
docker rename CONTAINER NEWNAME

# stop sends SIGTERM first, then after grace period sends SIGKILL
docker stop CONTAINER # can lead a container, and its volumes, to be removed if it was started with --rm
docker start CONTAINER
docker restart CONTAINER

docker pause CONTAINER
docker unpause CONTAINER

docker kill CONTAINER 
docker rm -v CONTAINER # remove a container and its volumes

docker wait CONTAINER # wait for a container to stop

```
- Most commands allow you to pass multiple containers (for changing state, removing, etc)
- [`docker run`](https://docs.docker.com/engine/reference/commandline/run/)
- [`docker create`](https://docs.docker.com/engine/reference/commandline/create/)
- [`docker kill`](https://docs.docker.com/engine/reference/commandline/kill/)

### Find out what's running

```
docker info #system wide information, # containers
docker version

```
- [docker ps](https://docs.docker.com/engine/reference/commandline/ps/)
- [docker inspect](https://docs.docker.com/engine/reference/commandline/inspect/)

### Tell me more about an image

```

# layer history
docker history IMAGE

```
- [docker history](https://docs.docker.com/engine/reference/commandline/history/)

## What went wrong!

### Is the container running?

```

# open shell in container
docker exec -it CONTAINER sh 
# run command async
docker exec -d CONTAINER COMMAND 

# attach to running container, see output, or interact with it, Ctrl+C send SIGTERM, Ctrl+P,Q detach
docker attach CONTAINER
#change detach keys if Ctrl+P,Q won't work
--detach-keys="<sequence>"
# or don't send signals to container so Ctrl+C detaches
docker attach --sig-proxy=false CONTAINER`

# follow logs
docker logs -f CONTAINER

```

- [docker exec](https://docs.docker.com/engine/reference/commandline/exec/)
- [docker attach](https://docs.docker.com/engine/reference/commandline/attach/)


### The container won't run

```

# Run shell instead of container's app
docker run -it CONTAINER sh
# Override entrypoint if applicable
docker run -it --entrypoint="" CONTAINER sh

```
- Find Dockerfile, see if anything stands out

### All situations:

```

docker logs CONTAINER`
docker logs --tail[=5] CONTAINER`
docker logs --since=""

```

- Also, check log files on volume mounts, remember excessive output is a often avoided for long lived containers.
- [docker logs](https://docs.docker.com/engine/reference/commandline/logs/)

## Managing volumes

```
docker volume ls

***docker volume create 

docker volume inspect VOLUME # see what containers are using the volume
docker volume rm VOLUME

*** put commands for volume containers in here
```

## Managing networks

```
docker network ls

docker network inspect NETWORK # see connected containers

docker network create -d bridge NETWORK # Create a user defined bridge network
docker network rm NETWORK

# Connect/disconnect containers to a network, also remember --net on docker run will connect a container
docker network connect NETWORK CONTAINER
docker network disconnect NETWORK CONTAINER

```
- User defined networks are a great way to isolate containers that you're uncertain about, don't let them communicate with other containers
- [`docker network create`](https://docs.docker.com/engine/reference/commandline/network_create/)

## NOT SURE WHERE YET

https://docs.docker.com/engine/reference/commandline/events/

## Managing VMs

```
docker-machine ls
docker-machine ssh MACHINE # ssh into a machine
docker-machine create
```
