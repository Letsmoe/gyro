all: compile link run

run:
	cd ./bin/ && ./result

link:
	cd ./bin/ && ld ./result.o -o result

compile: 
	cd ./bin/ && nasm -g -f elf64 ./result.asm -o ./result.o