var Giggle = (function(){
  return {
  GResult : function(resultData){
    this.title = resultData.title;
    this.url = resultData.unescapedUrl;
    this.domain = resultData.visibleUrl;
  },
  
  results : [],
  expectedPages : 0,
  moreResultsUrl : null,
  processSearchResultsPage : function(data){
    this.googleUrl = data.responseData.cursor.moreResultsUrl;
    for (i = 0; i < data.responseData.results.length; i++){
      this.results.push(new this.GResult(data.responseData.results[i]));          
    }
  },
  
  q : function(query, locals, callback){
    this.queryGoogle(query, 0, locals, callback)
  },
  
  queryGoogle : function(q, p, locals, callback){
      var currentPage = p;
      var rootUrl = "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&start="+p+"&q=";
      var t = this;
      $.getJSON(rootUrl + q + "&callback=?",function(data){
        if(data.responseData){
          t.expectedPages = Math.ceil(data.responseData.cursor.estimatedResultCount / 4);
          t.processSearchResultsPage(data);
        } else {
          t.reachedMax = true;
          callback(t.results, locals);
          t.reachedMax = false;
          
          // reset
          t.results = [];
          t.expectedPages = 0;
          return false;
        }
        
        if(currentPage + 1 < t.expectedPages){
          t.queryGoogle(q, (currentPage + 1), locals, callback);
        }
        else{
          callback(t.results, locals);
          // reset
          t.results = [];
          t.expectedPages = 0;
        }
        return false;
      });
      return false;
    }
  }
})