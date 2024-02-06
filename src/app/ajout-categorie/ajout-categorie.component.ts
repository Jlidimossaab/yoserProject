import { Component, OnInit } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { Category } from 'src/models/Category';
import { CategoryService } from 'src/services/category.service';
import { MarkerService } from 'src/services/marker.service';

@Component({
  selector: 'app-ajout-categorie',
  templateUrl: './ajout-categorie.component.html',
  styleUrls: ['./ajout-categorie.component.css']
})
export class AjoutCategorieComponent implements OnInit{

  constructor(private categoryService:CategoryService,private markerService: MarkerService){

  }
  ngOnInit(): void {
  }

}
