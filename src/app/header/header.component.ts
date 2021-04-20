import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { BackServiceService } from '../servicos/back-service.service';
import { Usuario } from '../models/usuario';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  msgError: string;
  usuarioLogado: Usuario;

  constructor(private router: Router,
    private service: BackServiceService) {
      this.atualizaListaUsuarios(); 
    }


atualizaListaUsuarios() {
  setTimeout (() => {
    this.service.getUsuario()
    .subscribe((usuario) => this.usuarioLogado = usuario,
    msgError => this.msgError = <any>msgError);
  }, 500);
}


  ngOnInit() {
  }

  openFormCadastraEvento() {
    this.router.navigate(['/externalRedirect', { externalUrl: 'http://localhost:8080/myapp/saveEvent' }]);
  }

}
