const rawPokemon: RawPokemon[] = require('pokemons/pokemons.json').results;

type Entry<V> = [string, V];

interface RawPokemon {
  name: string;
  national_number: string;
  sprites: {
    large: string;
    normal: string;
  };
  type: string[];
}

export interface Pokemon {
  id: string;
  name: string;
}

function createPokemon(data: RawPokemon): Pokemon {
  return {
    id: data.national_number,
    name: data.name,
  };
}

function createPokemonEntry(pokemon: Pokemon): Entry<Pokemon> {
  return [pokemon.id, pokemon];
}

export const pokemon = Array.from(
  new Map(rawPokemon.map(createPokemon).map(createPokemonEntry)),
).map(([_, pokemon]) => pokemon);

interface EnrichedPokemon extends Pokemon {
  image: string;
  type: string;
}

function createEnrichedPokemon(data: RawPokemon): EnrichedPokemon {
  return {
    id: data.national_number,
    name: data.name,
    image: data.sprites.large,
    type: data.type.join(', '),
  };
}

function createEnrichedPokemonEntry(
  pokemon: EnrichedPokemon,
): Entry<EnrichedPokemon> {
  return [pokemon.id, pokemon];
}

const enrichedPokemon = new Map(
  rawPokemon.map(createEnrichedPokemon).map(createEnrichedPokemonEntry),
);

export function enrichPokemon(id: string): Promise<EnrichedPokemon> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const p = enrichedPokemon.get(id);

      if (p) {
        resolve(p);
      } else {
        reject(`No Pokemon found with id ${id}`);
      }
    }, 1000);
  });
}
