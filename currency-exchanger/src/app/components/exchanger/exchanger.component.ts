import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { ICurrency } from 'src/app/models/currency';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-exchanger',
  templateUrl: './exchanger.component.html',
  styleUrls: ['./exchanger.component.css'],
})
export class ExchangerComponent {
  constructor(
    private apiService: ApiService,
    private storage: StorageService
  ) {}

  currencies$: Observable<ICurrency[]> = this.apiService.getAll();
  lValue: number;
  rValue: number;
  firstFormGroup!: FormGroup;

  myControl = new FormControl('');

  ngOnInit() {
    this.firstFormGroup = new FormGroup({
      lCurrency: new FormControl(''),
      lValue: new FormControl({ value: 1, disabled: true }, [
        Validators.required,
        Validators.pattern(/^\d+(\.\d+)*$/),
      ]),
      rCurrency: new FormControl(''),
      rValue: new FormControl({ value: 0, disabled: true }, [
        Validators.required,
        Validators.pattern(/^\d+(\.\d+)*$/),
      ]),
    });
    this.toStorage('lCurrency');
    this.toStorage('rCurrency');
    this.exchange();

    // this.firstFormGroup
    //   .get('rValue')
    //   ?.valueChanges.subscribe((change) =>
    //     this.firstFormGroup
    //       .get('lValue')
    //       ?.setValue(
    //         (
    //           change *
    //           (this.storage.rightCurrency.rate / this.storage.leftCurrency.rate)
    //         ).toFixed(3)
    //       )
    //   );
    // this.firstFormGroup
    //   .get('rValue')
    //   ?.valueChanges.subscribe((change) =>
    //     this.firstFormGroup.get('lValue')?.setValue(change)
    //   );
  }
  toStorage(value: string) {
    this.firstFormGroup.get(value)?.valueChanges.subscribe((change) => {
      if (value === 'lCurrency') this.storage.leftCurrency = change;
      else this.storage.rightCurrency = change;
      if (this.storage.leftCurrency && this.storage.rightCurrency) {
        this.firstFormGroup.get('lValue')?.enable();
        this.firstFormGroup.get('rValue')?.enable();
      }
    });
  }
  exchange() {
    this.firstFormGroup
      .get('lValue')
      ?.valueChanges.subscribe((change) =>
        this.firstFormGroup
          .get('rValue')
          ?.setValue(
            (
              change *
              (this.storage.leftCurrency.rate / this.storage.rightCurrency.rate)
            ).toFixed(2)
          )
      );
  }
}
