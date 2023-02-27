function Validator (options) {
    var selectorRules = {}
    var formElement = document.querySelector(options.form)

    // Submit form
    formElement.onsubmit = (e) => {
        var isFormValid = true;
        e.preventDefault()
        
        options.rules.forEach(rule => {
            var inputElement = formElement.querySelector(rule.selector)
            var isValid = validate(inputElement, rule)
            
            if (isValid) {
                isFormValid = false
            }            
        })

        if (isFormValid) {
            if (typeof options.onSubmit === 'function') {
                var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                console.log(enableInputs);
                var formValues = Array.from(enableInputs).reduce((values, input) => {
                    return (values[input.name] = input.value) && values
                }, {})
                options.onSubmit(formValues)
            }
        }
    }

    function validate(inputElement, rule) {
        var errorMessage
        var errorElement = inputElement.parentElement.querySelector(options.errorMesageSelector)  

        var rules = selectorRules[rule.selector]
        for (let i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value)
            if (errorMessage) break
        }
        


        if (errorMessage) {
            showError(errorMessage, errorElement, inputElement)
        } else {
            hiddenError(errorElement, inputElement)
        }

        return !!errorMessage
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

            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }

            if (inputElement) {
                inputElement.onblur = () => {
                    validate(inputElement, rule)
                }

                inputElement.oninput = () => {
                    errorElement.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        })
    }
}

Validator.isRequired = (selector, message) => {
    return {
        selector,
        test(value) {
            return value ? undefined : message || 'Bạn phải nhập trường này!'
        }
    }
}

Validator.isEmail = (selector, message) => {
    return {
        selector,
        test(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : message || 'Trường này phải là email!'
        }
    }
}

Validator.minLength = (selector, min, message) => {
    return {
        selector,
        test(value) {
            return value.length >= min ? undefined : message || `Mật khẩu ít nhất ${min} ký tự`
        }
    }
}

Validator.isConfirmed = (selector, getComfirmValue, message) => {
    return {
        selector,
        test(value) {
            return value === getComfirmValue() ? undefined : message || 'Không trùng khớp'
        }
    }
}