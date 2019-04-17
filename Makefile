all: test.o
	gcc -o test test.o

clean:
	rm -rf test *.o

%.o:
	gcc -c test.c
