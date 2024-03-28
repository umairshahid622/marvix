import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Table } from 'primeng/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterService } from 'primeng/api';

interface UserData {
    status: string;
    user: {
        name: string;
        email: string;
        photo: string;
        role: string;
        created_at: string;
        updated_at: string;
        id: string;
    };
}

interface Contract {
    _id: string;
    score: number;
    item: {
        // ... other fields
        accepted?: boolean;
        cpvCodes: string;
        region: string;
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


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [FilterService]
})
export class DashboardComponent implements OnInit {
    loading = false;
    dataLoading = false;
    userprofile: UserData;
    products: Contract[] = [];
    filteredProducts: Contract[] = [];
    userId: string | null = localStorage.getItem('userId');
    accessToken: string | null = localStorage.getItem('access_token');
    recomendationFilter: string = ''; // New property for filter

    @ViewChild('filter') filter!: Table;

    constructor(private http: HttpClient, private formBuilder: FormBuilder) { }




    ngOnInit(): void {
        // this.searchOptionsForm = this.formBuilder.group({
        //     searchOption: ['']
        // })
        // this.searchOptions = ['Cpv Codes', 'region']
        // Fetch user data
        this.loading = true;
        this.dataLoading = true;

        this.options = [
            { name: 'CPV Code', code: 'NY' },
            { name: 'Region', code: 'RM' }
        ];
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
                    // this.loading = false;
                },
                (error) => {
                    console.error('Error fetching user data:', error);
                    // this.loading = false;
                }
            );

        this.http
            .get<any>('http://45.85.250.231:8000/api/posts/get_data_by_user_id/api_call?skip=0&limit=1000', {
                // withCredentials: true,
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            })
            .subscribe(
                (data) => {
                    console.log("api/posts/get_data_by_user", data);

                    this.products = data.data.map((contract: Contract) => ({
                        ...contract,
                        item: { ...contract.item, accepted: false },
                    }));
                    this.filteredProducts = [...this.products];
                    this.loading = false;
                },
                (error) => {
                    console.error('Error fetching data:', error);
                    this.loading = false;
                }
            );
    }

    // searchOptionsForm: FormGroup = new FormGroup({
    //     searchOption: new FormControl()
    // })
    searchPlaceholder: string | undefined = "";
    options: SelectedOption[] | undefined;
    selectedOption: SelectedOption | undefined;
    // selectedOption: string;
    // searchOptions: string[]
    onSearchOptionChange(event: any) {
        console.log(event);
        this.searchPlaceholder = event.value.name
    }
    acceptContract(contract: Contract): void {
        contract.item.accepted = true;
    }

    rejectContract(contract: Contract): void {
        contract.item.accepted = false;
    }

    inputDirty = false;
    onGlobalFilter(event: Event, searchOption: string) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        console.log(filterValue.length);
        if (filterValue.length === 0 || !searchOption) {
            this.inputDirty = true;
        }
        if (searchOption === "CPV Code") {
            if (filterValue) {
                this.filteredProducts = this.products.filter((contract) =>
                    contract.item.cpvCodes.toLowerCase().includes(filterValue)
                );
            } else {
                this.filteredProducts = [...this.products];
            }
        }

        if (searchOption === "Region") {
            if (filterValue) {
                this.filteredProducts = this.products.filter((contract) =>
                    contract.item.region.toLowerCase().includes(filterValue)
                );
            } else {
                this.filteredProducts = [...this.products];
            }
        }
        // Reset the table paginator to the first page
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
        console.log(this.recomendationFilter);
        const regex = new RegExp(this.recomendationFilter, 'gi');
        return text.replace(regex, match => `<span class="highlight">${match}</span>`);
    }
}
