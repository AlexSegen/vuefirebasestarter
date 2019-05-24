class Profile {
    constructor(displayName, photoURL, gender, dob, website, company ) {
        this.displayName = displayName || '',
        this.photoURL = photoURL || ''
        this.gender = gender || "",
        this.dob = dob || ""
        this.website = website || ""
        this.company = company || ""
    }
}

export {
    Profile
}