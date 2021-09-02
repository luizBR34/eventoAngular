import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { dialogConfig } from '../shared/dialogConfig';
import { LoginComponent } from '../login/login.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExchangeDataService } from '../servicos/exchange-data.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {

  login: boolean = null;
  isLoading: boolean = false;
  private errorSub: Subscription;

  constructor(private dialog: MatDialog, 
    private rota: ActivatedRoute,
    private router: Router,
    private exchangeData: ExchangeDataService) { }

  ngOnInit() {

    this.errorSub = this.exchangeData.getSubject().subscribe(status => {
      this.isLoading = status;
    });

    this.rota.queryParams
    .subscribe(params => {
      this.login = params.login;
    });


    if (this.login != null) {
      this.openLoginDialog();
    } 

  }


  openMainPage() {
    this.router.navigate(['/externalRedirect', { externalUrl: 'https://localhost:8443/myapp/oauth2/authorization/eventoas' }]);
  }



  openLoginDialog(): void {

    dialogConfig.data = "LOGIN";
    let dialogRef = this.dialog.open(LoginComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => console.log("Dialog output:", data)
    ); 

  }

  cadastrar() {

  }


  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }

}
