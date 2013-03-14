/**
 * Start the file sharing.
 *
 * @param {string} fileId the ID of the file to share.
 */
function shareFile (fileId) {

    var data = {
        'type':'user',
        'role':'reader',
        'value':'aristide.niyungeko@gmail.com'
    };

    $.ajax({
        type:"POST",
        url:"https://www.googleapis.com/drive/v2/files/" + fileId + "/permissions?access_token=" + drivePlayer.googleAuthInstance.getAccessToken(),
        type:"POST",
        data:JSON.stringify(data),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success:function (msg) {
            console.log(msg)
        },
        error:function (errormessage) {

            console.log(errormessage)

        }
    });
}


/**
 * Event handler for file sharing.
 *
 * @param {Object} evt Arguments from the share button.
 */
function shareHandler(evt) {
    shareFile(evt.target.id);
}