import 'modern-normalize';
import * as React from 'react';
import { render } from 'react-dom';
import { InView } from 'react-intersection-observer';
import { pokemon, Pokemon, enrichPokemon } from './pokemon';
import './styles.css';
import { createLazyLoadMachine } from './statechart';

const PokemonListItem = (pokemon: Pokemon) => {
  let img;

  const statechart = createLazyLoadMachine({
    onLoading: () => {
      enrichPokemon(pokemon.id).then(enrichedPokemon => {
        console.log(enrichedPokemon.image);
        img = enrichedPokemon.image;
      });
    },
  });

  return (
    <InView
      as="li"
      onChange={inView => {
        if (inView) {
          statechart.send('TURNED_VISIBLE');
        } else {
          statechart.send('TURNED_HIDDEN');
        }
      }}
    >
      <span className="name">{pokemon.name}</span>
      {img}
      {img && <img src={img} />}
    </InView>
  );
};

class PokemonList extends React.Component {
  render() {
    return (
      <ul>
        {pokemon.map(p => (
          <PokemonListItem key={p.id} {...p} />
        ))}
      </ul>
    );
  }
}

render(<PokemonList />, document.getElementById('root'));
