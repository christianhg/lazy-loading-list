import * as React from 'react';
import { render } from 'react-dom';
import { Pokemon, pokemon } from './pokemon';

import 'modern-normalize';
import './styles.css';

class PokemonListItem extends React.Component<
  Pokemon,
  {
    id: string;
    name: string;
  }
> {
  myRef: React.RefObject<Element>;

  constructor(props: Pokemon) {
    super(props);

    this.state = {
      id: props.id,
      name: props.name,
    };

    this.myRef = React.createRef<Element>();
  }

  render() {
    return (
      <li>
        <span className="name">{this.state.name}</span>
      </li>
    );
  }

  componentDidMount() {
    const observer = new IntersectionObserver(
      x => {
        console.log(x);
      },
      {
        threshold: 0.25,
      },
    );

    console.log(this.myRef.current);
    if (this.myRef.current) {
      observer.observe(this.myRef.current);
    }
  }
}

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
