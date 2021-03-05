export class AboutDTO {
    general: {
        gender: string,
        birthday: string,
        locations: string[],
        about: string,
    };
    work: {
        occupation: string,
        skills: string,
        jobs: string
    };
    contact: {
        address: string;
        tel: string[];
        websites: string[];
        emails: string[];
    };

    constructor ( ) {
        this.general = {
            gender: '',
            birthday: '',
            locations: [],
            about: ''
        };
        this.work = {
            occupation: '',
            skills: '',
            jobs: ''
        };
        this.contact = {
            address: '',
            tel: [],
            websites:[],
            emails:[]
        };

    }
}