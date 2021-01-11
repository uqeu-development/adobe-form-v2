let region = ""; //detect region
let errorMsg = "";
let successMsg = "";
let emailError = "";
let campaign = "";
let source = ""
let unsubFlg = ""
let overwriteRegion = "";
let overwriteCountryCode = "";
let dev = "";
let validForm = false;

function fetchAttributeData(attribute) {
    let att = document.getElementById('uniqlo-form').getAttribute(attribute);
    if (attribute === 'overwrite-region') {
        if (att !== null) {
            if (att !== "") {
                console.warn("You're overwriting the region!")
            }
        }
    }
    if (attribute === 'overwrite-countryCode') {
        if (att !== null) {
            if (att !== "") {
                console.warn("You're overwriting the country code!")
            }
        }
    }
    if (attribute === 'error-msg' || attribute === "success-msg" || attribute === "overwrite-region" || attribute === "overwrite-countryCode" || attribute === "dev") {
        if (att === null || att === "") {
            if (attribute === 'error-msg') {
                return errorMsg;
            } else {
                return successMsg;
            }
        } else {
            return att;
        }
    } else {
        if (att === null || att === "") {
            if (attribute === "unsubscribe-flg") {
                console.warn(attribute, "is empty or not defined! This means the customers won't be subscribed to newsetters.")
            } else {

                console.error(attribute, 'not defined!')
            }
        } else {
            return att;
        }
    }
}

$(document).ready(() => {


    if (window.location.href.includes('uk/en')) {
        region = 'uk/en';
        errorMsg = "Sorry, something went wrong. Try again later."
        successMsg = "Thank you. You'll receive a confirmation email soon."
        emailError = "The Email address doesn't seem to be correct, please check syntax."
    } else if (window.location.href.includes('se/en')) {
        region = 'se/en';
        errorMsg = "Sorry, something went wrong. Try again later."
        successMsg = "Thank you. You'll receive a confirmation email soon."
        emailError = "The Email address doesn't seem to be correct, please check syntax."
    } else if (window.location.href.includes('dk/en')) {
        region = 'dk/en';
        ErrorMsg = "Sorry, something went wrong. Try again later."
        SuccessMsg = "Thank you. You'll receive a confirmation email soon."
        emailError = "The Email address doesn't seem to be correct, please check syntax."
    } else if (window.location.href.includes('eu/en')) {
        region = 'eu/en';
        errorMsg = "Sorry, something went wrong. Try again later."
        successMsg = "Thank you. You'll receive a confirmation email soon."
        emailError = "The Email address doesn't seem to be correct, please check syntax."
    } else if (window.location.href.includes('es/es')) {
        region = 'es/es';
        errorMsg = "Perdón, algo salió mal. Vuelve a intentarlo más tarde"
        successMsg = "Gracias. Pronto recibirá un correo electrónico de confirmación."
        emailError = "La dirección de correo electrónico no parece ser correcta, verifique la sintaxis."
    } else if (window.location.href.includes('fr/fr')) {
        region = 'fr/fr';
        errorMsg = "Désolé, quelque chose s'est mal passé. Réessayez plus tard"
        successMsg = "Je vous remercie. Vous recevrez bientôt un e-mail de confirmation."
        emailError = "L'adresse e-mail ne semble pas correcte, veuillez vérifier la syntaxe."
    } else if (window.location.href.includes('de/de')) {
        region = 'de/de';
        errorMsg = "Entschuldigung, etwas ist schief gelaufen. Versuchen Sie es später noch einmal"
        successMsg = "Vielen Dank. Sie erhalten in Kürze eine Bestätigungs-E-Mail."
        emailError = "Die E-Mail-Adresse scheint nicht korrekt zu sein. Bitte überprüfen Sie die Syntax."
    } else if (window.location.href.includes('it/it')) {
        region = 'it/it';
        errorMsg = "Scusa, qualcosa è andato storto. Riprovare più tardi"
        successMsg = "Grazie. Riceverai presto un'email di conferma."
        emailError = "L'indirizzo e-mail non sembra essere corretto, controlla la sintassi."
    }

    campaign = fetchAttributeData("campaign-name");
    source = fetchAttributeData("source-name")
    successMsg = fetchAttributeData('success-msg');
    errorMsg = fetchAttributeData('error-msg')
    unsubFlg = fetchAttributeData('unsubscribe-flg')
    overwriteCountryCode = fetchAttributeData('overwrite-countryCode');
    overwriteRegion = fetchAttributeData('overwrite-region')
    dev = fetchAttributeData('dev')

})


function isEmail(emailAddress) {
    let emailAddressRegex = /^[^@\s]+@[^\.@\s]+(\.[^@\s^\.]+)+$/;
    if (emailAddress == '' || emailAddress == null) {
        alert(emailError);
        $('#EMAIL_FIELD').focus();

        validForm = false;
    } else if (!emailAddressRegex.test(emailAddress)) {
        alert(emailError);
        $('#EMAIL_FIELD').focus();

        validForm = false;
    } else {
        validForm = true;
    }
}

function getInputs(data) {
    $('#uniqlo-form').find('input:not(:checkbox)').map((index, value) => {
        if (value.name === 'email') {
            isEmail(value.value);
        }

        if (value.value.length != 0) {
            data[value.name] = value.value
        }
    })
    $('#uniqlo-form').find('input[type=checkbox]').map((index, value) => {

        if (value.checked === true) {
            data[value.name] = 'yes';
        } else {
            data[value.name] = 'no';
        }
    })
    $('#uniqlo-form').find('option:selected').map((index, value) => {

        if (value.text.length != 0) {
            data[value.value] = value.text;
        }

    })
}


function onInputChange() {
    let numInputs = $('#uniqlo-form').find('[data-uniqlo-required]').length;
    let currentNumInputs = 0;
    const signupBtn = document.getElementById('signup-btn');
    $('#uniqlo-form').find('[data-uniqlo-required]').map((value, index) => {
        if ($(index)[0].type === 'text') {
            if ($(index)[0].value.length !== 0) {
                currentNumInputs++;
            } else {
                currentNumInputs--;
            }
        }
        if ($(index)[0].tagName === 'SELECT') {
            if ($(index)[0].innerHTML.length !== 0) {

                currentNumInputs++;
            } else {
                currentNumInputs--;
            }
        }
        if ($(index)[0].type === 'checkbox') {

            if ($(index)[0].checked) {

                currentNumInputs++
            } else {
                currentNumInputs--;
            }
        }
    })
    currentNumInputs === numInputs ? signupBtn.disabled = false : signupBtn.disabled = true;
}

function submitData(e) {

    e.preventDefault();

    //check whether the form is in prodtest or not - this is for dev purposes
    let urlPrefix = "https://www.uniqlo.com"
    if (window.location.href.includes('prodtest')) {
        urlPrefix = "https://prodtest.uniqlo.com"
    }

    let url = new URL(`${urlPrefix}/${region}/quicknewslettercampaign?`);
    //used to store all the data inputted in the form 
    let values = [];

    let params = new URLSearchParams(url);
    params.append('dwsrc', 'awscontent') //mandatory 

    // CHANGE VALUES BELOW 
    params.append('source', source);
    params.append('unsubscribe_flg', unsubFlg); // Opt the subscriber in for emails
    params.append('campaign', campaign);
    if (overwriteRegion !== "") {
        params.append('region', overwriteRegion);
    }

    //check for screen size and set medium accordingly
    if (window.innerWidth < 768) {
        params.append('medium', 'Mobile-site');
    } else {
        params.append('medium', 'Desktop-site')
    }
    //fetch the currently location of the visitor
    //countryCode is mandatory in the form so instead of having a field 
    //the function below will detect their location.
    fetch('https://www.cloudflare.com/cdn-cgi/trace').then((response) => {
        response.text().then((countryInfo) => {

            let country = countryInfo.split(/\r?\n/)[8].split('=').pop().toString();
            if (overwriteCountryCode !== "") {
                params.append('countryCode', overwriteCountryCode);
            } else {
                switch (region) {
                    case 'uk/en':
                        params.append('countryCode', 'GB')
                        break;
                    case 'se/en':
                        params.append('countryCode', 'SE')
                        break;
                    case 'dk/en':
                        params.append('countryCode', 'DK');
                        break;
                    case 'es/es':
                        params.append('countryCode', 'ES');
                        break;
                    case 'it/it':
                        params.append('countryCode', 'IT');
                        break;
                    case 'fr/fr':
                        params.append('countryCode', 'FR');
                        break;
                    case 'de/de':
                        params.append('countryCode', 'DE');
                        break;
                    default:
                        params.append('countryCode', country);
                }
            }


        }).then(() => {
            //fetch all the inputs
            const inputs = getInputs(values);
            //construct URL
            for (const attribute in values) {
                params.append(attribute, values[attribute]);
            }
            if (validForm) {
                //submit the url 
                $.ajax({
                    url: url.href.concat(params.toString()),
                    type: 'POST',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "Basic VW5pcWxvOnB3VHNQeXdKRWxVMG1rTjAxUkhE");
                    },
                    success: function (data) {
                        console.log("form submitted")
                        //add hash here to display success message
                        $('.output_msg').html(successMsg)
                        $('.output_msg').removeClass('submit_fail');
                        $('.output_msg').addClass('submit_success')
                        document.getElementById("uniqlo-form").reset();
                        if (dev === 'true') {
                            const output = JSON.parse('{"' + decodeURI(params.toString().replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}')
                            console.log('Your submitted data: ', output)
                        }

                    },
                    error: function (data) {
                        console.log('form not submitted');
                        //add hash here to display error message  
                        $('.output_msg').html(errorMsg);
                        $('.output_msg').removeClass('submit_success');
                        $('.output_msg').addClass('submit_fail')
                        if (dev === 'true') {
                            const output = JSON.parse('{"' + decodeURI(params.toString().replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}')
                            console.log('Your submitted data: ', output)
                        }

                    }
                });
            }
        })
    })

}