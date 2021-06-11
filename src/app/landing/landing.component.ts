import { Component, OnInit } from '@angular/core';
import { BackServiceService } from '../servicos/back-service.service';
import { MatDialog } from '@angular/material';
import { dialogConfig } from '../shared/dialogConfig';
import { LoginComponent } from '../login/login.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  login: boolean = null;

  constructor(private dialog: MatDialog, 
    private rota: ActivatedRoute,
    private router: Router,
    private service: BackServiceService) { }

  ngOnInit() {

    this.rota.queryParams
    .subscribe(params => {
      this.login = params.login;
    });


    if (this.login != null) {
      this.openLoginDialog();
      if (!this.login) {
        const signInError = "Error while sign in";
        this.service.error.next(signInError);
      }
    } 

  }


  openMainPage() {
    this.router.navigate(['/externalRedirect', { externalUrl: 'http://localhost:8080/myapp/mainPage' }]);
  }



  openLoginDialog(): void {

    let dialogRef = this.dialog.open(LoginComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => console.log("Dialog output:", data)
    ); 

  }

  cadastrar() {

  }






}
