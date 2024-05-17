import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Table } from 'primeng/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterService, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

interface UserData {
    status: string;
    user: {
        name: string;
        email: string;
        photo: string;
        role: string;
        created_at: string;
        updated_at: string;
        keywords: string[];
        id: string;
    };
}


interface ApiCallData {
    total_count: number;
    data: []
}
interface SelectedOption {
    name: string;
    code: string;
}

interface TableResponse {
    total_count: number;
    data: [{
        SearchCPVCode: string[];
        createdAt: string;
        item: {
            approachMarketDate: any
            awardedDate: string
            awardedSupplier: string
            awardedToSme: boolean
            awardedToVcse: boolean
            awardedValue: number
            coordinates: string
            cpvCodes: any
            cpvCodesExtended: string
            cpvDescription: string
            cpvDescriptionExpanded: string
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
            valueHigh: number
            valueLow: number
        };
        score: string;
        updatedAt: string;
        user_id: string;
        _id: string;
    }]
}

interface TableData {
    SearchCPVCode: string[];
    createdAt: string;
    item: {
        approachMarketDate: any
        awardedDate: string
        awardedSupplier: string
        awardedToSme: boolean
        awardedToVcse: boolean
        awardedValue: number
        coordinates: string
        cpvCodes: string
        cpvCodesExtended: string
        cpvDescription: string
        cpvDescriptionExpanded: string
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
        valueHigh: number
        valueLow: number
    };
    score: string;
    updatedAt: string;
    user_id: string;
    _id: string;
}


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [FilterService, MessageService]
})
export class DashboardComponent implements OnInit {
    loading = false;
    dataLoading = false;
    userprofile: UserData;
    tableData: TableData[];
    table_data: TableData[];
    userId: string | null = localStorage.getItem('userId');
    accessToken: string | null = localStorage.getItem('access_token');
    recomendationFilter: string = ''; // New property for filter
    isCralwerLoading: boolean = false;

    @ViewChild('filter') filter!: Table;

    constructor(private http: HttpClient, private formBuilder: FormBuilder, private readonly messageService: MessageService) { }




    async ngOnInit() {
        // this.searchOptionsForm = this.formBuilder.group({
        //     searchOption: ['']
        // })
        // this.searchOptions = ['Cpv Codes', 'region']
        // Fetch user data
        this.loading = true;
        this.dataLoading = true;

        this.options = [
            { name: 'CPV Code', code: 'cpvCode' },
            { name: 'Region', code: 'region' },
            { name: 'Awarded Supplier', code: 'awardedSupplier' }
        ];
        await new Promise<void>((resolve, reject) => {
            this.http
                .get<UserData>('http://45.85.250.231:8000/api/users/me', {
                    // withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                    },
                })
                .subscribe(
                    (datauser) => {
                        console.log("Dashboard/api/user/me", datauser);
                        this.userprofile = datauser;
                        this.loading = false;
                        this.http.get('http://45.85.250.231:8000/api/posts/get_contracts_by_keywords', {
                            params: {
                                keywords: this.userprofile.user.keywords,
                                skip: 0,
                                limit: 100
                            },
                            headers: {
                                Authorization: `Bearer ${this.accessToken}`,
                            }
                        }).subscribe(async (res: TableResponse) => {
                            console.log("api/posts/get_contracts_by_keywords", res);
                            await new Promise((resolve, reject) => {
                                this.table_data = res.data;
                                this.tableData = [...this.table_data];
                                resolve;
                            })

                            // this.tableData = res;
                            // this.table_data.data = res.data;
                            // this.tableData.data = [...this.table_data.data];
                            // console.log("table", this.tableData);

                        }, (err) => {
                            console.log(err);

                        }, () => {
                            this.loading = false;
                            console.log("api/posts/get_contracts_by_keywords---Completed");
                        }),
                            resolve();
                    },
                    (error) => {
                        console.error('Error fetching user data:', error);
                        reject
                    }, () => {
                        console.log("User/me -- Completed");

                    }
                );
        })


    }

    // searchOptionsForm: FormGroup = new FormGroup({
    //     searchOption: new FormControl()
    // })
    searchPlaceholder: string | undefined = "";
    searchCode: string | undefined = "";
    options: SelectedOption[] | undefined;
    selectedOption: SelectedOption | undefined;
    // selectedOption: string;
    // searchOptions: string[]
    onSearchOptionChange(event: any) {
        console.log(event);
        this.searchPlaceholder = event.value.name
        this.searchCode = event.value.code;
    }
    // acceptContract(contract: Contract): void {
    //     contract.item.accepted = true;
    // }

    // rejectContract(contract: Contract): void {
    //     contract.item.accepted = false;
    // }

    inputDirty = false;
    onGlobalFilter(event: Event, searchOption: string) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        if (filterValue.length === 0 || !searchOption) {
            this.inputDirty = true;
        }
        if (searchOption === "cpvCode") {
            if (filterValue) {
                console.log(searchOption);
                this.tableData = this.table_data.filter((contract: TableData) =>
                    contract.item.cpvCodes.toLowerCase().includes(filterValue)
                );
            } else {
                this.tableData = [...this.table_data];
            }
        }
        if (searchOption === "region") {
            if (filterValue) {
                this.tableData = this.table_data.filter((contract: TableData) =>
                    contract.item.region.toLowerCase().includes(filterValue)
                );
            } else {
                this.tableData = [...this.table_data];
            }
        }

        if (searchOption === "awardedSupplier") {
            if (filterValue) {
                this.tableData = this.table_data.filter((contract: TableData) =>
                    contract.item.awardedSupplier.toLowerCase().includes(filterValue)
                );
            } else {
                this.tableData = [...this.table_data];
            }
        }

        this.filter.first = 0;
    }



    clear(table: Table) {
        table.clear();
        this.filter.filter('', 'global', 'contains');
    }

    highlightMatches(text: string): string {
        if (!this.recomendationFilter || !text) {
            return text;
        }
        const regex = new RegExp(this.recomendationFilter, 'gi');
        return text.replace(regex, match => `<span class="highlight">${match}</span>`);
    }

    updateCrawler() {
        console.log("Update Crawler");
        this.isCralwerLoading = true;
        this.http
            .post('http://45.85.250.231:8000/api/posts/run_crawler_from_user_data', {}, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            }).subscribe((response) => {
                console.log(response);
                this.isCralwerLoading = false
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: response[0].message });
            }, (err) => {
                console.log(err);
                this.isCralwerLoading = false
                this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: "Couldn't processed data" });
            })
    }
}
