import { useEffect, useState } from 'react';
import './App.css';

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: { type: { name: string } }[];
}
interface PokemonListItem {
  name: string;
  url: string;
}

const typeColors: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

function App() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    async function loadpokemon() {
      const offset = page * 20;
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`,
      );
      const data = (await res.json()) as { results: PokemonListItem[] };
      const detailPromises = data.results.map((item) =>
        fetch(item.url).then((res) => res.json()),
      );
      const detailedList = await Promise.all(detailPromises);
      setPokemonList(detailedList);
    }
    loadpokemon();
  }, [page]);
  console.log(pokemonList);
  const filteredList = pokemonList.filter((p) =>
    p.name.includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <h1>Pokemon Dex</h1>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="pokemon-grid">
        {filteredList.map((p) => (
          <li
            className={`pokemon-card ${selectedPokemon?.name === p.name ? 'selected' : ''}`}
            key={p.name}
          >
            <button
              onClick={() => setSelectedPokemon(p)}
              className="card-button"
            >
              <span className="dex-number">
                {' '}
                No.{String(p.id).padStart(4, '0')}
              </span>
              <img
                src={p.sprites.other['official-artwork'].front_default}
                alt={p.name}
              />
              <span className="pokemon-name">{p.name}</span>
              <span className="type-row">
                {p.types.map((t) => (
                  <span
                    key={t.type.name}
                    className="type-badge"
                    style={{
                      backgroundColor: typeColors[t.type.name] ?? '#777',
                    }}
                  >
                    {t.type.name}
                  </span>
                ))}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 0))}>
          이전
        </button>
        <span>페이지 {page + 1}</span>
        <button onClick={() => setPage((prev) => prev + 1)}>다음</button>
      </div>
      {selectedPokemon && (
        <div className="detail-box">
          <h2>{selectedPokemon.name}</h2>
          <img
            src={
              selectedPokemon.sprites.other['official-artwork'].front_default
            }
            alt={selectedPokemon.name}
          />
          <p>height: {selectedPokemon.height}</p>
          <p>weight: {selectedPokemon.weight}</p>
          <p>
            type: {selectedPokemon?.types.map((t) => t.type.name).join(',')}
          </p>
          <button onClick={() => setSelectedPokemon(null)}>닫기</button>
        </div>
      )}
    </div>
  );
}

export default App;
