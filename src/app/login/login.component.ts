import {Component, OnInit} from '@angular/core';
import {ApiService} from '../Services/api.service';
import {Router, ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';
import { RepositoryContainer } from '../model/RepositoryContainer';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    repositories: RepositoryContainer[];
    jirakeys: string[];
    error: string;
    private testJiraHost = '';
    repositoriesLoading: boolean;

    constructor(public apiService: ApiService, public router: Router, private route: ActivatedRoute) {
        this.error = undefined;
        this.route.queryParams.subscribe((params) => {
            if (params.github == 'success' && this.apiService.isLoggedIn()) {
                this.getRepositories()
            }else if(params.github == 'error'){
                this.error = 'A Login error occured. Please try it again';
            }
        })
    }

    ngOnInit() {
    }

    async login(form: NgForm) {
        this.repositoriesLoading = true;
        this.error = undefined;
        let response = await this.apiService.loginUser(form.value.email, form.value.password, form.value.stayLoggedIn).toPromise()
        if (response.status === 'error') {
            this.repositoriesLoading = false;
            this.error = response.message;
        } else {
            this.getRepositories()
        }
    }

    async loginTestAccount() {
        this.router.navigate(['/testaccount']);
    }

    getRepositories() {
        let value = localStorage.getItem('repository')
        let source = localStorage.getItem('source')
        let repository: RepositoryContainer = {value, source}
        this.repositoriesLoading = true;
        this.apiService.getRepositories().subscribe((resp: RepositoryContainer[]) => {
            console.log(resp)
            if(resp.length <= 0){
                console.log('repositories empty')
                this.router.navigate(['/accountManagment'])
            }
            resp.forEach((elem) => {
                if(elem.value == repository.value && elem.source == repository.source){
                    this.router.navigate(['']);
                }
            })
            this.repositories = resp;
            this.repositoriesLoading = false;
        }, (err) => {
            this.error = err.error;
            this.repositoriesLoading = false;
        });
    }

    filterProjects(resp) {
        try{
            let projectNames = [];
            let projectKeys = [];
            JSON.parse(resp)['projects'].forEach(entry => {
                projectNames = projectNames.concat(`jira/${entry['name']}`);
                projectKeys = projectKeys.concat(`${entry['key']}`);
            });
            this.jirakeys = projectKeys;
            console.log(this.jirakeys);
            return projectNames;
        }catch(error) {
            return []
        }
    }

    selectRepository(userRepository: RepositoryContainer) {
        const ref: HTMLLinkElement = document.getElementById('githubHref') as HTMLLinkElement;
        ref.href = 'https://github.com/' + userRepository.value;
        localStorage.setItem('repository', userRepository.value)
        localStorage.setItem('source', userRepository.source)
        this.router.navigate(['']);
    }

    navToRegistration() {
    this.router.navigate(['/register']);
  }

    githubLogin(){
        this.error = undefined;
        this.repositoriesLoading = true;
        this.apiService.githubLogin()
      }
}
