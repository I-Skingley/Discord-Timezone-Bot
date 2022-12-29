require('dotenv').config();
var moment = require('moment-timezone');

const { SlashCommandBuilder } = require('discord.js');

apiKey = process.env.APIKEY_TZDB;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('compare')
    .setDescription('Check the time somewhere')
    .addStringOption(option =>
      option.setName('location')
        .setDescription('For which location would you like to know the time?')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('hour')
        .setDescription('What time would you like to convert?')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(23))
    .addIntegerOption(option =>
      option.setName('minutes')
        .setDescription('What time would you like to convert?')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(59))
  ,
  async execute(interaction) {
    const date = new Date();
    const suggest = String(interaction.options.getString("location"));
    var hour = interaction.options.getInteger("hour");
    var minute = interaction.options.getInteger("minutes");
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;

    //console.log(`hours: ${hour} + minutes: ${minute}`)
    // console.log(`SUGGEST STRING IS EQUAL TO = ${String(suggest)} with type ${typeof String(suggest)}`);

      fetch(`https://nominatim.openstreetmap.org/search/${suggest}?format=json&addressdetails=1&limit=1&polygon_svg=1`)
        .then(function (response) {
          return (response.json())
        }).then(async function (lData) {
          //console.log(lData[0].address)

          fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lData[0].lat}&lng=${lData[0].lon}`)
            .then(function (response) {
              return response.json();
            }).then(async function (tData) {

              // console.log(tData)
              // console.log(tData.zoneName);
              const current = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
              var m = moment.tz(`${current} ${hour}:${minute}`,`${moment.tz.guess()}`)
        
              // console.log(m.format())
              // console.log(m.tz(tData.zoneName).format("hh:mm:ss"))


              // console.log(`${hour}:${minute} will be ${moment.utc(`${current} ${hour}:${minute}`).tz(`${tData.zoneName}`).utc().format()} in ${suggest}`)

              var time = tData.formatted;

              await interaction.reply(`${hour}:${minute} in ${moment.tz.guess()} will be ${moment.utc(`${current} ${hour}:${minute}`).tz(`${tData.zoneName}`).utc().format("hh:mm")} in ${suggest} in the ${tData.nextAbbreviation} timezone.`)

            });

        });
      return;
  }
};

//  Output format
// Nominatim
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

// timezondb
// {
//   status: 'OK',
//   message: '',
//   countryCode: 'NO',
//   countryName: 'Norway',
//   regionName: 'Innlandet',
//   cityName: 'Lillehammer',
//   zoneName: 'Europe/Oslo',
//   abbreviation: 'CET',
//   gmtOffset: 3600,
//   dst: '0',
//   zoneStart: 1667091600,
//   zoneEnd: 1679792400,
//   nextAbbreviation: 'CEST',
//   timestamp: 1672329452,
//   formatted: '2022-12-29 15:57:32'
// }