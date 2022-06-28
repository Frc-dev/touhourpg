// eslint-disable-next-line import/prefer-default-export
export function getDetails
(
    link,	
    values,
    requestType = "POST",
    dataType = "json",
    headers = {"X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")}
) 
{
    return $.ajax({
        headers,
        url: link,
        type: requestType,
        dataType,
        data: values,
    });
}