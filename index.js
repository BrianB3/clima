const apiUrl = 'https://api.weatherapi.com/v1/forecast.json?key=2989ac1950fe4dbf9e8222555240206&q=Maldonado&days=5&aqi=no&alerts=no&lang=es';
let hourlyWindSpeeds = [];

async function mostrarClimaActual() {
  try {
    const respuesta = await fetch(apiUrl);

    // Verificar si la solicitud fue exitosa
    if (!respuesta.ok) {
      throw new Error('Error en la solicitud: ' + respuesta.statusText);
    }

    // Convertir la respuesta a JSON
    const datos = await respuesta.json();

    // Obtener elementos del DOM
    const temperatura = document.getElementById('temperatura');
    const viento = document.getElementById('viento');
    const condicion = document.getElementById('condicion');
    const iconoCondicion = document.getElementById('icono-condicion');
    const cardProximosDias = document.querySelectorAll('.card-proximo-dia');

    // Actualizar el contenido del HTML con los datos del clima
    temperatura.textContent = Math.round(datos.current.temp_c);
    viento.textContent = Math.round(datos.current.wind_kph);
    condicion.textContent = datos.current.condition.text;
    iconoCondicion.src = datos.current.condition.icon.substring(21);

    for (let i = 0; i < cardProximosDias.length; i++) {
        const img = cardProximosDias[i].querySelector('img');
        const dia = cardProximosDias[i].querySelector('.span-dia');
        const min = cardProximosDias[i].querySelector('.span-min');
        const max = cardProximosDias[i].querySelector('.span-max');

        img.src = `${datos.forecast.forecastday[i].day.condition.icon.substring(21)}`;
        let epochdate = `${datos.forecast.forecastday[i].date_epoch}`
        dia.innerHTML = obtenerDiaAbreviado(epochdate);
        max.innerHTML = `${Math.round(datos.forecast.forecastday[i].day.maxtemp_c)}º | `
        min.innerHTML = `${Math.round(datos.forecast.forecastday[i].day.mintemp_c)}º`
    }

    // Guardar las velocidades del viento por hora
    hourlyWindSpeeds = datos.forecast.forecastday[0].hour.map(hora => Math.round(hora.wind_kph));

    // Actualizar la velocidad del viento para la hora inicial (00:00)
    updateWindSpeed(0);

  } catch (error) {
    // Manejar errores
    console.error('Error al obtener los datos del clima:', error);
  }
}

function updateWindSpeed(hour) {
    const vientoHora = document.getElementById('viento-hora');
    const hora = document.getElementById('hora');
    vientoHora.textContent = hourlyWindSpeeds[hour];
    hora.textContent = hour.toString().padStart(2, '0') + ":00";
}

function obtenerDiaAbreviado(epochTime) {
    const date = new Date(epochTime * 1000);
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    console.log(diasSemana[date.getUTCDay()])
    return diasSemana[date.getUTCDay()];
}

mostrarClimaActual();