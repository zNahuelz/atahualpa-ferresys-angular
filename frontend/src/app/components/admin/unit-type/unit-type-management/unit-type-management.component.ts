import {Component, inject} from '@angular/core';
import {UnitTypeService} from '../../../../services/unit-type.service';
import {UnitType} from '../../../../models/unit-type.model';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {MatSort} from '@angular/material/sort';
import {DatePipe, Location} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatFabButton, MatMiniFabButton} from '@angular/material/button';
import Swal from 'sweetalert2';
import {ERROR_MESSAGES as em, SUCCESS_MESSAGES as sm, UNIT_TYPE_SEARCH_MODES} from '../../../../utils/app.constants';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-unit-type-management',
  imports: [
    MatProgressSpinner,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatRow,
    MatRowDef,
    MatSort,
    MatTable,
    MatHeaderCellDef,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatFabButton,
    MatOption,
    MatSelect,
    MatMiniFabButton,
    DatePipe,
  ],
  templateUrl: './unit-type-management.component.html',
  styleUrl: './unit-type-management.component.css'
})
export class UnitTypeManagementComponent {
  private unitTypeService = inject(UnitTypeService);
  location = inject(Location);
  loading = false;
  loadError = false;
  searchError = false;
  editFormHidden = true;
  newFormHidden = false;
  hidePagination = false;

  unitTypes: UnitType[] = [];
  dataSource = new MatTableDataSource<UnitType>;
  displayedColumns = ['id', 'name', 'created_at', 'updated_at', 'toolbox'];
  selectedUnitT = 0;
  selectedUniTName = '';

  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  lastPage = 1;
  submitting = false;
  SEARCH_MODES = UNIT_TYPE_SEARCH_MODES;

  newUnitTypeForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
  });

  editUnitTypeForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
  });

  searchForm = new FormGroup({
    keyword: new FormControl('', [Validators.required, Validators.minLength(1)]),
    searchType: new FormControl(0, [Validators.required]),
  });

  ngOnInit() {
    this.fetchUnitTypes();
    this.searchForm.get('searchType')?.valueChanges.subscribe((val) => {
      this.handleSearchType(val!!);
    })
  }

  fetchUnitTypes() {
    this.loading = true;
    this.unitTypeService.getUnitTypesPaginated(this.currentPage).subscribe({
      next: response => {
        this.unitTypes = response.data;
        this.dataSource = new MatTableDataSource<UnitType>(this.unitTypes);
        this.totalItems = response.total;
        this.lastPage = response.last_page;
        if (this.unitTypes.length > 0) {
          this.loading = false;
        } else {
          this.loading = false;
          this.loadError = true;
        }
      },
      error: error => {
        this.loading = false;
        this.loadError = true;
      }
    });
  }

  fetchUnitTypeById(id: number) {
    this.unitTypeService.getUnitTypeById(id).subscribe({
      next: response => {
        Swal.fire({
          title: sm.UNIT_TYPE_DETAIL,
          html: `
        <table class="table table-bordered border-dark">
            <tr>
                <th>ID</th>
                <th>${response.id}</th>
            </tr>
            <tr>
                <th>NOMBRE</th>
                <th>${response.name}</th>
            </tr>
            <tr>
                <th>CREADO</th>
                <th>${response.created_at}</th>
            </tr>
            <tr>
                <th>ACTUALIZADO</th>
                <th>${response.updated_at}</th>
            </tr>
        </table>
          `
        });
        this.searchForm.reset();
      },
      error: error => {
        Swal.fire(em.ERROR_TAG, em.UNIT_TYPE_NOT_FOUND, 'warning');
        this.searchForm.reset();
      }
    });
  }

  fetchUnitTypesByName(name: string) {
    this.unitTypeService.getUnitTypeByName(name).subscribe({
      next: response => {
        this.unitTypes = response;
        this.dataSource = new MatTableDataSource<UnitType>(this.unitTypes);
        this.hidePagination = true;
      },
      error: error => {
        Swal.fire(em.ERROR_TAG, em.UNIT_TYPE_NOT_FOUND, 'warning').then((r) => {
          if (r.isConfirmed || r.isDismissed || r.dismiss) {
            window.location.reload();
          }
        })
      }
    });
  }


  onSubmit() {
    this.submitting = true;
    const unitT = new UnitType(
      0, this.newUnitTypeForm.value.name!!
    );
    this.unitTypeService.createUnitType(unitT).subscribe({
      next: response => {
        Swal.fire(sm.SUCCESS_TAG, sm.UNIT_TYPE_CREATED, 'success').then((r) => {
          if (r.isConfirmed || r.dismiss || r.isDismissed) {
            window.location.reload();
          }
        });
      },
      error: error => {
        console.log(error);
        console.log(this.newUnitTypeForm.value.name!!);
        if (error.errors.name) {
          Swal.fire(em.ERROR_TAG, em.UNIT_TYPE_TAKEN, 'error').then((r) => {
            this.newUnitTypeForm.get('name')!!.setValue('');
          });
        } else {
          Swal.fire(em.ERROR_TAG, em.SERVER_ERROR, 'error').then((r) => {
            if (r.isConfirmed || r.dismiss || r.isDismissed) {
              window.location.reload();
            }
          });
        }
      }
    })
  }

  onEdit() {
    this.submitting = true;
    const unitT = new UnitType(
      this.selectedUnitT, this.editUnitTypeForm.value.name!!
    );
    this.unitTypeService.updateUnitType(unitT, this.selectedUnitT).subscribe({
      next: response => {
        Swal.fire(sm.SUCCESS_TAG, sm.UNIT_TYPE_UPDATED, 'success').then((r) => {
          if (r.isConfirmed || r.dismiss || r.isDismissed) {
            window.location.reload();
          }
        });
      },
      error: error => {
        if (error.errors.name) {
          Swal.fire(em.ERROR_TAG, em.UNIT_TYPE_TAKEN, 'error').then((r) => {
            this.editUnitTypeForm.get('name')!!.setValue(this.selectedUniTName);
          });
        } else {
          Swal.fire(em.ERROR_TAG, em.SERVER_ERROR, 'error').then((r) => {
            if (r.isConfirmed || r.dismiss || r.isDismissed) {
              window.location.reload();
            }
          });
        }
      }
    });
  }

  showEditForm(uT: UnitType) {
    this.editFormHidden = false;
    this.editUnitTypeForm.enable();
    this.newUnitTypeForm.disable();
    this.editUnitTypeForm.patchValue({
      name: uT.name,
    });
    this.selectedUnitT = uT.id!!;
    this.selectedUniTName = uT.name!!;
  }

  hideEditUnitTForm() {
    this.editFormHidden = true;
    this.newUnitTypeForm.enable();
    this.editUnitTypeForm.disable();
    this.selectedUnitT = 0;
    this.selectedUniTName = '';
  }

  handleSearchType(val: number) {
    const keywordControl = this.searchForm.get('keyword');
    switch (val) {
      case 0:
        //By ID
        keywordControl!!.setValidators([Validators.required, Validators.minLength(1)]);
        keywordControl!!.reset();
        break;
      case 1:
        //By name
        keywordControl!!.setValidators([Validators.required, Validators.minLength(3)]);
        keywordControl!!.reset();
        break;
      default:
        break;
    }
    keywordControl?.updateValueAndValidity();
  }

  handleKeywordKeydown(e: KeyboardEvent, searchType: number) {
    if (searchType === 0) {
      // Allow: backspace, delete, tab, escape, enter, and numbers
      if (
        [46, 8, 9, 27, 13].includes(e.keyCode) || // Special keys
        (e.keyCode >= 48 && e.keyCode <= 57) || // Number keys
        (e.keyCode >= 96 && e.keyCode <= 105) // Numpad keys
      ) {
        return; // Allow the input
      }
      e.preventDefault();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.fetchUnitTypes();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchUnitTypes();
    }
  }

  isLastPage() {
    return this.currentPage === this.lastPage;
  }

  isFirstPage() {
    return this.currentPage === 1;
  }

  disableCharacters(e: KeyboardEvent) {
    if (e.key === '"' || e.key === "'") {
      e.preventDefault();
    }
  }

  resetNewUnitTForm() {
    this.newUnitTypeForm.reset();
  }

  resetEditUnitTForm() {
    this.editUnitTypeForm.patchValue({
      name: this.selectedUniTName
    });
    this.editUnitTypeForm.updateValueAndValidity();
  }

  reloadPage() {
    window.location.reload();
  }

  searchUnitT() {
    switch (this.searchForm.value.searchType) {
      case 0:
        this.fetchUnitTypeById(parseInt(this.searchForm.value.keyword!!));
        break;
      case 1:
        this.fetchUnitTypesByName(this.searchForm.value.keyword!!);
        break;
      default:
        break;
    }
  }

}
