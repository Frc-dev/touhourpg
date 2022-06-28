
$(document).ready(() => {
    const user = $("#user").attr("value");
    const userProfile = $("#userProfile").attr("value");

    $("#formuploadajax").on("submit", (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", $("input[type=file]")[0].files[0]);
        formData.append("user", user);
        $.ajax({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            url: "/edit/uploadUserFile",
            type: "post",
            dataType: "json",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
        }).done((response) => {
            if (response.success !== undefined) {
                alert(response.success);
                window.location.reload();
            } else {
                alert(response.error);
                window.location.reload();
            }
        });
    });

    $(".editable").on("focusout", function (e) {
        const message = this.innerText;
        const field = this.id;

        if (message !== "") {
            $.ajax({
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                },
                url: "/edit/editUser",
                type: "post",
                dataType: "json",
                data: { message, field, user },
            }).done((response) => {
                if (response.success !== undefined) {
                    alert(response.success);
                    window.location.reload();
                } else {
                    alert(response.error);
                    window.location.reload();
                }
            });
        }
    });

    $(".sendMessage").on("click", (event) => {
        const subject = $("#subjectMessage").val();
        const message = $("#privateMessage").val();
        const sender = user;
        const receiver = userProfile;

        if (message !== "") {
            $.ajax({
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                },
                url: "/edit/sendMessage",
                type: "post",
                dataType: "json",
                data: {
                    subject,
                    message,
                    sender,
                    receiver,
                },
            }).done((response) => {
                if (response.success !== undefined) {
                    alert(response.success);
                    window.location.reload();
                } else {
                    alert(response.error);
                    window.location.reload();
                }
            });
        }
    });

    $(".reportButton").on("click", (e) => {
        const message = $("#reportText").val();
        if (message !== "") {
            // ajax call to add report to the list
            $.ajax({
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                },
                url: "/edit/sendReport",
                type: "post",
                dataType: "json",
                data: {
                    reported: userProfile,
                    message,
                    reporter: user,
                },
            }).done((response) => {
                if (response.success !== undefined) {
                    alert(response.success);
                    $("#reportText").val("");
                    window.location.reload();
                } else {
                    alert(response.error);
                }
            });
        }
    });
});
