%include "printnum.asm"
section .text
	global _start
	_start:
		mov rbp, rsp
		push 8
		push 7
		push 2
		push 1
		call add
		mov DWORD [rbp-24], eax
		mov eax, DWORD [rbp-4]
		call printnum
		push 5
		call printnum
		mov rax, 60
		mov rdi, 0
		syscall

	add:
		mov rbp, rsp
		mov edx, DWORD [rbp+16]
		mov eax, DWORD [rbp+24]
		add eax, edx
		mov edx, eax
		mov eax, DWORD [rbp+32]
		add eax, edx
		mov edx, eax
		mov eax, DWORD [rbp+40]
		add eax, edx
		mov DWORD [rbp-4], eax
		mov eax, DWORD [rbp-4]
		ret
