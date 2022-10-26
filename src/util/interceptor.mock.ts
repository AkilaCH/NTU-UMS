import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';


const urls = [];

@Injectable()
export class HttpMockRequestInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) {}

    matchRuleShort(str, rule) {
      const escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
      return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        for (const element of urls) {
            if (this.matchRuleShort(request.url, element.url)) {
                return of(new HttpResponse({ status: 200, body: ((element.json) as any).default }));
            }
        }

        return of(new HttpResponse({ status: 200, body: (({}) as any) }));
    }
}
