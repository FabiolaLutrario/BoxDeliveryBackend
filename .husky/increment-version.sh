#!/bin/bash

# Obtener la versión actual
version=$(cat version.txt)

# Incrementar la versión según la rama de merge
if [ "$BRANCH_NAME" == "develop" ]; then
    # Incrementar el número menor en desarrollo
    new_version=$(echo $version | awk -F. '{$2++;} 1' OFS=.)
elif [ "$BRANCH_NAME" == "main" ]; then
    # Incrementar el número mayor en main
    new_version=$(echo $version | awk -F. '{$1++;} 1' OFS=.)
else
    # Por defecto, incrementar el número de revisión
    new_version=$(echo $version | awk -F. '{$3++;} 1' OFS=.)
fi

# Actualizar el archivo de versión
echo $new_version > version.txt

# Crear un nuevo tag en Git
tag_name="v$new_version"
git tag -a "$tag_name" -m "Versión $new_version"
git push origin "$tag_name"

# Imprimir la nueva versión
echo "Nueva versión: $new_version"
