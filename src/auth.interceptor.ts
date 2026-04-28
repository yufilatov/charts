import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const newReq = req.clone({
        headers: req.headers.append("x-apisports-key", "66efb76902a6d793093a95b7d40ed47b"),
    });

    return next(newReq);
}