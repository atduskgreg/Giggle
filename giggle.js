GResult = function(resultData){
      this.title = resultData.title;
      this.url = resultData.unescapedUrl;
      this.domain = resultData.visibleUrl;
    }
    
Tmbl = {
  rblgs : function(tumblog){
    Tmbl.ggle.reblogQuery(tumblog, function(data){
      data.tumblog = tumblog;
      this.data = data;
      $("#waiting").remove();
      $.srender(Templates.reblog, data, $("#content"));

      return false;
    })
  },
  
  ggle : {
    results : [],
    expectedPages : 0,
    processSearchResultsPage : function(data){
      Tmbl.ggle.googleUrl = data.responseData.cursor.moreResultsUrl;
      for (i = 0; i < data.responseData.results.length; i++){
        Tmbl.ggle.results.push(new GResult(data.responseData.results[i]));          
      }
    },
    
    reblogQuery : function(tumblr, callback){
      $("#content").html('<div id="waiting">looking up rebloggings...</div>');
      var q = Tmbl.ggle.composeReblogQuery(tumblr);
      Tmbl.ggle.queryGoogle(q, 0, callback);
    },
    
    composeReblogQuery : function(tumblr){
      if(tumblr.match(/\./))
        return "site%3Atumblr.com+-site%3A"+tumblr+" "+tumblr;
      else
        return "site%3Atumblr.com+-site%3A"+tumblr+".tumblr.com+"+tumblr;
    },
    
    queryGoogle : function(q, p, callback){
      var currentPage = p;
      var rootUrl = "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&start="+p+"&q=";
      $.getJSON(rootUrl + q + "&callback=?",function(data){
        if(data.responseData){
          Tmbl.ggle.expectedPages = Math.ceil(data.responseData.cursor.estimatedResultCount / 4);
          Tmbl.ggle.processSearchResultsPage(data);
        } else {
          Tmbl.ggle.reachedMax = true;
          callback(Tmbl.ggle.results);
          Tmbl.ggle.reachedMax = false;
          
          // reset
          Tmbl.ggle.results = [];
          Tmbl.ggle.expectedPages = 0;
          return false;
        }
        
        if(currentPage + 1 < Tmbl.ggle.expectedPages){
          Tmbl.ggle.queryGoogle(q, (currentPage + 1), callback);
        }
        else{
          callback(Tmbl.ggle.results);
          // reset
          Tmbl.ggle.results = [];
          Tmbl.ggle.expectedPages = 0;
        }
        return false;
      });
      return false;
    }
  }
}