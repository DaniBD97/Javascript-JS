#Archivos varios hechos con Javascript


#MD5 

MD5 (Message-Digest Algorithm 5) es una función hash criptográfica que convierte una entrada de datos en un valor de 128 bits (16 bytes) representado comúnmente como una cadena hexadecimal de 32 caracteres. Se usa para verificar la integridad de datos, pero no es segura para aplicaciones criptográficas debido a sus vulnerabilidades ante ataques de colisión.

Características principales de MD5:
Tamaño fijo: Devuelve siempre un hash de 128 bits (32 caracteres en hexadecimal).
Determinística: La misma entrada siempre produce el mismo hash.
Rápida: Puede procesar grandes volúmenes de datos rápidamente.
No reversible: No se puede obtener la entrada original a partir del hash.
Usos comunes:
Verificación de integridad de archivos: Comparando el hash antes y después de la transferencia.
Almacenamiento de contraseñas (desaconsejado): Aunque se usó en el pasado, es inseguro sin medidas adicionales como salting.
Generación de identificadores únicos: En sistemas de almacenamiento o bases de datos.
¿Por qué no se recomienda para seguridad?
MD5 es vulnerable a ataques de colisión y fuerza bruta. Se han desarrollado ataques que permiten generar la misma salida (hash) a partir de diferentes entradas, comprometiendo su fiabilidad en seguridad.

Si necesitas una alternativa más segura, se recomienda usar SHA-256 o bcrypt para contraseñas y SHA-2 o SHA-3 para integridad de datos.
