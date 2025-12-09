import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  standalone: true,
  imports: [...ION_COMPONENTS, CommonModule, FormsModule],
})
export class DetailPokemonPage implements OnInit {
  private readonly activatedRouter = inject(ActivatedRoute);
  private readonly pokemonService = inject(PokemonService);
  private readonly sharedService = inject(UtiliesService);
  private readonly router = inject(Router);
  constructor() {
    addIcons({
      arrowBackCircleOutline,
      arrowBack,
    });
  }

  pokemon = signal<Pokemon>({} as Pokemon);

  ngOnInit() {
    const pokemonId = this.activatedRouter.snapshot.paramMap.get('id') || '';
    this.sharedService.presentLoading('Pokémon details loaded!');

    this.pokemonService.getPokemonById(Number(pokemonId)).subscribe({
      next: (pokemon) => {
        console.log('Fetched Pokémon details:', pokemon);
        this.pokemon.set(pokemon);
      },
      error: (error) => {
        this.router.navigate(['/list-pokemons']);
        console.error('Error fetching Pokémon details:', error);
      },
      complete: () => {
        console.log('Completed fetching Pokémon details');
        this.sharedService.dismissLoading();
      },
    });
    console.log(
      'DetailPokemonPage initialized' +
        this.activatedRouter.snapshot.paramMap.get('id')
    );
  }

  goBack() {
    this.router.navigate(['/list-pokemons']);
  }
}
