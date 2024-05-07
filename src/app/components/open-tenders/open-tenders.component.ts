import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';




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
  // http://45.85.250.231:8000/api/users/me
  // http://45.85.250.231:9000/api/open/get_contracts_keywords_cpv_open
  accessToken: string;
  userProfile: User;
  loading: boolean = false;
  isCrawlerLoading: boolean = false;
  openTendersData: openTenderTable[];
  ngOnInit(): void {
    this.accessToken = localStorage.getItem('access_token')
    this.http.get('http://45.85.250.231:8000/api/users/me', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      }
    }).subscribe(async (res: User) => {
      console.log("Open Tenders", res);
      this.userProfile = res;
      // for (let index = 0; index < 5; index++) {
      //   await new Promise<void>(resolve => {
      //     setTimeout(() => {
      //       console.log("Waiting...", index);
      //       resolve();
      //     }, 30000);
      //   });
      // }
      this.http.get('http://45.85.250.231:9000/api/open/get_data_by_user_id', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
        params: {
          skip: 0,
          limit: 10
        },
      }).subscribe(async (res) => {
        console.log("api/open/get_data_by_user_id", res[0]);
        this.openTendersData = res[0].data

      }, (err) => {
        console.log("api/open/get_data_by_user_id", err);

      })


      // for (let index = 0; index < res.user.location.additionalProp1.length; index++) {
      //   await new Promise<void>((resolve, reject) => {
      //     this.http.get('http://45.85.250.231:9000/api/open/get_contracts_keywords_cpv_open', {
      //       params: {
      //         region: res.user.location.additionalProp1[index].toString(),
      //         keyword: null,
      //         skip: 0,
      //         limit: 10
      //       },
      //       headers: {
      //         'Authorization': `Bearer ${this.accessToken}`,
      //       }
      //     }).subscribe((res) => {
      //       console.log(res);
      //       resolve();

      //     }, (err) => {
      //       console.log(err);
      //       reject()
      //     })
      //   })
      // }
    }, (err) => {
      console.log(err);
    })
  }


  dateFormater(dateTime: string) {
    let newDate: string[] = dateTime.split('T');
    console.log(newDate);
    return newDate[0]
  }

  delay = async (index: number) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        console.log("Waiting...", index);
        resolve();
      }, 3000);
    });
  }

  updateCrawler() {
    this.isCrawlerLoading = true;
    setTimeout(() => {
      this.isCrawlerLoading = false;
      this.messageService.add({ key: 'tc', severity: 'success', summary: 'success', detail: 'Crawler Updated Succesffuly' });
    }, 2500);
    // this.http.post('http://45.85.250.231:9000/api/open/run_crawler_from_db_open', {}, {
    //   headers: {
    //     'Authorization': `Bearer ${this.accessToken}`,
    //   },
    // }).subscribe((res) => {
    //   console.log("api/open/run_crawler_from_db_open", res);
    //   this.isCrawlerLoading = false;
    // }, (err) => {
    //   console.log("api/open/run_crawler_from_db_open", err);
    //   this.isCrawlerLoading = false;
    // })
  }
}
