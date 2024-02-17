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
    console.log("categlkja =><");
    console.log(this.categories);
  }

  getAllCategory() {
    this.categoryService.getAllCategory().subscribe((response) => {
      this.categories = response;
      console.log("categories:");
      console.log(this.categories);
    });
  }

  onAddClick() {
    // Add a new category
    const newCategory = new Category();
    this.categories.push(newCategory);
    this.onAddCategories.push(newCategory);
  }

  onDeleteClick(category: any) {
    console.log("on deletee =>")
    console.log(category);
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

    //delete categories
    let idsToDelete: number[] = [];
    this.onDeleteCategories.forEach(category => idsToDelete.push(category.id!));
    if (idsToDelete.length > 0) {
      console.log("idsToDelete =>")
      console.log(idsToDelete)
      this.categoryService.deleteCategories(idsToDelete).subscribe(
        (response) => {},
        (error) => {
          if(error.status ==200){
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category is successfully deleted' });
          }else {
            this.getAllCategory();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category already has locations' });
          }
          
        }
      );
    }
    //add categories
    this.onAddCategories.forEach((cat) => {
      this.categoryService.createCategory(cat).subscribe((res) => {
        if (res) {
          console.log("after submit");
          console.log(this.categories);
          this.categoryService.getAllCategory().subscribe((res)=>{
            this.categories = res;
          });
          this.onAddCategories = [];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category is successfully added' });
        }
      })
    })

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
