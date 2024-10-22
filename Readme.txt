1. Install Docker Desktop in your machine.

2. Open the Docker Desktop Application.

3. Run start_services.bat.

4. Do not install any modules/packages in project directory.

5. If you want to add a python module, for example "pandas" just include "pandas" in ./backend/requirements.txt.

6. Simillarly, if you want to install a node package. Edit ./frontend/package.json


Only include source codes in project not modules. This will keep the project file size small. Docker will auto install requirements.
Happy Coding!!!