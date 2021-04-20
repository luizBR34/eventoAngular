import { MatDialogConfig } from '@angular/material'; // --> USADO PARA DIALOGO

export const dialogConfig = new MatDialogConfig(); //Permite mudar as configurações padrão do dialogo

dialogConfig.disableClose = false; //O usuario não será capz de fechar o dialogo clicando fora
dialogConfig.autoFocus = true; //O foco irá para o primeiro componente

