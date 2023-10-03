import * as ajax from "./shared/ajax.js";

$(document).ready(() => {

    function buildInvalidMessage(field, message) {
        let messageElement = document.createElement('div')
        let messageContent = document.createTextNode(message)
        let targetElement = document.getElementById(field+'Field')

        messageElement.classList.add('invalid-feedback', '${field}Message')
        messageElement.appendChild(messageContent)
        targetElement.insertAdjacentElement('afterend', messageElement);
    }

    function toggleValidClasses(field, removeClass, addClass) {
         $("#" + field)
             .removeClass(removeClass)
             .addClass(addClass)
             .siblings().remove()
         ;
    }

    $(".fieldForm").on("focusout", () => {
        const fieldId = event.target.id;
        const field = event.target.name; // we will use this later for validation messages
        const value = event.target.value; // value of the field we want to check
        const values = {
            'field': field,
            'value': value,
            'locale': window.locale
        };

        const passwordConfirmField = "passwordConfirmField";
        const validField = "is-valid";
        const invalidField = "is-invalid";

        if (fieldId === passwordConfirmField) {
            //check if passwords match
            let firstPassword = $("#passwordField").val();

            if (firstPassword !== value) {
                toggleValidClasses(passwordConfirmField, validField, invalidField);
                buildInvalidMessage('passwordConfirm', '');
            } else {
                toggleValidClasses(passwordConfirmField, invalidField, validField);
            }

            event.stopPropagation();
        }

        ajax.getDetails("/api/validateField", values)
            .done((response) => {
                //make it dynamic
                const fieldContainerName = field + "Field";

                if (response[field] !== undefined) {
                    toggleValidClasses(fieldContainerName, validField, invalidField)
                    buildInvalidMessage(field, response[field])
                } else {
                    toggleValidClasses(fieldContainerName, invalidField, validField)
                }
            })
            .fail((textStatus) => {
                $("#textFail").remove();
                $("<div/>", {
                    id: "textFail",
                    class: "text-danger",
                    //you can go on and add properties
                    html: `Something went wrong: ${textStatus}`
                }).appendTo("body");
            });
    });

    $(".nav-link").on("click", (e) => {
        e.stopPropagation();
    });
});
