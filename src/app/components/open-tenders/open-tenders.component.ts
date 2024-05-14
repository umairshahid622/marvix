import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';




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
    location:
    {
      additionalProp1: string[],
      additionalProp2: string[],
      additionalProp3: string[]
    }
    name: string
    photo: string
    recommended_tender_minimum_value: number
    role: string
    tender_maximum_value: number
    tender_minimum_value: number
    updated_at: string
  }
}

interface openTenderTable {

  // total_count: number
  // data: {
  SearchCPVCode: number
  approachMarketDate: string
  awardedDate: string
  awardedSupplier: string
  awardedValue: number
  coordinates: string
  cpvCodes: string
  cpvCodesExtended: string
  cpvDescription: string
  cpvDescriptionExpanded: string
  createdAt: string
  deadlineDate: string
  description: string
  end: string
  id: string
  isSubNotice: boolean
  isSuitableForSme: boolean
  isSuitableForVco: boolean
  lastNotifableUpdate: string
  noticeIdentifier: string
  noticeStatus: string
  noticeType: string
  organisationName: string
  parentId: string
  postcode: string
  publishedDate: string
  region: string
  regionText: string
  sector: string
  start: string
  title: string
  updatedAt: string
  user_id: string
  valueHigh: number
  valueLow: number
  _id: string
  // },
}
interface SelectedOption {
  name: string;
  code: string;
}


@Component({
  selector: 'app-open-tenders',
  templateUrl: './open-tenders.component.html',
  styleUrls: ['./open-tenders.component.scss'],
  providers: [MessageService]

})
export class OpenTendersComponent implements OnInit {

  constructor(
    private readonly http: HttpClient,
    private messageService: MessageService,
  ) { }
  @ViewChild('filter') filter!: Table;
  // http://45.85.250.231:8000/api/users/me
  // http://45.85.250.231:9000/api/open/get_contracts_keywords_cpv_open
  accessToken: string;
  userProfile: User;
  loading: boolean = false;
  isCrawlerLoading: boolean = false;
  openTendersData: openTenderTable[];
  open_tender_data: openTenderTable[];
  dataByCpvCode: openTenderTable[];
  options: SelectedOption[];
  searchPlaceholder: string | undefined = "";
  searchCode: string | undefined = "";
  recomendationFilter: string | undefined = "";


  ngOnInit(): void {
    this.loading = true;
    this.options = [
      { name: 'CPV Code', code: 'cpvCode' },
      { name: 'Region', code: 'region' },
      { name: 'Title', code: 'title' }
    ];
    this.accessToken = localStorage.getItem('access_token')
    this.http.get('http://45.85.250.231:8000/api/users/me', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      }
    }).subscribe((res: User) => {
      console.log("Open Tenders", res);
      this.userProfile = res;
      this.http.get('http://45.85.250.231:9000/api/open/get_contracts_by_keywords', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
        params: {
          keyword: res.user.keywords,
          skip: 0,
          limit: 10
        },
      }).subscribe((res: any) => {
        console.log("api/open/get_contracts_by_keywords", res);
        this.open_tender_data = res.data;
        this.openTendersData = [...this.open_tender_data];
        this.loading = false

      }, (err) => {
        console.log("api/open/get_data_by_user_id", err);
        this.loading = false
      }, () => {
        this.loading = false
      })
      // this.http.get('http://45.85.250.231:9000/api/open/get_contracts_by_keywords_and_regions', {
      //   headers: {
      //     'Authorization': `Bearer ${this.accessToken}`,
      //   },
      //   params: {
      //     keyword: res.user.keywords,
      //     region: res.user.location.additionalProp1,
      //     skip: 0,
      //     limit: 10
      //   },
      // }).subscribe((res: any) => {
      //   console.log("api/open/get_contracts_by_keywords_and_regions", res);
      //   this.dataByCpvCode = res.data;

      // }, (err) => {
      //   console.log(err);

      // })
    }, (err) => {
      console.log(err);
      this.loading = false
    }, () => {
      this.loading = false
    })
  }


  onSearchOptionChange(event: any) {
    console.log(event);
    this.searchPlaceholder = event.value.name
    this.searchCode = event.value.code
  }

  dateFormater(dateTime: string) {
    let newDate: string[] = dateTime.split('T');
    return newDate[0]
  }

  // delay = async (index: number) => {
  //   return new Promise<void>(resolve => {
  //     setTimeout(() => {
  //       console.log("Waiting...", index);
  //       resolve();
  //     }, 3000);
  //   });
  // }

  updateCrawler() {
    this.isCrawlerLoading = true;
    // setTimeout(() => {
    //   this.isCrawlerLoading = false;
    //   this.messageService.add({ key: 'tc', severity: 'success', summary: 'success', detail: 'Crawler Updated Succesffuly' });
    // }, 2500);
    this.http.post('http://45.85.250.231:9000/api/open/run_crawler_from_db_open', {}, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    }).subscribe((res) => {
      console.log("api/open/run_crawler_from_db_open", res);
      this.isCrawlerLoading = false;
    }, (err) => {
      console.log("api/open/run_crawler_from_db_open", err);
      this.isCrawlerLoading = false;
    })
  }
  inputDirty = false;
  onGlobalFilter(event: Event, searchOption: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (filterValue.length === 0 || !searchOption) {
      this.inputDirty = true;
    }
    if (searchOption === "cpvCode") {
      if (filterValue) {
        this.openTendersData = this.open_tender_data.filter((contract: openTenderTable) =>
          contract.cpvCodes.toLowerCase().includes(filterValue)
        );
      } else {
        this.openTendersData = [...this.open_tender_data];
      }
    }

    if (searchOption === "region") {
      if (filterValue) {
        this.openTendersData = this.open_tender_data.filter((contract: openTenderTable) =>
          contract.region.toLowerCase().includes(filterValue)
        );
      } else {
        this.openTendersData = [...this.open_tender_data];
      }
    }

    if (searchOption === "title") {
      if (filterValue) {
        this.openTendersData = this.open_tender_data.filter((contract: openTenderTable) =>
          contract.title.toLowerCase().includes(filterValue)
        );
      } else {
        this.openTendersData = [...this.open_tender_data];
      }
    }
    // Reset the table paginator to the first page
    this.filter.first = 0;
  }

  highlightMatches(text: string): string {
    if (!this.recomendationFilter || !text) {
      return text;
    }
    console.log(this.recomendationFilter);
    const regex = new RegExp(this.recomendationFilter, 'gi');
    return text.replace(regex, match => `<span class="highlight">${match}</span>`);
  }
}
