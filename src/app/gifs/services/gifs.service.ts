import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = "CwzpQGapPXaeeUEFtWZkqbySekElH4YU";
  private giphyEndpoint: string = "https://api.giphy.com/v1/gifs";
  private searchLimit: number = 10;
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  buscarGifs(query: string) {
    query = query.trim().toLocaleLowerCase();
    if (!(this._historial.includes(query))) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', this.searchLimit)
      .set('q', query);
    const fullEndpoint: string = `${this.giphyEndpoint}/search?api_key=${this.apiKey}&q=${query}&limit=${this.searchLimit}`;
    const stringEndpoint = 'https://api.giphy.com/v1/gifs/search?api_key=CwzpQGapPXaeeUEFtWZkqbySekElH4YU&q=naruto&limit=10';
    // Peticion normal
    this.http.get<SearchGifsResponse>(fullEndpoint || stringEndpoint);
    // Peticion usando params
    this.http.get<SearchGifsResponse>(`${this.giphyEndpoint}/search`, {params})
      .subscribe( (response) => {
        this.resultados = response.data;
        this.resultados.sort((a,b) => Number(b.images.downsized_medium.height) - Number(a.images.downsized_medium.height));
        localStorage.setItem('resultados',JSON.stringify(this.resultados));
      });
  }

  constructor(private http: HttpClient) {
    const historialGuardado = localStorage.getItem('historial');
    if (historialGuardado) {
      this._historial = JSON.parse(historialGuardado);
    }
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }
}
