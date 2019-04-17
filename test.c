#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

int main(int argc, char *argv[]){
	char *str = NULL;
	unsigned char len = 0;

	len = sizeof("Hello World");
	str = (char*)malloc(len);
	if(!str)
		return -1;

	memcpy(str, "Hello World", len-1);

	printf("str: %s\n"
			"len: %d\n", str, len);

	return 0;
}
