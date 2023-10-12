const url = 'https://india-pincode-with-latitude-and-longitude.p.rapidapi.com/api/v1/pincode/132041';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'bd4331292bmsh431098282458a06p11b367jsn8ed7421342f3',
		'X-RapidAPI-Host': 'india-pincode-with-latitude-and-longitude.p.rapidapi.com'
	}
};
async function a(){
    try {
    const response = await fetch(url, options);
    const result = await response.text();
    JSON.parse(result).forEach(element => {
        console.log(element.area);
    })
} catch (error) {
    console.error(error);
}}

a()

// #include<bits/stdc++.h>
// using namespace std;
// int main(){
    
//     return 0;
// }