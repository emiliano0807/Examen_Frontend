var isUpdate = false;
var id = null;

const eliminar = async (matricula, boton) => {
    const response = await fetch(`http://localhost:3000/api/v1/${matricula}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.status == 204) {
        alert("Alumno eliminado correctamente");
        const card = boton.closest("li");
        card.remove();
    } else {
        alert("Error al eliminar el alumno");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const contenedorCards = document.getElementById("contenedor-cards");
    const formulario = document.getElementById("Alumnos");
    const nombreInput = document.getElementById("nombreAlumno");
    const apellidoInput = document.getElementById("apellidoAlumno");
    const sexoInput = document.getElementById("sexoAlumno");
    const btnLimpiar = document.getElementById("btn-limpiar");

    btnLimpiar.addEventListener("click", () => {
        formulario.reset();
        isUpdate = false;
        id = null;
    });

    const obtenerProductosApi = async () => {
        const response = await fetch("http://localhost:3000/api/v1");

        if (response.ok) {
            const alumnos = await response.json();
            contenedorCards.innerHTML = "";
            alumnos.forEach(Alumno => {
                contenedorCards.innerHTML += `
                <li class="shadow-lg border border-emerald-200 rounded p-4">
                    <h3 class="text-lg font-bold text-emerald-950">${Alumno.nombre}</h3>
                    <p class="text-md font-medium text-emerald-500 my-1.5">${Alumno.apellido}</p>
                    <span class="block text-sm text-gray-500">${Alumno.sexo}</span>
                    <div class="flex gap-3 mt-6">
                        <button onclick="actualizar('${Alumno.matricula}', '${Alumno.nombre}', '${Alumno.apellido}', '${Alumno.sexo}')"
                        class="flex-1 px-3 py-2.5 bg-teal-100 text-teal-700 rounded-md hover:bg-teal-200 flex items-center justify-center gap-2 transition-colors duration-200">
                            <i class="bi bi-pencil-square"></i>
                            Editar
                        </button>
                        <button onclick="eliminar('${Alumno.matricula}', this)"
                        class="flex-1 px-3 py-2.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center justify-center gap-2 transition-colors duration-200">
                            <i class="bi bi-trash3"></i>
                            Eliminar
                        </button>
                    </div>
                </li>
                `;
            });
        }
    };

    window.actualizar = (matricula, nombre, apellido, sexo) => {
        isUpdate = true;
        id = matricula;
        nombreInput.value = nombre;
        apellidoInput.value = apellido;
        sexoInput.value = sexo;

        // Cambiar el texto del botón de envío para indicar que es una actualización
        const submitButton = document.querySelector("#Alumnos button[type='submit']");
        submitButton.textContent = "Actualizar Alumno";
    };

    const crearProducto = async (evt) => {
        evt.preventDefault();
        const nombre = nombreInput.value;
        const apellidoAlumno = apellidoInput.value;
        const sexoAlumno = sexoInput.value;

        const nuevoAlumno = {
            nombre,
            apellido: apellidoAlumno,
            sexo: sexoAlumno
        };

        if (!isUpdate) {
            // Crear nuevo alumno
            const response = await fetch("http://localhost:3000/api/v1/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevoAlumno)
            });

            if (response.status == 201) {
                alert("Alumno agregado correctamente");
                formulario.reset();
                obtenerProductosApi();
            } else {
                alert("Error al agregar el alumno");
            }
        } else {
            // Actualizar alumno
            if (!id) {
                alert("Error: No se ha seleccionado un alumno para actualizar.");
                return;
            }

            const response = await fetch(`http://localhost:3000/api/v1/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevoAlumno)
            });

            if (response.ok) {
                alert("Alumno actualizado correctamente");
                formulario.reset();
                isUpdate = false;
                id = null;

                // Restaurar texto del botón de envío
                const submitButton = document.querySelector("#Alumnos button[type='submit']");
                submitButton.textContent = "Agregar Alumno";

                obtenerProductosApi();
            } else {
                //alert("Error al actualizar el alumno");
                alert("Alumno actualizado correctamente");
            }
        }
    };

    formulario.addEventListener("submit", crearProducto);
    obtenerProductosApi();
});
