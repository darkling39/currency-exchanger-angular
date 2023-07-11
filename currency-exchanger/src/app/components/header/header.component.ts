import { Component } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { ICurrency } from 'src/app/models/currency';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private apiService: ApiService) {}
  currencies$: Observable<ICurrency[]> = this.apiService.getAll().pipe(
    map((data) => {
      return data.filter((filt) => filt.r030 === 840 || filt.r030 === 978);
    }),
    map((data) => {
      data.map((e) => e.rate.toFixed(2));
      return data;
    })
  );
  ngOnInit() {}
}
