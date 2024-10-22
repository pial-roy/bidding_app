import os

os.chdir("backend")
print(os.getcwd)

l = os.listdir()

for file_name in l:
	file = open(file_name)
	s = file.read()
	print(file_name, ": ")
	print(s)
	print()


os.chdir("app")
print(os.getcwd)

l = os.listdir()

for file_name in l:
	file = open(file_name)
	s = file.read()
	print(file_name, ": ")
	print(s)
	print()