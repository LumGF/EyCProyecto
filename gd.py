import shutil
import os

# Ruta del proyecto de ejemplo a crear
project_name = "Layouts"
project_dir = f"/mnt/data/{project_name}"

# Estructura básica del proyecto Android
project_structure = {
    "app/src/main/java/com/example/layouts": [
        "MainActivity.kt",
        "LoginActivity.kt",
        "SumActivity.kt",
        "IMCActivity.kt"
    ],
    "app/src/main/res/layout": [
        "activity_main.xml",
        "activity_login.xml",
        "activity_sum.xml",
        "activity_imc.xml"
    ],
    "app/src/main/res/values": [
        "strings.xml",
        "colors.xml",
        "themes.xml"
    ],
    "app/src/main/AndroidManifest.xml": [],
    "build.gradle": [],
    "settings.gradle": [],
    "gradle/wrapper": [
        "gradle-wrapper.properties"
    ]
}

# Crear la estructura de carpetas y archivos vacíos
for path, files in project_structure.items():
    full_path = os.path.join(project_dir, path)
    os.makedirs(full_path, exist_ok=True)
    for file in files:
        open(os.path.join(full_path, file), 'w').close()

# Comprimir el proyecto en un archivo ZIP
zip_path = f"/mnt/data/{project_name}.zip"
shutil.make_archive(zip_path.replace(".zip", ""), 'zip', project_dir)

zip_path
