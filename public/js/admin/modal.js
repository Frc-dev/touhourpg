import * as ajax from "../shared/ajax";

export function reportModal(user) {
    const userTab =
        `<div class='float-left ml-1 userReportName'>${  user  }</div>`;
    // ajax call to receive all pending reports
    const values = {
        user,
    };

    ajax.getDetails("/admin/getReports", values).done((response) => {
        if (response.success !== "undefined") {
            $(userTab).detach();
            $(".cont").css("");
            $(".cont").empty();

            $(userTab).insertAfter("#reportHeaderMsg");
            const reportList = response.success;
            $.each(reportList, (i) => {
                const reportDate = new Date(reportList[i].created_at);
                let subject = reportList[i].reason.substring(0, 15);
                if (reportList[i].reason.length > 15) {
                    subject += "...";
                }
                $("#reportList").append(
                    `${"<div class='cont' style='border: 1px solid'>" +
                        "<div class='reportId' hidden>"}${ 
                        reportList[i].id 
                        }</div>` +
                        `<a class='inboxSubject float-left' id =${ 
                        reportList[i].id 
                        } data-id =${ 
                        reportList[i].id 
                        } href='' data-toggle='modal' data-target='#reportHandlerModal'>${ 
                        subject 
                        }</a>` +
                        `<div class='float-right'>${ 
                        reportDate.toLocaleDateString() 
                        }     ${ 
                        reportDate.toLocaleTimeString() 
                        }</div>` +
                        `<br><a class='inboxFrom'>${ 
                        reportList[i].reported 
                        }</a>` +
                        `</div><br>`
                );
            });
        }
    });
}

export function bansModal(user) {
    const userTab =
        `<div class='float-left ml-1 userBanName'>${  user  }</div>`;
    // ajax call to receive all bans
    const values = {
        user,
    };
    
    ajax.getDetails("/admin/getBans", values).done((response) => {
        if (response.success !== "undefined") {
            $(userTab).detach();
            $(".cont").css("");
            $(".cont").empty();
            $(userTab).insertAfter("#banHeaderMsg");
            const banList = response.success;
            $.each(banList, (i) => {
                const banDate = new Date(banList[i].created_at);

                if (banList[i].status === "Active") {
                    $("#banContent").append(
                        `${"<div class='cont' style='border: 1px solid'>" +
                            "<div class='reportId' hidden>"}${ 
                            banList[i].id 
                            }</div>` +
                            `<div class='float-right'>${ 
                            banDate.toLocaleDateString() 
                            }     ${ 
                            banDate.toLocaleTimeString() 
                            }</div>` +
                            `<a class='banBy'>${ 
                            banList[i].bannedBy 
                            }</a><BR> ` +
                            `<a class='banReason'>${ 
                            banList[i].reason 
                            }</a>` +
                            `</div><br>`
                    );

                    $("#banProcess").attr("banId", banList[i].id);
                }
            });
        }
    });
}

export function historyModal(user) {
    const userTab =
        `<div class='float-left ml-1 userHistoryName'>${  user  }</div>`;
    // ajax call to receive the historical for an user
    const values = {
        user,
    };

    ajax.getDetails("/admin/getHistory", values).done((response) => {
        if (response !== "undefined") {
            $(userTab).detach();

            $(userTab).insertAfter("#historyHeaderMsg");
            const banList = response.bans;
            const warningList = response.warnings;

            if (warningList.length === 0) {
                $(".warningHistory").append(
                    "<div class='cont mb-4'><i>No warnings found</i></div>"
                );
            }

            if (banList.length === 0) {
                $(".banHistory").append(
                    "<div class='cont mb-4'><i>No bans found</i></div>"
                );
            }
            $.each(banList, (i) => {
                const banDate = new Date(banList[i].created_at);
                $(".banHistory").append(
                    `${"<div class='cont' style='border: 1px solid'>" +
                        "<div class='reportId' hidden>"}${ 
                        banList[i].id 
                        }</div>` +
                        `<div class='float-right'>${ 
                        banDate.toLocaleDateString() 
                        }     ${ 
                        banDate.toLocaleTimeString() 
                        }</div>` +
                        `<a class='banStatus'>${ 
                        banList[i].status 
                        }</a><BR> ` +
                        `<a class='banBy'>${ 
                        banList[i].bannedBy 
                        }</a><BR> ` +
                        `<a class='banReason'>${ 
                        banList[i].reason 
                        }</a>` +
                        `</div><br>`
                );
                $(".banStatus").addClass(banList[i].status);
            });

            $.each(warningList, (i) => {
                const warningDate = new Date(warningList[i].created_at);

                $(".warningHistory").append(
                    `${"<div class='cont' style='border: 1px solid'>" +
                        "<div class='warningId' hidden>"}${ 
                        warningList[i].id 
                        }</div>` +
                        `<div class='float-right'>${ 
                        warningDate.toLocaleDateString() 
                        }     ${ 
                        warningDate.toLocaleTimeString() 
                        }</div>` +
                        `<a class='warnedBy'>${ 
                        warningList[i].warnedBy 
                        }</a><BR> ` +
                        `<a class='warnReason'>${ 
                        warningList[i].reason 
                        }</a>` +
                        `</div><br>`
                );
            });
            $("#banAdd").attr("userId", user);
            $("#warningAdd").attr("userId", user);
        }
    });
}