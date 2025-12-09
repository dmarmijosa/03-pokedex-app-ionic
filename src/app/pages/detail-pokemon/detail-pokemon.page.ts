import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { ION_COMPONENTS } from 'src/app/shared/utilies-import';
import { PokemonService } from 'src/app/services/pokemon-service';
import { Pokemon } from 'src/app/interfaces/pokemons.interface';
import { arrowBackCircleOutline, arrowBack } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { UtiliesService } from 'src/app/shared/utilies-service';

@Component({
  selector: 'app-detail-pokemon',
  templateUrl: './detail-pokemon.page.html',
  styleUrls: ['./detail-pokemon.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...ION_COMPONENTS, CommonModule, NgOptimizedImage],
})
export class DetailPokemonPage implements OnInit {
  private readonly activatedRouter = inject(ActivatedRoute);
  private readonly pokemonService = inject(PokemonService);
  private readonly sharedService = inject(UtiliesService);
  private readonly router = inject(Router);

  pokemon = signal<Pokemon | null>(null);

  pokemonImage = computed(() => {
    const p = this.pokemon();
    if (!p) return '';
    return (
      p.sprites?.other?.['official-artwork']?.front_default ||
      p.sprites?.front_default ||
      ''
    );
  });

  constructor() {
    addIcons({
      arrowBackCircleOutline,
      arrowBack,
    });
  }

  ngOnInit() {
    const pokemonId = this.activatedRouter.snapshot.paramMap.get('id');

    if (!pokemonId) {
      this.goBack();
      return;
    }

    this.sharedService.presentLoading('Pokémon details loaded!');

    this.pokemonService.getPokemonById(Number(pokemonId)).subscribe({
      next: (pokemon) => {
        console.log('Fetched Pokémon details:', pokemon);
        this.pokemon.set(pokemon);
      },
      error: (error) => {
        this.goBack();
        console.error('Error fetching Pokémon details:', error);
      },
      complete: () => {
        console.log('Completed fetching Pokémon details');
        this.sharedService.dismissLoading();
      },
    });
  }

  goBack() {
    this.router.navigate(['/list-pokemons']);
  }
}
