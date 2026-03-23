const url = "https://widsnkgnldblofasxjtp.supabase.co/rest/v1/visits?select=*&limit=1";
const key = "sb_publishable_n5X8HKz_4QUupor8i68ERw_nbXV5o_0";

fetch(url, {
  headers: {
    "apikey": key,
    "Authorization": `Bearer ${key}`
  }
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(err => console.error(err));
