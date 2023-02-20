function Validator (options) {
    var formElement = document.querySelector(options.form)

    function validate(inputElement, rule) {
        var errorMessage = rule.test(inputElement.value)
        var errorElement = inputElement.parentElement.querySelector(options.errorMesageSelector)

        if (errorMessage) {
            showError(errorMessage, errorElement, inputElement)
        } else {
            hiddenError(errorElement, inputElement)
        }
    }

    function showError(errorMessage, errorElement, inputElement) {
        errorElement.innerText = errorMessage
        inputElement.parentElement.classList.add('invalid')
    }

    function hiddenError(errorElement, inputElement) {
        errorElement.innerText = ''
        inputElement.parentElement.classList.remove('invalid')
    }

    if (formElement) {
        options.rules.forEach(rule => {
            var inputElement = formElement.querySelector(rule.selector)
            var errorElement = inputElement.parentElement.querySelector(options.errorMesageSelector)

            if (inputElement) {
                inputElement.onblur = () => {
                    var errorMessage = rule.test(inputElement.value)

                    if (errorMessage) {
                        showError(errorMessage, errorElement, inputElement)
                    } else {
                        hiddenError(errorElement, inputElement)
                    }
                }

                inputElement.oninput = () => {
                    errorElement.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        })
    }
}

Validator.isRequired = (selector) => {
    return {
        selector,
        test(value) {
            return value.trim() ? undefined : 'Bạn phải nhập trường này!'
        }
    }
}

Validator.isEmail = (selector) => {
    return {
        selector,
        test(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Trường này phải là email!'
        }
    }
}