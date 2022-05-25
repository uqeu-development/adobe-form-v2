

var region = 'uk/en'
let errorMsg;
let successMsg;
let emailError;
let countryCode = "GB";
let validForm = false;
let DOBValid = "";
let adobeMessages = [];
let formReset = 'true';

if (window.location.href.includes('uk/en')) {
    region = 'uk/en';
    countryCode = "GB";
    errorMsg = "Sorry, something went wrong. Try again later."
    successMsg = "Thank you. You'll receive a confirmation email soon."
    emailError = "The Email address doesn't seem to be correct, please check syntax."
} else if (window.location.href.includes('se/en')) {
    region = 'se/en';
    countryCode = "SE";
    errorMsg = "Sorry, something went wrong. Try again later."
    successMsg = "Thank you. You'll receive a confirmation email soon."
    emailError = "The Email address doesn't seem to be correct, please check syntax."
} else if (window.location.href.includes('dk/en')) {
    region = 'dk/en';
    countryCode = "DK";
    errorMsg = "Sorry, something went wrong. Try again later."
    successMsg = "Thank you. You'll receive a confirmation email soon."
    emailError = "The Email address doesn't seem to be correct, please check syntax."
} else if (window.location.href.includes('eu/en')) {
    region = 'eu/en';
    errorMsg = "Sorry, something went wrong. Try again later."
    successMsg = "Thank you. You'll receive a confirmation email soon."
    emailError = "The Email address doesn't seem to be correct, please check syntax."
} else if (window.location.href.includes('es/es')) {
    region = 'es/es';
    countryCode = "ES";
    errorMsg = "Perdón, algo salió mal. Vuelve a intentarlo más tarde"
    successMsg = "Gracias. Pronto recibirá un correo electrónico de confirmación."
    emailError = "La dirección de correo electrónico no parece ser correcta, verifique la sintaxis."
} else if (window.location.href.includes('fr/fr')) {
    region = 'fr/fr';
    countryCode = "FR";
    errorMsg = "Désolé, quelque chose s'est mal passé. Réessayez plus tard"
    successMsg = "Je vous remercie. Vous recevrez bientôt un e-mail de confirmation."
    emailError = "L'adresse e-mail ne semble pas correcte, veuillez vérifier la syntaxe."
} else if (window.location.href.includes('de/de')) {
    region = 'de/de';
    countryCode = "DE";
    errorMsg = "Entschuldigung, etwas ist schief gelaufen. Versuchen Sie es später noch einmal"
    successMsg = "Vielen Dank. Sie erhalten in Kürze eine Bestätigungs-E-Mail."
    emailError = "Die E-Mail-Adresse scheint nicht korrekt zu sein. Bitte überprüfen Sie die Syntax."
} else if (window.location.href.includes('it/it')) {
    region = 'it/it';
    countryCode = "IT";
    errorMsg = "Scusa, qualcosa è andato storto. Riprovare più tardi"
    successMsg = "Grazie. Riceverai presto un'email di conferma."
    emailError = "L'indirizzo e-mail non sembra essere corretto, controlla la sintassi."
}


const submitData = e => {
    e.preventDefault();

    const formId = e.currentTarget?.dataset?.form || console.error('form missing')
    const source = document.getElementById(formId)?.dataset?.sourceName || console.error('source missing')
    const unsubFlg = document.getElementById(formId)?.dataset?.unsubscribeFlg || "";
    const overwriteRegion = document.getElementById(formId)?.dataset?.overwriteRegion || "";
    const campaign = document.getElementById(formId)?.dataset?.campaignName;
    const dev = document.getElementById(formId)?.dataset?.dev;



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
    if (unsubFlg !== undefined) {
        params.append('unsubscribe_flg', unsubFlg); // Opt the subscriber in for emails
    }
    params.append('campaign', campaign);
    if (overwriteRegion !== "" && overwriteRegion !== undefined) {
        params.append('region', overwriteRegion);
    }

    //check for screen size and set medium accordingly
    if (window.innerWidth < 768) {
        params.append('medium', 'Mobile-site');
    } else {
        params.append('medium', 'Desktop-site')
    }


    if (countryCode === "") {
        (async () => {
            const cc = await fetchCountry();
            let country = cc.split(/\r?\n/)[8].split('=').pop().toString();
            params.append('countryCode', country)
        })();
    } else {
        params.append('countryCode', countryCode)
    }

    const inputs = getInputs(values, formId);
    console.log(values)

    //construct URL
    for (const attribute in values) {
        params.append(attribute, values[attribute]);
    }

    if (adobeMessages.length !== 0) {
        if (typeof onAdobeMessages === 'function') {
            onAdobeMessages(adobeMessages);
        }
        adobeMessages = [];
    }

    if (validForm) {
        $.ajax({
            url: url.href.concat(params.toString()),
            type: 'POST',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic VW5pcWxvOnB3VHNQeXdKRWxVMG1rTjAxUkhE");
            },
            success: function (data) {
                console.log("form submitted")
                //add hash here to display success message
                $('.output_msg').html(successMsg);
                $('.output_msg').removeClass('submit_fail');
                $('.output_msg').addClass('submit_success')

                if (formReset === 'true') {
                    document.getElementById(formId).reset();
                }
                if (dev === 'true') {
                    const output = JSON.parse('{"' + decodeURI(params.toString().replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}')
                    console.log('Your submitted data: ', output)
                }
                if (typeof onAdobeSuccess === 'function') {
                    onAdobeSuccess(successMsg);
                }
                adobeMessages = [];


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
                if (typeof onAdobeFail === 'function') {
                    onAdobeFail(errorMsg);
                }
                adobeMessages = [];
            }
        });

    }
}

const fetchCountry = async () => {
    const f = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
    const countryCode = await f.text();

    return countryCode
}

function getInputs(data, formId) {
    document.getElementById(formId).querySelectorAll('input:not([type="checkbox"])').forEach((value) => {
        if (value.name != 'DOB') {
            if (value.name === 'email') {
                isEmail(value.value);
            }
            if (value.value.length != 0) {
                if (value.name !== 'birthDate') {
                    data[value.name] = value.value
                }
            }
        }
    })
    document.getElementById(formId).querySelectorAll('input[type=checkbox]').forEach((value) => {
        if (value.checked === true) {
            const checkedValue = value.dataset.uniqloChecked;
            if (checkedValue === undefined) return
            data[value.name] = checkedValue;
        } else {
            const checkedValue = value.dataset.uniqloUnchecked;
            if (checkedValue === undefined) return
            data[value.name] = checkedValue;
        }
    })
    document.getElementById(formId).querySelectorAll('input[type=radio]').forEach((value) => {
        if (value.checked === true) {
            const checkedValue = value.dataset.uniqloChecked;
            if (checkedValue === undefined) return
            data[value.name] = checkedValue;
        } else {
            const checkedValue = value.dataset.uniqloUnchecked;
            if (checkedValue === undefined) return
            data[value.name] = checkedValue;
        }
    })
    document.getElementById(formId).querySelectorAll('input[name=birthDate]').forEach((value) => {

        if (value.value.length !== 0) {
            if (DOBValid) {
                const DOB = value.value.split('/');
                data[value.name] = DOB[2] + '/' + DOB[1] + '/' + DOB[0];

            } else {
                validForm = false;
                adobeMessages.push('Invalid date of birth entered, please try again.')
            }

        }
    })
    document.getElementById(formId).querySelectorAll('option:checked').forEach((value) => {
        if (value.text.length != 0) {
            data[value.value] = value.text;
        }
    })
}

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

function onDOBInput(event) {
    //only allow numbers and /
    event.target.value = event.target.value.replace(/[^0-9\/]/g, '').replace(/(\..*)\./g, '$1');
    let reg = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

    if (reg.test(event.target.value)) {
        event.target.classList.add('valid-input');
        event.target.classList.remove('invalid-input');
        DOBValid = true;
    } else {
        event.target.classList.add('invalid-input');
        event.target.classList.remove('valid-input')
        DOBValid = false;
    }
}

