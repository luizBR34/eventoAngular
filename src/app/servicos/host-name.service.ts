import { Injectable, Inject } from '@angular/core';
import { WINDOW } from '../shared/window.providers';

@Injectable()
export class HostNameService {

    constructor(@Inject(WINDOW) private window: Window) {
    }

    getEventoRSHost() : string {
        //const url = this.window.location.origin + `/rs`;
        const url = this.window["env"].eventoRSUrl;
        return url;
    }

    getEventoAppHost() : string {
        //const url = this.window.location.origin + `/client`;
        const url = this.window["env"].eventoAppUrl + `/myapp`;
        return url;
    }

    getEventoASHost() : string {
        //const url = this.window.location.origin + `/auth`;
        const url = this.window["env"].eventoASUrl + `/auth`;
        return url;
    }
}