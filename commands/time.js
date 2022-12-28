require('dotenv').config();

const { SlashCommandBuilder } = require('discord.js');

apiKey = process.env.APIKEY_TZDB;
module.exports = {
  data: new SlashCommandBuilder()
    .setName('time')
    .setDescription('Check the time somewhere')
    .addStringOption(option =>
      option.setName('location')
        .setDescription('For which location would you like to know the time?'))
  ,
  async execute(interaction) {
    const suggest = [
      String(interaction.options.getString("location") ?? 'ip'),
    ];
    //console.log(`SUGGEST STRING IS EQUAL TO = ${String(suggest)} with type ${typeof String(suggest)}`);

    if (suggest !== 'ip') {
      fetch(`https://nominatim.openstreetmap.org/search/${suggest}?format=json&addressdetails=1&limit=1&polygon_svg=1`)
        .then(function (response) {
          return (response.json())
        }).then(async function (lData) {
          console.log(lData[0].address)
          // const temp = [data[0].lat, data[0].lon]
          // console.log(`Returning: ${temp[0]} and ${temp[1]}`);
          // return (temp);

          fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lData[0].lat}&lng=${lData[0].lon}`)
            .then(function (response) {
              return response.json();
            }).then(async function (tData) {

              var time = tData.formatted;

              await interaction.reply(`The time in ${suggest} in the ${tData.nextAbbreviation} timezone is ${time.slice(time.indexOf(' ') + 1)}.`)

            });


        });
        return;
    }

    return suggest;

  }
};

function convertUnix(unixtime) {
  var date = new Date(unixtime * 1000);
  var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var sec = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return (`${hour}:${min}:${sec}`);
}

//  Output format
// [
//   {
//     place_id: 106196618,
//     licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
//     osm_type: 'way',
//     osm_id: 15976890,
//     boundingbox: [ '52.5170798', '52.5173311', '13.3975116', '13.3981577' ],
//     lat: '52.51720765',
//     lon: '13.397834399325466',
//     display_name: 'Kommandantenhaus, 1, Unter den Linden, Mitte, Berlin, 10117, Deutschland',
//     class: 'historic',
//     type: 'house',
//     importance: 0.8135042058306902,
//     address: {
//       historic: 'Kommandantenhaus',
//       house_number: '1',
//       road: 'Unter den Linden',
//       suburb: 'Mitte',
//       borough: 'Mitte',
//       city: 'Berlin',
//       'ISO3166-2-lvl4': 'DE-BE',
//       postcode: '10117',
//       country: 'Deutschland',
//       country_code: 'de'
//     },
//     svg: 'M 13.3975116 -52.5172905 L 13.397549 -52.5170798 13.397715 -52.5170906 13.3977122 -52.5171064 13.3977392 -52.5171086 13.3977417 -52.5170924 13.3979655 -52.5171069 13.3979623 -52.5171233 13.3979893 -52.5171248 13.3979922 -52.5171093 13.3981577 -52.5171203 13.398121 -52.5173311 13.3978115 -52.5173103 Z'
//   }
// ]