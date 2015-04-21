// Opret nyt hul
var hole = {
	courtid: "2D8A944F-4F02-45BF-8406-986A516B98FD", // rold
	par: 4,
	key: 18,
	number: 10
};
client.getTable("holes").insert(hole).done(function (response) {
	console.log(response);
});