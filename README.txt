Giggle is a very thin wrapper for the Google AJAX Search API. Use it like this:

var search = new Giggle();

search.q("ITP", function(results){
  console.log(results);
})