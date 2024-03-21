// recomendations.component.ts

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';


interface ApiCall {
    total_count: number;
    data: [];
}

interface DataByCompetitorName {
    total_count: number,
    data: [
        {
            _id: string
            score: number,
            id: string
            item: {
                parentId: string
                noticeIdentifier: string
                title: string
                description: string
                cpvDescription: string
                cpvDescriptionExpanded: string
                publishedDate: string
                deadlineDate: string
                awardedDate: string
                awardedValue: number,
                awardedSupplier: string
                approachMarketDate: null,
                valueLow: number
                valueHigh: number
                postcode: string,
                coordinates: string
                isSubNotice: true,
                noticeType: string
                noticeStatus: string
                isSuitableForSme: boolean,
                isSuitableForVco: boolean,
                awardedToSme: boolean,
                awardedToVcse: boolean,
                lastNotifableUpdate: string
                organisationName: string
                sector: string
                cpvCodes: string
                cpvCodesExtended: string
                region: string
                regionText: string
                start: string
                end: string
            },
            user_id: string
            SearchCPVCode: string
            createdAt: string
            updatedAt: string
        }
    ]
}


@Component({
    selector: 'app-recomendations',
    templateUrl: './recomendations.component.html',
    styleUrls: ['./recomendations.component.scss'],
})
export class RecomendationsComponent implements OnInit {
    // customers1: any;
    loading = true;
    user: any[];
    competitorNames: any[]
    selectedCompetitorNames: any[]
    userId: string | null = localStorage.getItem('userId');
    accessToken: string | null = localStorage.getItem('access_token');
    @ViewChild('filter') filter!: ElementRef;
    formBuilder: any;
    dataByCompetitorName: DataByCompetitorName[] = []

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.loading = true;
        this.fetchRecommendations();
        this.competitorForm = this.formBuilder.group({
            competitor: [null, Validators.required]
        })
    }
    competitorForm: FormGroup = new FormGroup({
        competitor: new FormControl()
    })


    fetchRecommendations(): void {
        this.http
            .get<any>('http://45.85.250.231:8000/api/users/me', {
                // withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                },
            })
            .subscribe(
                (datauser) => {
                    // console.log("User", datauser);
                    this.user = datauser
                    this.competitorNames = datauser?.user?.competitors
                    console.log("competitors", this.competitorNames);
                    // this.http
                    //     .get<any[]>("http://45.85.250.231:8000/api/posts/get_data_by_user_id/api_call?skip=0&limit=10", {
                    //         headers: {
                    //             'Authorization': `Bearer ${this.accessToken}`,
                    //         },
                    //     })
                    //     .subscribe(
                    //         (data) => {
                    //             // this.customers1 = data;
                    //             // console.log('Data from API:', this.customers1.data);
                    //             this.loading = false;
                    //         },
                    //         (error) => {
                    //             console.error('Error fetching recommendations:', error);
                    //             this.loading = false;
                    //         }
                    //     );

                    // const userEmail = datauser.user.email;
                    // const apiUrl = this.getApiUrlBasedOnEmail(userEmail);

                    // if (apiUrl) {
                    //     this.http
                    //         .get<any[]>(apiUrl, {
                    //             // withCredentials: true,
                    //             headers: {
                    //                 'Authorization': `Bearer ${this.accessToken}`,
                    //             },
                    //         })
                    //         .subscribe(
                    //             (data) => {
                    //                 this.customers1 = data;
                    //                 console.log('Data from API:', this.customers1);
                    //                 this.loading = false;
                    //             },
                    //             (error) => {
                    //                 console.error('Error fetching recommendations:', error);
                    //                 this.loading = false;
                    //             }
                    //         );
                    // } else {
                    //     this.loading = false;
                    // }
                },
                (error) => {
                    console.error('Error fetching user data:', error);
                    this.loading = false;
                }
            );
    }

    cpvSubmit() {
        console.log(this.competitorForm.value.competitor);
        this.dataByCompetitorName = []
        // let dummyCode = "Greenfisher Contracting Ltd";
        // this.http.get(`http://45.85.250.231:8000/api/posts/get_data_by_competitor_name?Competitor%20Name=${dummyCode}`, {
        //     headers: {
        //         'Authorization': `Bearer ${this.accessToken}`,
        //     }
        // }).subscribe((dataByCompetitorName: DataByCompetitorName) => {
        //     // console.log(`subscribe`, dataByCompetitorName.data);
        //     dataByCompetitorName.data.forEach((competitor) => {
        //         console.log(competitor);
        //     })
        //     this.dataByCompetitorName.push(dataByCompetitorName)
        // }, (errr) => { }, () => {
        //     console.log("DataByCompetitorName", this.dataByCompetitorName);
        // },
        // )
        var data_by_competitor_name: number = 0;
        this.competitorForm.value.competitor.forEach((code: string) => {
            // let dummyCode = "Greenfisher Contracting Ltd";
            data_by_competitor_name++;
            this.http.get(`http://45.85.250.231:8000/api/posts/get_data_by_competitor_name?Competitor%20Name=${code}`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                }
            }).subscribe((dataByCompetitorName: DataByCompetitorName) => {
                data_by_competitor_name += 1;
                this.dataByCompetitorName.push(dataByCompetitorName)

            }, (errr) => { }, () => {
            },
            )

        })
        console.log("For Each Completed", this.dataByCompetitorName);

    }


    getApiUrlBasedOnEmail(userEmail: string): string | null {
        switch (userEmail) {
            case 'stem@gmail.com':
                return 'http://127.0.0.1:8000/get_STEMtender_data';
            case 'griff@gmail.com':
                return 'http://127.0.0.1:4000/get_GRIFFtender_data';
            case 'spl@gmail.com':
                return 'http://127.0.0.1:2000/get_SPLtender_data';
            default:
                console.error('Unknown user email:', userEmail);
                return null;
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        table.filterGlobal(filterValue, 'contains');

        // Additionally, filter the 'awardedSupplier' column
        if (filterValue) {
            table.filter(filterValue, 'awardedSupplier', 'contains');
        }
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    acceptRecommendation(customer: any): void {
        // Implement your logic for accepting the recommendation here
        customer.accepted = true;
    }

    rejectRecommendation(customer: any): void {
        // Implement your logic for rejecting the recommendation here
        customer.accepted = false;
    }
}
