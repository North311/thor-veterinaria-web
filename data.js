/* Datos editables de Thor. Más adelante vendrán de la base de datos (API ASP.NET Core). */
window.THOR = {
  telefono: "51927219409",
  // [id, nombre, descripción, precio (S/), duración (min)]
  servicios: [
    [1, "Consulta general", "Revisión completa, control de peso y orientación para el día a día.", 60, 30],
    [2, "Vacunación", "Esquema completo para cachorros y refuerzos anuales.", 45, 15],
    [3, "Desparasitación", "Tratamiento interno y externo según peso y edad.", 35, 15],
    [4, "Baño y corte", "Baño medicado o higiénico, corte de pelo y uñas.", 70, 60],
    [5, "Limpieza dental", "Retiro de sarro y revisión de encías.", 180, 60],
    [6, "Cirugía menor", "Esterilización, extracción de masas y suturas.", 250, 90]
  ],
  especialistas: ["Dra. Camila Rojas", "Dr. Mateo Salas", "Dra. Lucía Paredes"],
  posts: [
    { fecha: "12 sep 2026", titulo: "Calendario de vacunas para tu cachorro", resumen: "Qué dosis necesita en sus primeros meses y cuándo aplicarlas.",
      cuerpo: ["Las primeras vacunas suelen empezar entre las 6 y 8 semanas de vida, y los refuerzos se repiten cada 3 o 4 semanas hasta completar el esquema.",
               "El esquema exacto depende de la edad, la raza y el entorno de tu cachorro, por eso lo define el veterinario en la primera consulta.",
               "Lleva su carné de vacunación a cada visita y agenda el refuerzo anual apenas termine el esquema inicial."] },
    { fecha: "28 ago 2026", titulo: "Cinco señales de que debe ver al veterinario", resumen: "Cambios en el apetito, el ánimo o la respiración que no conviene esperar.",
      cuerpo: ["No esperes si tu mascota deja de comer por más de un día, tiene vómitos o diarrea repetidos, o respira con dificultad.",
               "También consulta si está muy decaída, si hay sangre en la orina o las heces, o si intenta orinar y no puede.",
               "Ante una emergencia usa el botón rojo de esta página: atendemos las 24 horas."] },
    { fecha: "5 ago 2026", titulo: "Cómo cuidar a tu mascota en el calor", resumen: "Agua, sombra y horarios de paseo para que lo disfrute sin riesgos.",
      cuerpo: ["Deja siempre agua fresca y un lugar con sombra, y saca a pasear a tu mascota temprano o al atardecer.",
               "Nunca la dejes dentro de un auto, ni siquiera unos minutos. El asfalto caliente también puede quemarle las patas.",
               "Si jadea en exceso, babea mucho o se muestra desorientada, llévala a un lugar fresco y consulta de inmediato."] }
  ]
};
