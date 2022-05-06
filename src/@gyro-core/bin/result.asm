%include "./printnum.asm"

section .text
	global _start
	_start:
		mov rbp, rsp
		mov DWORD [rbp-4], 5
		mov edx, 6
		mov eax, 5
		imul eax, edx
		mov edx, DWORD [rbp-4]
		add eax, edx
		mov DWORD [rbp-8], eax
		call printnum

		mov rax, 60
		mov rdi, 0
		syscall