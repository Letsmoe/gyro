section .text
	printString:
		push eax
		mov rbx, 0
		_printLoop:
			inc eax
			inc rbx
			mov cl, [eax]
			cmp cl, 0
			jne _printLoop
			
			mov eax, 1
			mov rdi, 1
			pop rdi
			mov rdx, rbx
			syscall

			ret