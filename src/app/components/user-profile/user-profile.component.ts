import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Chips } from 'primeng/chips';





interface User {
  status: string
  user: {
    company_id: string
    company_name: string
    competitors: string[]
    cpv_codes: number[]
    created_at: string
    email: string
    id: string
    keywords: string[]
    location: string[]
    name: string
    photo: string
    recommended_tender_minimum_value: number
    role: string
    tender_maximum_value: number
    tender_minimum_value: number
    updated_at: string
  }
}



@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [MessageService]
})

export class UserProfileComponent implements OnInit, AfterViewInit {

  constructor(
    private readonly http: HttpClient,
    private readonly formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

  accessToken: string;
  userResponse: User;
  loading: boolean = false;
  valueLoading: boolean = false;

  @ViewChild('chips', { static: true }) chips: Chips;
  ngAfterViewInit(): void {
    (this.chips.inputViewChild.nativeElement as HTMLInputElement).type = 'number'
  }

  ngOnInit(): void {
    this.loading = true
    this.accessToken = localStorage.getItem('access_token')
    console.log("access_token:", this.accessToken);
    this.http.get('http://45.85.250.231:8000/api/users/me', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    }).subscribe((resposne) => {
      this.userResponse = resposne as User
      console.log("User", this.userResponse);
      this.loading = false
    }, (err) => {
      console.log(err);
    })





    this.tenderMinValueForm = this.formBuilder.group({
      tenderMinValue: [null, Validators.required]
    })
    this.tenderMaxValueForm = this.formBuilder.group({
      tenderMaxValue: [null, Validators.required]
    })

    this.updateCpvCodesForm = this.formBuilder.group({
      updatedCpvCodes: [[], Validators.required]
    })
    this.deleteCpvCodesForm = this.formBuilder.group({
      deletedCpvCodes: [[], Validators.required]
    })

    this.updateLocationsForm = this.formBuilder.group({
      updatedLocations: [[], Validators.required]
    })
    this.updateLocationsForm = this.formBuilder.group({
      deletedLocations: [[], Validators.required]
    })

    this.updateKeywordsForm = this.formBuilder.group({
      updatedKeywords: [[], Validators.required]
    })
    this.deleteKeywordsForm = this.formBuilder.group({
      deletedKeywords: [[], Validators.required]
    })


    this.updateCompetitorsForm = this.formBuilder.group({
      updatedCompetitors: [[], Validators.required]
    })
    this.deleteCompetitorsForm = this.formBuilder.group({
      deletedCompetitors: [[], Validators.required]
    })

  }


  // data: any = {
  //   companyId: "af7c1fe6-d669-414e-b066-e9733f0de7a8",
  //   companyName: "Test Company pvt",
  //   email: "testmail@gmail.com",
  //   name: "testn name",
  //   tenderMinValue: 5,
  //   tenderMaxValue: 200,
  //   cpvCodes: ["10000", "20000", "30000", "40000", "50000"],
  //   keywords: ["keyword-1", "keyword-2", "keyword-3"],
  //   locations: ["location-1", "location-2", "location-3"],
  //   competitors: ["competitor-1", "competitor-2", "competitor-3"]
  // }


  tender_min_value_update_visible: boolean = false;
  tender_min_value_delete_visible: boolean = false;

  tender_max_value_update_visible: boolean = false;
  tender_max_value_delete_visible: boolean = false;

  cpv_codes_update_visible: boolean = false;
  cpv_codes_delete_visible: boolean = false;

  keywords_update_visible: boolean = false;
  keywords_delete_visible: boolean = false;

  competitors_update_visible: boolean = false;
  competitors_delete_visible: boolean = false;

  locations_update_visible: boolean = false;
  locations_delete_visible: boolean = false;


  showTenderMinValueUpdateDialog() {
    this.tender_min_value_update_visible = true;
  }
  showTenderMinValueDeleteDialog() {
    this.tender_min_value_delete_visible = true;
  }

  showTenderMaxValueUpdateDialog() {
    this.tender_max_value_update_visible = true;
  }
  showTenderMaxValueDeleteDialog() {
    this.tender_max_value_delete_visible = true;
  }

  showCpvCodeUpdateDialog() {
    this.cpv_codes_update_visible = true;
  }
  showCpvCodeDeleteDialog() {
    this.cpv_codes_delete_visible = true;
  }

  showCompetitorsUpdateDialog() {
    this.competitors_update_visible = true;
  }
  showCompetitorsDeleteDialog() {
    this.competitors_delete_visible = true;
  }

  showLocationsUpdateDialog() {
    this.locations_update_visible = true;
  }
  showLocationsDeleteDialog() {
    this.locations_delete_visible = true;
  }

  showKeywordsUpdateDialog() {
    this.keywords_update_visible = true;
  }
  showKeywordsDeleteDialog() {
    this.keywords_delete_visible = true;
  }

  // ======================== Forms ========================


  tenderMinValueForm: FormGroup = new FormGroup({
    tenderMinValue: new FormControl()
  })
  tenderMaxValueForm: FormGroup = new FormGroup({
    tenderMaxValue: new FormControl()
  })

  updateCpvCodesForm: FormGroup = new FormGroup({
    updatedCpvCodes: new FormControl()
  })
  deleteCpvCodesForm: FormGroup = new FormGroup({
    deletedCpvCodes: new FormControl()
  })

  updateLocationsForm: FormGroup = new FormGroup({
    updatedLocations: new FormControl()
  })
  deleteLocationsForm: FormGroup = new FormGroup({
    deletedLocations: new FormControl()
  })

  updateKeywordsForm: FormGroup = new FormGroup({
    updatedKeywords: new FormControl()
  })
  deleteKeywordsForm: FormGroup = new FormGroup({
    deletedKeywords: new FormControl()
  })

  updateCompetitorsForm: FormGroup = new FormGroup({
    updatedCompetitors: new FormControl()
  })
  deleteCompetitorsForm: FormGroup = new FormGroup({
    deletedCompetitors: new FormControl()
  })


  onTenderMinValueUpdateSubmit() {
    if (this.tenderMinValueForm.invalid) {
      return;
    }
    this.valueLoading = true;
    let tenderMinValue: number = this.tenderMinValueForm.value.tenderMinValue
    console.log("Tender Min Value", tenderMinValue);
    this.http.put('http://45.85.250.231:8000/api/users/update_user_tender_minimum_value', {}, {
      params: { tender_minimum_value: tenderMinValue },
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    }).subscribe((data) => {
      console.log("Response", data);
      this.messageService.add({ key: 'tc', severity: "success", summary: "success", detail: "Tender Min Value Updated " });
      window.location.reload()
    }, (err) => {
      console.log("Error", err);
      this.valueLoading = false;
    }, () => {
    })

  }

  onDeleteTenderMinValue() {
    this.valueLoading = true;
    this.http.delete('http://45.85.250.231:8000/api/users/delete_tender_minimum_value', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      }
    }).subscribe((data) => {
      console.log("Response", data);
      this.messageService.add({ key: 'tc', severity: "success", summary: "success", detail: "Tender Min Value Deleted " });
      window.location.reload()
    }, (err) => {
      console.log("Error", err);
      this.valueLoading = false;
    }, () => {
    })
  }


  tenderMaxValueValidator() {

  }

  onTenderMaxValueUpdateSubmit() {
    if (this.tenderMaxValueForm.invalid) {
      return;
    }
    this.valueLoading = true;
    let tenderMaxValue: number = this.tenderMaxValueForm.value.tenderMaxValue
    console.log("Tender Max Value", tenderMaxValue);
    if (tenderMaxValue <= this.userResponse.user.tender_minimum_value) {
      return
    }
    this.http.put('http://45.85.250.231:8000/api/users/update_user_tender_maximum_value', {}, {
      params: {
        tender_maximum_value: tenderMaxValue
      },
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },

    }).subscribe((data) => {
      console.log("Response", data);
      this.messageService.add({ key: 'tc', severity: "success", summary: "success", detail: "Tender Max Value Updated " });
      window.location.reload()
    }, (err) => {
      console.log("Error", err);
      this.valueLoading = false;
    }, () => {
    }
    )

  }

  onDeleteTenderMaxValue() {
    this.valueLoading = true;
    this.http.delete('http://45.85.250.231:8000/api/users/delete_tender_maximum_value', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      }
    }).subscribe((data) => {
      console.log("Response", data);
      this.messageService.add({ key: 'tc', severity: "success", summary: "success", detail: "Tender Max Value Deleted " });
      window.location.reload()
    }, (err) => {
      console.log("Error", err);
      this.valueLoading = false;
    }, () => {
    })
  }


  onUpdateCpvCodesSubmit() {
    if (this.updateCpvCodesForm.invalid) {
      return;
    }
    this.valueLoading = true;
    let updatedCpvCodes: string[] = this.updateCpvCodesForm.value.updatedCpvCodes
    console.log("CPV Codes", updatedCpvCodes);
    this.http.put('http://45.85.250.231:8000/api/users/update_user_cpv_codes',
      updatedCpvCodes, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      }
    }).subscribe(
      (res) => {
        console.log("Response", res);
        this.messageService.add({ key: 'tc', severity: "success", summary: "success", detail: "CpvCode Added " });
        window.location.reload()
      }, (err) => {
        console.log("Error", err);
        this.valueLoading = false;
      },
      () => {
      }
    )
  }
  onDeleteCpvCodesSubmit() {
    if (this.deleteCpvCodesForm.invalid) {
      return;
    }
    this.valueLoading = true;
    let deletedCpvCode: string = this.deleteCpvCodesForm.value.deletedCpvCodes
    console.log("Deleted CPV Code", deletedCpvCode);
    this.http.delete('http://45.85.250.231:8000/api/users/delete_cpv_code', {
      params: {
        cpv_code: deletedCpvCode
      },
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      }
    }).subscribe((res) => {
      console.log(res);
      this.messageService.add({ key: 'tc', severity: "success", summary: "success", detail: "CpvCode Deleted " });
      window.location.reload()
    }, (err) => {
      console.log(err);
      this.valueLoading = false;
    }, () => {
    })

  }

  // onUpdateLocationsSubmit() {
  //   let updatedLocations: string[] = this.updateLocationsForm.value.updatedLocations
  //   console.log("Locations", updatedLocations);

  // }
  // onDeleteLocationsSubmit() {
  //   let deletedLocations: string[] = this.deleteLocationsForm.value.deletedLocations
  //   console.log("Deleted Locations", deletedLocations);
  // }

  onUpdateKeywordsSubmit() {
    if (this.updateKeywordsForm.invalid) {
      return
    }
    this.valueLoading = true;
    let updatedKeywords: string[] = this.updateKeywordsForm.value.updatedKeywords
    console.log("keywords", updatedKeywords);
    this.http.put('http://45.85.250.231:8000/api/users/update_user_keywords',
      updatedKeywords,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      }).subscribe(
        (res) => {
          console.log("Response", res);
          this.messageService.add({ key: 'tc', severity: "success", summary: "success", detail: "Keyword Added " });
          window.location.reload()
        }, (err) => {
          console.log("Error", err);
          this.valueLoading = false;
        },
        () => {
        }
      )
  }
  onDeleteKeywordsSubmit() {
    if (this.deleteKeywordsForm.invalid) {
      return;
    }
    this.valueLoading = true;
    let deletedKeyword: string = this.deleteKeywordsForm.value.deletedKeywords;
    console.log("Deleted keywords", deletedKeyword);
    this.http.delete('http://45.85.250.231:8000/api/users/delete_keywords', {
      params: {
        keywords: deletedKeyword
      },
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      }
    }).subscribe((res) => {
      console.log(res);
      this.messageService.add({ key: 'tc', severity: "success", summary: "success", detail: "Keyword Deleted" });
      window.location.reload()
    }, (err) => {
      console.log(err);
      this.valueLoading = false;
    }, () => {
    }
    )
  }

  onUpdateCompetitorsSubmit() {
    if (this.updateCompetitorsForm.invalid) {
      return;
    }
    this.valueLoading = true;
    let updatedCompetitors: string[] = this.updateCompetitorsForm.value.updatedCompetitors
    console.log("Competitors", updatedCompetitors);
    this.http.put('http://45.85.250.231:8000/api/users/update_user_competitor_names',
      updatedCompetitors, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      }
    }).subscribe(
      (res) => {
        console.log("Response", res);
        this.messageService.add({ key: 'tc', severity: "success", summary: "success", detail: "Competitors Added" });
        window.location.reload()
      }, (err) => {
        console.log("Error", err);
        this.valueLoading = false;
      },
      () => {
      }
    )
  }
  onDeleteCompetitorsSubmit() {
    if (this.deleteCompetitorsForm.invalid) {
      console.log("Invalid On Del Comp");
      return;
    }
    this.valueLoading = true;
    let deletedCompetitor: string = this.deleteCompetitorsForm.value.deletedCompetitors;
    console.log("Deleted Competitors", deletedCompetitor);
    this.http.delete('http://45.85.250.231:8000/api/users/delete_competitor_name',
      {
        params: {
          competitor_name: deletedCompetitor
        },
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      }).subscribe(
        (res) => {
          console.log("onDeleteCompetitorsSubmitResponse", res);
          this.messageService.add({ key: 'tc', severity: "success", summary: "success", detail: "Competitor Deleted" });
          window.location.reload()
        }, (err) => {
          console.log("onDeleteCompetitorsSubmitError", err);
          this.valueLoading = false;
        }, () => {
        }
      )
  }

}
