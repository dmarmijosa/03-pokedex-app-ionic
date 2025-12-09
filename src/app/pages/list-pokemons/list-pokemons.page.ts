import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from 'src/app/services/pokemon-service';
import { UtiliesService } from 'src/app/shared/utilies-service';
import { ION_COMPONENTS } from '../../shared/utilies-import';
import { Pokemon } from 'src/app/interfaces/pokemons.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ...ION_COMPONENTS],
})
export class ListPokemonsPage implements OnInit {
  private readonly pokemonService = inject(PokemonService);
  private readonly sharedService = inject(UtiliesService);
  private readonly router = inject(Router);
  pokemonsList: Pokemon[] = [];
  private offset = signal(0);
  private limit = signal(20);
  constructor() {}

  ngOnInit() {
    this.sharedService.presentLoading('Loading Pokémon list...');
    this.pokemonService.getPokemonList().subscribe({
      next: (response) => {
        this.pokemonsList = response;
      },
      complete: () => {
        this.sharedService.dismissLoading();
      },
    });
  }

  onIonInfinite(event: any) {
    this.offset.update((value) => value + this.limit());
    this.pokemonService.getPokemonList(this.offset(), this.limit()).subscribe({
      next: (response) => {
        this.pokemonsList = [...this.pokemonsList, ...response];
        event.target.complete();

        // Deshabilitar infinite scroll si no hay más datos
        if (response.length < this.limit()) {
          event.target.disabled = true;
        }
      },
      error: () => {
        event.target.complete();
      },
    });
    console.log(event);
  }

  goToDetail(pokemon: Pokemon) {
    this.router.navigate(['/detail-pokemon', pokemon.id]);
  }
}
