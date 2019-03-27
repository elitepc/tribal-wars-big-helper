coiso = $('#commands_table').find('tr:nth-child(2)')
$('#commands_table').prepend(coiso.clone())
for (i = 3; i <= 15; i++) {

    $('tr.nowrap').first().find('.unit-item:nth-child(' + i + ')').each(function() {
        $(this).text('')
        $(this).removeClass('hidden')
    });

}



for (i = 3; i <= 15; i++) {
    sum = 0

    $('tr.nowrap').find('.unit-item:nth-child(' + i + ')').each(function() {

        sum -= -$(this).text();
    });
    $('tr.nowrap').first().find('.unit-item:nth-child(' + i + ')').text(sum)
}

$('tr.nowrap').find('.unit-item:nth-child(11)').each(function() {
    sum -= -$(this).text();
});
