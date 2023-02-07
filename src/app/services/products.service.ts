import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { retry, catchError, map, switchMap } from 'rxjs/operators';
import { throwError, zip } from 'rxjs';

import { CreateProductDTO, Product, UpdateProductDTO } from './../models/product.model';
import { checkTime } from './../interceptors/time.interceptor';
import { environment } from "./../../environments/environment";
import { error } from '@angular/compiler/src/util';
import { isNgTemplate } from '@angular/compiler';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = `${environment.API_URL}/api/products`;

  //private apiUrl = 'https://young-sands-07814.herokuapp.com/api/products';

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(limit?:number, offset?:number) {
    //return this.http.get<Product[]>('https://fakestoreapi.com/products');
    let params = new HttpParams();
    if(limit && offset){
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(this.apiUrl, { params, context: checkTime() })
    .pipe(
      retry(3),map(produts => produts.map(item => {
        return{
          ...item,
          taxes: .13 * item.price
        }

      }))
    );
    //return this.http.get<Product[]>(this.apiUrl, {params})
  }

  getProductsByPAge(limit:number, offset:number) {
    //return this.http.get<Product[]>('https://fakestoreapi.com/products');
    return this.http.get<Product[]>(this.apiUrl, {
      params: {limit, offset}
    }).pipe(
      retry(3),
      map(produts => produts.map(item => {
        return{
          ...item,
          taxes: .13 * item.price
        }

      }))
    );
  }

  getProduct(id: string) {
    //return this.http.get<Product[]>('https://fakestoreapi.com/products');
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === HttpStatusCode.Conflict){
          return throwError('Algo falla en el server');
        }
        if(error.status === HttpStatusCode.NotFound){
          return throwError('Producto no exixte');
        }
        if(error.status === HttpStatusCode.Unauthorized){
          return throwError('No posee autorización de acceso');
        }
        return throwError('Algo salio mal!!!');
      }
      )
    );
  }

  fetchReadAndUpdte(id: string, dto: UpdateProductDTO){
    return     zip(
      //Ejecutarlos al mismo tiempo / No depende uno del otro
      this.getProduct(id),
      this.update(id, {title: 'Nuevo Cambiado'})
    );
  }
  create(dto: CreateProductDTO){
    return this.http.post<Product>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateProductDTO){
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string){
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}

