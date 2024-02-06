import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { Category } from 'src/models/Category';
import { CategoryService } from 'src/services/category.service';
import { MarkerService } from 'src/services/marker.service';

@Component({
  selector: 'app-consulter-categorie',
  templateUrl: './consulter-categorie.component.html',
  styleUrls: ['./consulter-categorie.component.css'],
  providers: [MessageService],
})
export class ConsulterCategorieComponent {
  categories: Category[] = [];
  onDeleteCategories: Category[] = [];
  onAddCategories: Category[] = [];
  clonedProducts: { [s: string]: Category; } = {};

  constructor(private categoryService: CategoryService, private markerService: MarkerService, private messageService: MessageService) {

  }

  ngOnInit(): void {
    this.getAllCategory();
    console.log("categlkja =><" + this.categories);
  }

  getAllCategory() {
    this.categoryService.getAllCategory().subscribe((response) => {
      this.categories = response;
      console.log("categories:" + this.categories);
    });
  }

  onAddClick() {
    // Add a new category
    const newCategory = new Category(); 
    this.categories.push(newCategory);
    this.onAddCategories.push(newCategory);
  }

  onDeleteClick(category: any) {
    // Delete a category
    const index = this.categories.indexOf(category);
    if (index !== -1) {
      this.categories.splice(index, 1);
      // If the category was added previously, remove it from addedCategories
      const addedIndex = this.onAddCategories.indexOf(category);
      if (addedIndex !== -1) {
        this.onAddCategories.splice(addedIndex, 1);
      } else {
        // Otherwise, add it to deletedCategories
        this.onDeleteCategories.push(category);
      }
    }
  }
  
  cancel() {
    this.onDeleteCategories = [];
    this.getAllCategory();
  }
  submit() {
    this.onAddCategories.forEach(element => {
      console.log("adeed cat: " + element.name);
    });
    
    let ids: number[] = [];
    this.onDeleteCategories.forEach(category => ids.push(category.id!));
    if (!this.hasLocations(ids)) {
      console.log("ids=>" + ids);
      this.categoryService.deleteCategories(ids).subscribe(
        (response) => {
          console.log('Delete request successful', response);
        },
        (error) => {
          console.error('Error sending delete request', error);
        }
      );
    } else {
      console.log('one of the categories already has a location');
    }

  }
  hasLocations(ids: number[]): Observable<boolean> {
    const observables = ids.map(id =>
      this.markerService.getLocationsByCategory(id).pipe(
        map(result => result !== null),
        catchError(() => of(false)) // Handle errors and return false
      )
    );

    return forkJoin(observables).pipe(
      map(results => results.some(result => result))
    );
  }

  onRowEditInit(product: Category) {
    this.clonedProducts[product.id!] = { ...product };
  }

  onRowEditSave(product: Category) {
      delete this.clonedProducts[product.id!];
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
  }

  onRowEditCancel(product: Category, index: number) {
    this.categories[index] = this.clonedProducts[product.id!];
    delete this.categories[product.id!];
  }
}
