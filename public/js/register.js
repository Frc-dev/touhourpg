import * as ajax from "./shared/ajax.js";

$(document).ready(() => {

    $(".fieldForm").on("focusout", () => {
        const field = event.target.id; // we will use this later for validation messages
        const value = event.target; // value of the field we want to check
        const values = {
            field,
            value,
        };

        console.log(values)
        ajax.getDetails(values, "validateField")
            .done((response) => {
                if (response.success !== undefined) {
                    if (field !== "password-confirm" && field !== "password") {
                        const div =
                            `<span class='valid-feedback   ${
                            field
                            }Valid'><strong>${
                            response.success
                            }</strong></span>`;
                        $(`.${  field  }Valid`).remove(); // remove message
                        $(`#${  field}`)
                            .removeClass("is-invalid")
                            .addClass("is-valid"); // change classes
                        $(div).insertAfter(`#${  field}`);
                    } else {
                        // check password and repeated password
                        const pass = $("#password").val();
                        // we don't know if this var will be used but it was in prod
                        // const passConfirm = $("#password-confirm").val();

                        /* if(!empty(passConf)){
                           if(campo === "password"){
                               //ya existe una pass para comparar y acabamos de cambiar la password principal
                               if(pass === value){
                                   //contraseñas coinciden

                               }
                           }
                       } */
                        if (pass !== value) {
                            // TODO untranslated strings
                            const div =
                                "<span class='invalid-feedback passwordValid'><strong>Passwords don't match.</strong></span>";
                            const div2 =
                                "<span class='invalid-feedback password-confirmValid'><strong>Passwords don't match.</strong></span>";
                            $(".passwordValid").remove(); // remove message
                            $(".password-confirmValid").remove();

                            $("#password")
                                .removeClass("is-valid")
                                .addClass("is-invalid"); // change class
                            $("#password-confirm")
                                .removeClass("is-valid")
                                .addClass("is-invalid");

                            $(div).insertAfter("#password");
                            $(div2).insertAfter("#password-confirm");
                        } else {
                            const div =
                                "<span class='valid-feedback passwordValid'><strong>Valid password.</strong></span>";
                            $(".passwordValid").remove(); // remove message
                            $(".password-confirmValid").remove();

                            $("#password")
                                .removeClass("is-invalid")
                                .addClass("is-valid"); // change class
                            $("#password-confirm")
                                .removeClass("is-invalid")
                                .addClass("is-valid");

                            $(div).insertAfter("#password");
                        }
                    }
                } else {
                    // error
                    const div =
                        `<span class='invalid-feedback ${
                        field
                        }Valid'><strong>${
                        response.error
                        }</strong></span>`;
                    $(`.${  field  }Valid`).remove();
                    $(`#${  field}`)
                        .removeClass("is-valid")
                        .addClass("is-invalid");
                    $(div).insertAfter(`#${  field}`);
                }
            })
            .fail((textStatus) => {
                $("#textFail").remove();
                $("<div/>", {
                    id: "textFail",
                    class: "text-danger",
                    //you can go on and add properties
                    html: `Something went wrong: ${ textStatus }`,
                }).appendTo("body");
            });
    });

    $(".nav-link").on("click", (e) => {
        e.stopPropagation();
    });
});
