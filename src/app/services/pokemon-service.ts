import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pokemon, PokemonResult } from '../interfaces/pokemons.interface';
import { environment } from '@env/environment';
import { forkJoin, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly httpClient = inject(HttpClient);

  getPokemonList(limit: number = 20, offset: number = 0) {
    return this.httpClient
      .get<PokemonResult>(`${environment.base_url}pokemon`, {
        params: { limit, offset },
      })
      .pipe(
        map((response) => response.results),
        switchMap((results) =>
          forkJoin(results.map((item) => this.getDetailPokemon(item.name)))
        )
      );
  }

  getDetailPokemon(name: string) {
    return this.httpClient.get<Pokemon>(
      `${environment.base_url}pokemon/${name}`
    );
  }

  getPokemonById(id: number) {
    return this.httpClient.get<Pokemon>(`${environment.base_url}pokemon/${id}`);
  }
}
