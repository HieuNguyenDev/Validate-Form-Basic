const $ = document.querySelector.bind(document)

function Validator(options) {
    var formElement = $(options.form)

    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorMesageSelector)
        var errorMessage = rule.test(inputElement.value)
        if (errorMessage) {
            errorElement.innerText = errorMessage
            inputElement.parentElement.classList.add('invalid')
        } else {
            errorElement.innerText = ''
            inputElement.parentElement.classList.remove('invalid')
        }
    }
    
    if (formElement) {
        options.rules.forEach(rule => {
            var inputElement = formElement.querySelector(rule.selector)

            if (inputElement) {
                var errorElement = inputElement.parentElement.querySelector(options.errorMesageSelector)
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

// Nếu không có inputValue thì trả ra message lỗi
// Nếu hợp lệ thì trả về undefined
Validator.isRequired = (selector) => {
    return {
        selector,
        test(value) {
            return value.trim() ? undefined : 'Không được để trống'
        }
    }
}

Validator.isEmail = (selector) => {
    return {
        selector,
        test(value) {
            var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return emailRegex.test(value) ? undefined : 'Trường này phải là email'
        }
    }
}

Validator.minLength = (selector, min) => {
    return {
        selector,
        test(value) {
            return value.length >= min ? undefined : `Mật khẩu ít nhất ${min} ký tự`
        }
    }
}