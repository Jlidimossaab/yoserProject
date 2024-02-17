import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'src/env';
import { Category } from 'src/models/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategoryById(id: Number){
    return this.http.get(environment.url +"/category/findById/" + id);
  }

  getAllCategory(): Observable<Category[]>{
    return this.http.get<Category[]>(environment.url +"/category/findAll" )
      .pipe(
        map((response: Category[]) => response),
        catchError((error) => {
          console.error('Error fetching markers:', error);
          return [];
        })
      );
  }

  createCategory(category: Category){
    return this.http.post(environment.url +"/category/create", category );
  }

  deleteCategories(ids: number[]){
    const params = { ids: ids.join(',') };
    return this.http.delete(environment.url +"/category/delete",{params} );
  }
}
