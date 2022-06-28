import * as ajax from "./shared/ajax";

$(document).ready(() => {
    const user = $("#userGlobal").attr("value");

    ajax.getDetails("/load/loadMessages").done((response) => {
        if (response.success !== undefined) {
            if (response.success > 0) {
                $("#msgCount").append(response.success);
                $(".inboxIcon").attr(
                    "src",
                    "/open-iconic/svg/envelope-open.svg"
                );
            } else {
                $("#msgCount").append(response.success);
            }
        }
    });

    $("#inboxModal").on("show.bs.modal", () => {
        // first time we enter we retrieve a list to show all messages

        ajax.getDetails("/load/loadMessagesList").done((response) => {
            if (response.success !== undefined) {
                $(".cont").remove();
                const messageList = response.success;
                $.each(messageList, (i) => {
                    $("#listMessage").append(
                        `${"<div class='cont'>" +
                            "<div class='inboxId' hidden>"}${ 
                            messageList[i].id 
                            }</div>` +
                            `<a class='inboxSubject float-left' id =${ 
                            messageList[i].id 
                            } data-id =${ 
                            messageList[i].id 
                            } href='' data-toggle='modal' data-target='#privateMessageModal'>${ 
                            messageList[i].subject 
                            }</a>` +
                            `<div class='float-right'>${ 
                            messageList[i].created_at 
                            }</div>` +
                            `<br><a class='inboxFrom'>${ 
                            messageList[i].from 
                            }</a>` +
                            `</div>`
                    );

                    $(".inboxFrom").attr("href", `/u/${  messageList[i].from}`);

                    if (messageList[i].status === "UNREAD") {
                        $(`.inboxSubject#${  messageList[i].id}`)
                            .attr("data-id", messageList[i].id)
                            .css({
                                "font-weight": "bold",
                                "font-size": "16px",
                                color: "blue",
                            });

                        $(".cont").css({
                            "border-left": "5px solid blue",
                        });
                    } else {
                        $(`.inboxSubject#${  messageList[i].id}`)
                            .attr("data-id", messageList[i].id)
                            .css({
                                color: "black",
                            });
                    }
                });
                // add style and positioning
                $(".cont").css({
                    border: "1px solid",
                    "background-color": "beige",
                });

                $(".inboxSubject").css({
                    "margin-left": "5px",
                });

                $(".inboxFrom").css({
                    "font-size": "80%",
                    "margin-left": "10px",
                    color: "gray",
                });
            } else {
                // TODO why is this empty
            }
        });
    });

    $("#privateMessageModal").on("show.bs.modal", (e) => {
        $("#inboxModal").modal("hide");

        const messageId = $(e.relatedTarget).data("id");
        // $(this).find('.modal-body input').val(bookId)
        $(".replyMessage").attr("id", messageId);
        // when entering here we search the message to show its values

				ajax.getDetails(
					"/load/loadIndividualMessage",
					{message: messageId}
				).done((response) => {
            if (response.messageData !== undefined) {
                const {messageData} = response;
                $("#messageFrom").append(response.fromText + messageData.from);
                $("#messageSubject").append(
                    response.subjectText + messageData.subject
                );
                $("#messageDate").append(messageData.created_at);
                $("#messageContent").append(messageData.message);
            } else {
                // TODO why is this empty
            }
        });
    });

    $("#privateMessageModal").on("hide.bs.modal", () => {
        $("#messageFrom").html("");
        $("#messageSubject").html("");
        $("#messageDate").html("");
        $("#messageContent").html("");

        $("#inboxModal").modal("show");
    });

    $(".replyMessage").on("click", () => {
        const messageId = $(this).attr("id");

        $("#messageFrom").html("");
        $("#messageSubject").html("");
        $("#messageDate").html("");
        $("#messageContent").html("");

        $("#privateMessageModal").modal("hide");

        $("#sendReplyModal").modal("show");

        $.ajax({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            url: "/load/getReplyData",
            type: "post",
            dataType: "json",
            data: {
                message: messageId,
            },
        }).done((response) => {
            if (response.messageData !== undefined) {
                const {messageData} = response;
                $("#replyTo").append(response.toText + messageData.from);
                $("#replySubjectLabel").append(response.subjectText);
                $("#replySubject").attr("value", `RE: ${  messageData.subject}`);
                $("#replyMessageLabel").append(response.messageText);
                $("#replyMessage").append(messageData.message);

                $("#replyTo").attr("sender", messageData.from);
            }
        });
    });

    $(".sendMessage").on("click", () => {
        const subject = $("#replySubject").val();
        const message = $("#replyMessage").val();
        const sender = user;
        const receiver = $("#replyTo").attr("sender");

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
                    $("#sendMessageModal").modal("hide");
                } else {
                    alert(response.error);
                }
            });
        }
    });
});
