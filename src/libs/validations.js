export default {
    email(str) {
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(str).toLowerCase());
    },



    /*Password Strength*/

    password: {
        Length(str) {
            //must contain at least 8 character length
            var regex = /(?=.{8,})/
            return regex.test(str);
        },
        HasNumericCharacter(str) {
            //must contain at least 1 numeric character
            var regex = /(?=.*[0-9])/
            return regex.test(str);
        },
        HasAlphabeticalCharacter(str){
            //must contain at least 1 alphabetical character
            var regex = /(?=.*[A-z])/
            return regex.test(str);
        },
        HasSpecialCharacter(str){
            //must contain at least 1 special character
            var regex = /(?=.[!@#\$%\^&])/
            return regex.test(str);
        },
        Ready(str) {
            return this.password.Length(str) && this.password.HasNumericCharacter(str) && this.password.HasAlphabeticalCharacter(str) && this.password.HasSpecialCharacter(str)
        }

    }
}