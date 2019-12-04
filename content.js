window.addEventListener("load", function () {

    window.zip = new JSZip();
    window.prepareZip = function (url) {
        return fetch(url).then(function (data) {
            return data.arrayBuffer();
        }).then(function (arrayBuffer) {
            //console.log(arrayBuffer);
            var uint8R = new Uint8Array(arrayBuffer);
            var nameIndex = Object.entries(zip.files).length + 1;
            zip.file(nameIndex + ".png", uint8R);
        });
    }

    window.prepareForDownload = function () {
        var promises = [];

        $(".cb-download-all:checked").parent().parent().each(function (index, el) {
            var bgImage = $(el).css("background-image");
            var match = (bgImage || "").match(/url\("(.*?):(.*)"\)/);
            if (!match) return;

            var isBlob = match[1] == "blob";
            if (!isBlob) return;

            var url = "blob:" + match[2];
            promises.push(prepareZip(url));
        });


        Promise.all([].concat(promises)).then(function () {
            //console.log("Prepare bitti");
            zip.generateAsync({ type: "blob" })
                .then(function (blob) {
                    var date = new Date();
                    var month = ("0" + date.getUTCMonth() + 1).slice(-2);
                    var day = ("0" + date.getUTCDate()).slice(-2);
                    var year = ("0" + date.getUTCFullYear()).slice(-2);
                    var hours = ("0" + date.getHours()).slice(-2);
                    var minutes = ("0" + date.getMinutes()).slice(-2);

                    var curr = day + "-" + month + "-" + year + "_" + hours + "." + minutes;

                    saveAs(blob, "WpDownloads"+curr+".zip");
                    zip.files = {};
                    $(".cb-download-all:checked").prop("checked", false);
                });
        });
    }


    window.download = function () {
        if ($(".cb-download-all:checked").length <= 0) {
            alert("Lütfen indirilecek görüntüleri seçiniz.");
            // Please select images to download
            return;
        }

        prepareForDownload();
    }

    console.log("WP Multi Download");

    function callEvent() {
        $(document).off("DOMSubtreeModified", ".app-wrapper-web > span:eq(2)");
        var holder = $(this).find("._3lq69");
        if (holder.length == 0) {
            $(document).on("DOMSubtreeModified", ".app-wrapper-web > span:eq(2)", callEvent);
            return console.log("closing");
        }

        var downloadAll = $(holder).find(".download-all");
        if (downloadAll.length != 0) {
            $(document).on("DOMSubtreeModified", ".app-wrapper-web > span:eq(2)", callEvent);
            return;
        };

        $(holder).prepend('<div class="download-all"><div class="_3j8Pd"><div role="button" title="Tümünü İndir"><span data-icon="download" class=""><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#0fc041" d="M18.9 10.3h-4V4.4H9v5.9H5l6.9 6.9 7-6.9zM5.1 19.2v2H19v-2H5.1z"></path></svg></span></div><span></span></div></div>');
        $(this).find('._2wPfr._1LdNS .grK2C').html('<div><input type="checkbox" class="cb-download-all"/></div>');
        $(document).on("DOMSubtreeModified", ".app-wrapper-web > span:eq(2)", callEvent);
    }

    $(document).on("click", ".download-all", function () {
        download();
    });

    $(document).on("DOMSubtreeModified", "._2ogLZ", callCheckbox);

    function callCheckbox() {
        $(document).off("DOMSubtreeModified", "._2ogLZ");
        $(this).find('.grK2C').html('<div><input type="checkbox" class="cb-download-all"/></div>');

        $(document).on("DOMSubtreeModified", "._2ogLZ", callCheckbox);
    }

    $(document).on("DOMSubtreeModified", ".app-wrapper-web > span:eq(2)", callEvent);

});