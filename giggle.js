Giggle = {};

Giggle = {
  GResult : function(resultData){
    this.title = resultData.title;
    this.url = resultData.unescapedUrl;
    this.domain = resultData.visibleUrl;
  },
  
  results : [],
  expectedPages : 0,
  moreResultsUrl : null,
  processSearchResultsPage : function(data){
    Giggle.googleUrl = data.responseData.cursor.moreResultsUrl;
    for (i = 0; i < data.responseData.results.length; i++){
      Giggle.results.push(new Giggle.GResult(data.responseData.results[i]));          
    }
  },
  
  q : function(query, callback){
    Giggle.queryGoogle(query, 0, callback)
  },
  
  queryGoogle : function(q, p, callback){
      var currentPage = p;
      var rootUrl = "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&start="+p+"&q=";
      $.getJSON(rootUrl + q + "&callback=?",function(data){
        if(data.responseData){
          Giggle.expectedPages = Math.ceil(data.responseData.cursor.estimatedResultCount / 4);
          Giggle.processSearchResultsPage(data);
        } else {
          Giggle.reachedMax = true;
          callback(Giggle.results);
          Giggle.reachedMax = false;
          
          // reset
          Giggle.results = [];
          Giggle.expectedPages = 0;
          return false;
        }
        
        if(currentPage + 1 < Giggle.expectedPages){
          Giggle.queryGoogle(q, (currentPage + 1), callback);
        }
        else{
          callback(Giggle.results);
          // reset
          Giggle.results = [];
          Giggle.expectedPages = 0;
        }
        return false;
      });
      return false;
    }
  
}