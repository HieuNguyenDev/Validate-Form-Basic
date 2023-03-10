function Validator (options) {
    var formElement = document.querySelector(options.form)
    var selectorRules = {}

    // Submit form
    if (formElement) {
        formElement.onsubmit = (e) => {
            var isFormValid = true
            e.preventDefault()
            options.rules.forEach(rule => {
                var inputElement = formElement.querySelector(rule.selector)
                var isInvalid = validate(inputElement, rule)

                if (isInvalid) {
                    isFormValid = false
                }
            })

            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                    var formValues = Array.from(enableInputs).reduce((values, input) => {
                        return (values[input.name] = input.value) && values
                    }, {})
                    options.onSubmit(formValues)
                } else {
                    formElement.submit()
                }
            }
        }
    }

    function validate (inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector('.form-message')
        var rules = selectorRules[rule.selector]
        var errorMessage
        
        for (let i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value)
            if (errorMessage) break;
        }

        if (errorMessage) {
            inputElement.parentElement.classList.add('invalid')
            errorElement.innerText = errorMessage
        } else {
            inputElement.parentElement.classList.remove('invalid')
            errorElement.innerText = ''
        }

        return !!errorMessage
    }

    if (formElement) {
        options.rules.forEach(rule => {
            var inputElement = formElement.querySelector(rule.selector)
            var errorElement = inputElement.parentElement.querySelector('.form-message')

            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }
            
            inputElement.onblur = () => {
                validate(inputElement, rule)
            }

            inputElement.oninput = () => {
                inputElement.parentElement.classList.remove('invalid')
                errorElement.innerText = ''

            }
        })
        console.log(selectorRules);
    }
}

Validator.isRequired = (selector, message) => {
    return {
        selector,
        test(value) {
            return value.trim() ? undefined : message || 'Kh??ng ???????c ????? tr???ng'
        }
    }
}

Validator.isEmail = (selector, message) => {
    return {
        selector,
        test(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : message || 'Tr?????ng n??y ph???i l?? email'
        }
    }
}

Validator.minLength = (selector, min, message) => {
    return {
        selector,
        test(value) {
            return value.length >= min ? undefined : message || `M???t kh???u ??t nh???t ${min} k?? t??? `
        }
    }
}

Validator.isConfirmed = (selector, getConfirmValue, message) => {
    return {
        selector,
        test(value) {
            return value === getConfirmValue() ? undefined : message || 'Kh??ng tr??ng kh???p'
        }
    }
}