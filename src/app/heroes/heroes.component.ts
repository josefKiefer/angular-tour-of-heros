import { Component, inject } from '@angular/core';
import { Hero } from '../hero';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';
import { NgFor } from '@angular/common';
import { HeroService } from '../hero.service';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.css',
})
export class HeroesComponent {
  heroes: Hero[] = [];
  selectedHero?: Hero;

  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes() {
    this.heroService.getHeros()
      .subscribe(heros => this.heroes = heros);
  }

  addHero(name: string) {
    name = name.trim();
    if (!name) return;
    this.heroService.addHero({name} as Hero)
      .subscribe(hero => {this.heroes.push(hero)});
  }

  deleteHero(hero: Hero) {
    this.heroService.deleteHero(hero.id)
      .subscribe(_ => this.heroes = this.heroes.filter(hero => hero.id !== hero.id))
  }
}
