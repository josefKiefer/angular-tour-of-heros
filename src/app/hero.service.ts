import { Injectable } from '@angular/core';
import { HEROES } from './mock-heros';
import { Observable, catchError, of, tap } from 'rxjs';
import { Hero } from './hero';
import { MessagesService } from './messages.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';  // URL to web api
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }

  constructor(private messagesService: MessagesService,
    private http: HttpClient) { }

  getHeros(): Observable<Hero[]> {
    const heroes = this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', [])));
    return heroes;
  }

  getHero(id: number): Observable<Hero | undefined> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`Hero fetched: ${id}`),
        catchError(this.handleError<Hero>('getHero')))
      );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`Hero updated: ${hero.id}`),
        catchError(this.handleError<any>('updateHero')))
      );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((newHero: Hero) => this.log(`hero added: ${newHero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      )
  }

  deleteHero(id: number): Observable<any> {
    return this.http.delete(`${this.heroesUrl}/${id}`, this.httpOptions)
      .pipe(
        tap(_ => this.log(`hero deleted: ${id}`)),
        catchError(this.handleError<any>('deleteHero'))
      )
  }

  searchHeros(term: string) {
    if (!term.trim()) return of([]);

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
      .pipe(
        tap(x => x.length ?
          this.log(`found heroes match term ${term}`)
          : this.log(`no heroes found with term ${term}`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any) => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }

  private log(message: string) {
    this.messagesService.add(message);
  }
}
