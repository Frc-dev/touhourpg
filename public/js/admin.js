import * as ajax from "./shared/ajax";
import * as modalShow from "./admin/modal";

$(document).ready(() => {
    const admin = $("#userGlobal").attr("value");
    let reportId = 0;

    $(".icon").on("click", () => {
        const user = $(this).attr("user");
        const modalType = $(this).attr("data-target");

        switch (modalType) {
            case "#bansModal":
                $("#bansModal").on("show.bs.modal", modalShow.bansModal(user));
                break;
            case "#reportsModal":
                $("#reportsModal").on("show.bs.modal", modalShow.reportModal(user));
                break;
            case "#historyModal":
                $("#reportsModal").on("show.bs.modal", modalShow.historyModal(user));
                break;
            default:
                break;
        }
    });

    $(document).on("click", ".inboxSubject", () => {
        // receive report id for ajax call
        reportId = $(this).attr("data-id");

        $("#reportHandlerModal").modal("show");
        // close previous modal and empty data
        $("#reportList").html("");
        $("#reportsModal").modal("hide");
        // ajax call to get full report data
        const values = {
            reportId,
        };

        ajax.getDetails("/admin/getIndividualReport", values).done((response) => {
            if (response.success !== undefined) {
                const report = response.success[0];

                $("#reportContent").append(report.reason);
            } else {
                // TODO proper error logging
            }
        });
    });

    $("#reportProcess").on("click", () => {
        if ($("#reportHandlingText").val() !== "") {
            // process report and add reason of report
            const values = {
                reportId,
                reportAction: $("#reportHandlingText").val(),
                processedBy: admin,
            };
            ajax.getDetails("/admin/processReport", values).done((response) => {
                if (response.success !== "undefined") {
                    alert(response.success);
                    window.location.reload();
                } else {
                    alert(response.error);
                }
            });
        }
    });

    $("#banProcess").on("click", () => {
        if ($("#banHandlingText").val() !== "") {
            // process ban and add reason of unban
            const banId = $(this).attr("banId");
            const banAction = $("#banHandlingText").val();

            const values = {
                banId,
                banAction,
                processedBy: admin,
            };
            ajax.getDetails("/admin/processBan", values).done((response) => {
                if (response.success !== "undefined") {
                    alert(response.success);
                    window.location.reload();
                } else {
                    alert(response.error);
                }
            });
        }
    });

    $("#warningAdd").on("click", () => {
        if ($("#warningAddText").val() !== "") {
            // add warning
            const user = $(this).attr("userId");
            const warningAction = $("#warningAddText").val();

            const values = {
                userId: user,
                warningAction,
                processedBy: admin,
            };
            ajax.getDetails("/admin/addWarning", values).done((response) => {
                if (response.success !== "undefined") {
                    alert(response.success);
                    window.location.reload();
                } else {
                    alert(response.error);
                }
            });
        }
    });

    $("#banAdd").on("click",() => {
        if ($("#banAddText").val() !== "") {
            // process ban and add reason of unban
            const user = $(this).attr("userId");
            const banAction = $("#banAddText").val();

            const values = {
                userId: user,
                banAction,
                processedBy: admin,
            };

            ajax.getDetails("/admin/addBan", values).done((response) => {
                if (response.success !== undefined) {
                    alert(response.success);
                    window.location.reload();
                } else {
                    alert(response.error);
                }
            });
        }
    });

    $("#reportHandlerModal").on("hide.bs.modal", () => {
        $("#reportHandlingText").val("");
        $("#reportContent").html("");
    });
});
