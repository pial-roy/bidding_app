import os

# Replace with the root directory of your project
project_root = 'frontend/src' # Modify this according to your project location

# Function to read and print all files
def read_project_files(root_dir):
    for dirpath, dirnames, filenames in os.walk(root_dir):
        print(f"Directory: {dirpath}")
        for file in filenames:
            file_path = os.path.join(dirpath, file)
            print(f"\tFile: {file_path}")
            # Optional: If you want to print the contents of the file
            try:
                with open(file_path, 'r') as f:
                    print(f"\t\tContents of {file}:")
                    print(f.read())  # This prints the file contents
            except Exception as e:
                print(f"\t\tCould not read {file_path}: {e}")

# Expand the user home directory and read the files
read_project_files(os.path.expanduser('frontend/src'))
read_project_files(os.path.expanduser('backend/app'))