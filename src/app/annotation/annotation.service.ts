import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnnotationsServise {
  constructor(private http: HttpClient) {}

  getAnnotations(): Observable<{ message: string; status: number }> {
    return this.http.get<{ message: string; status: number }>(
      `https://dummyjson.com/http/200/[{"id":"a1","x":50,"y":60,"radiusX":20,"radiusY":25}]`
    );
  }
}
