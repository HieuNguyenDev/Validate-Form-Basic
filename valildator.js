const $ = document.querySelector.bind(document)

function Validator(options) {
    var formElement = $(options.form)
    
    if (formElement) {
        console.log(options.rules);
    }
}

Validator.isRequired = function(selector) {
    return selector
}

Validator.isEmail = function(selector) {
    return selector
}