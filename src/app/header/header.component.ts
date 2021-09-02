import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { Usuario } from '../models/usuario';
import { AuthenticatedUserService } from '../servicos/authenticated-user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  msgError = null;
  usuarioLogado: Usuario = null;

  constructor(private router: Router,
    private persistenceService: AuthenticatedUserService) { }


atualizaListaUsuarios() {

  this.usuarioLogado = this.persistenceService.getUser("loggedUser");

  if (this.usuarioLogado == null) {

    this.usuarioLogado = new Usuario();
    this.usuarioLogado.userName = "Visitor";
  }
}


  ngOnInit() {
    this.atualizaListaUsuarios();
  }

  openFormCadastraEvento() {
    this.router.navigate(['/cadastrarEvento']);
  }
}
