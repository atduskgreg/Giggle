Giggle is a very thin wrapper for the Google AJAX Search API. Use it like this:

var search = new Giggle();

search.q("ITP", {title: "ITP"}, function(results, locals){
  console.log(locals.title);
  console.log(results);
})

The second argument is an object for passing local variables into the callback function.