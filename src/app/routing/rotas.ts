import { Routes } from '@angular/router';

import { DetalhesEventoComponent } from '../detalhes-evento/detalhes-evento.component';
import { PrincipalComponent } from '../principal/principal.component';
import { LandingComponent } from '../landing/landing.component';
import { FormEventoComponent } from '../form-evento/form-evento.component';
import { InjectionToken, NgModule } from '@angular/core';

export const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');

export const rotas: Routes = [

    {path: 'home', component: LandingComponent},
    {path: 'home/:login', component: LandingComponent},
    {path: 'eventos', component: PrincipalComponent},
    {path: 'detalhesEvento/:id', component: DetalhesEventoComponent, runGuardsAndResolvers: 'always' },
    {path: 'cadastrarEvento', component: FormEventoComponent},
    {path: '', redirectTo: '/home', pathMatch: 'full'},

    //Substituir DetalhesEventoComponent por outro componente quando a pagina n~;ao for encontrada
    { path: 'externalRedirect', canActivate: [externalUrlProvider], component: DetalhesEventoComponent } 

    //{ path: '**', component: PageNotFoundComponent } --> ACRESCENTAR PÁGINA DE ERRO
];