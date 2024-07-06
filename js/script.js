
const dirApi = 'https://pokeapi.co/api/v2/pokemon';
const aplicacion = document.getElementById('app');
const entradaBusqueda = document.getElementById('searchInput');
const botonBuscar = document.getElementById('searchBtn');
const botonAnterior = document.getElementById('prevBtn');
const botonSiguiente = document.getElementById('nextBtn');
const botonReiniciar = document.getElementById('resetBtn');
let paginaActual = 1;
const limite = 10;

const obtenerPokemon = async (url) => {
  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    return null;
  }
};

const mostrarPokemon = (listaPokemon) => {
  aplicacion.innerHTML = '';
  listaPokemon.forEach(pokemon => {
    const pokemonDiv = document.createElement('div');
    pokemonDiv.classList.add('pokemon');
    pokemonDiv.innerHTML = `
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <p>${pokemon.name}</p>
    `;
    aplicacion.appendChild(pokemonDiv);
  });
};

const obtenerListaPokemon = async (pagina = 1) => {
  const offset = (pagina - 1) * limite;
  const url = `${dirApi}?offset=${offset}&limit=${limite}`;
  const datos = await obtenerPokemon(url);
  if (datos && datos.results) {
    const promesasPokemon = datos.results.map(resultado => obtenerPokemon(resultado.url));
    const listaPokemon = await Promise.all(promesasPokemon);
    mostrarPokemon(listaPokemon);
  }
};

const buscarPokemon = async () => {
  const terminoBusqueda = entradaBusqueda.value.toLowerCase().trim();
  if (terminoBusqueda) {
    const url = `${dirApi}/${terminoBusqueda}`;
    const datos = await obtenerPokemon(url);
    if (datos) {
      mostrarPokemon([datos]);
    } else {
      aplicacion.innerHTML = '<p class="error-message">Pokemon no encontrado</p>';
    }
  } else {
    obtenerListaPokemon(paginaActual);
  }
};

const reiniciarListaPokemon = () => {
  entradaBusqueda.value = '';
  paginaActual = 1;
  obtenerListaPokemon(paginaActual);
};

botonBuscar.addEventListener('click', buscarPokemon);
botonAnterior.addEventListener('click', () => {
  if (paginaActual > 1) {
    paginaActual--;
    obtenerListaPokemon(paginaActual);
  }
});
botonSiguiente.addEventListener('click', () => {
  paginaActual++;
  obtenerListaPokemon(paginaActual);
});
botonReiniciar.addEventListener('click', reiniciarListaPokemon);

obtenerListaPokemon(paginaActual);