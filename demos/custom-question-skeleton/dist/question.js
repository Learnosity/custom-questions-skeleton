(()=>{"use strict";function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}var t=function(){function t(e,n){var i,r,a=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),this.init=e,this.events=e.events,this.lrnUtils=n,this.el=e.$el.get(0),this.runResult=null===(i=e.response)||void 0===i?void 0:i.runResult,this.latestCode=null===(r=e.response)||void 0===r?void 0:r.latestCode,this.render().then((function(){a.handleEvents(),"initial"===e.state||("resume"===e.state?a.latestCode&&a.editor&&a.editor.setFileContents(a.latestCode.files):"review"===e.state&&(a.editor&&(a.latestCode&&a.editor.setFileContents(a.latestCode.files),a.runResult&&a.editor.setRunResult(a.runResult)),e.getFacade().disable()))})).catch((function(e){console.error("Embed failed to load:",e)})).finally((function(){a.events.trigger("ready")}))}var n,i;return n=t,(i=[{key:"render",value:function(){var e,t,n=this,i=this.init.question,r=i.challengeId,a=i.language,o=this.init.getCustomWidgetOptions("embedClientKey")||this.init.question.embedClientKey,s="//www.qualified.io/embed.js",l=function(e){return n.el.innerHTML='<div class="alert alert-warning" role="alert">'.concat(e,"</div>"),Promise.resolve()};if(null==o||!o.trim())return l("Configuration issue: Missing embedClientKey");if(null==r||!r.trim())return l("Please provide a Qualified Challenge ID (from the challenge's URL)");if(null==a||!a.trim())return l("Please provide a language");var d=new Promise((function(n,i){e=n,t=i})),u=this,c=!0,v=setTimeout((function(){t("Embed failed to load in 8 seconds")}),8e3),f={options:{language:a,embedClientKey:o,mode:"review"===this.init.state?"readonly":null,disableBottomTabs:!0,hideTabs:[]},onLoaded:function(t){t.manager,t.editor,t.challengeId,t.data,clearTimeout(v),e()},onChange:function(e){e.manager,e.editor,e.challengeId;var t=e.data;c?c=!1:(u.latestCode=t,u.saveToLearnosity())},onRun:function(e){e.manager,e.editor,e.challengeId;var t=e.data;"attempt"===t.type&&(u.runResult=t,u.saveToLearnosity())}};if(window.QualifiedEmbed)return this.createEmbedEditor(f,r),d;var h=document.querySelector('script[src="'.concat(s,'"]'));if(h)h.addEventListener("load",(function(){n.createEmbedEditor(f,r)}));else{var m=document.createElement("script");m.addEventListener("load",(function(){n.createEmbedEditor(f,r)})),m.src=s,document.body.append(m)}return d}},{key:"createEmbedEditor",value:function(e,t){this.el.innerHTML='\n      <div class="'.concat("lrn-custom-question",' lrn-response-validation-wrapper">\n        <div class="lrn_response_input">\n          <div class="qualified-embed"></div>\n        </div>\n      </div>');var n=window.QualifiedEmbed.init(e),i=this.el.querySelector(".qualified-embed");this.editor=n.createEditor({node:i,challengeId:t})}},{key:"saveToLearnosity",value:function(){this.events.trigger("changed",{runResult:this.runResult,latestCode:this.latestCode})}},{key:"updateValidationUI",value:function(){var e=this.init.getFacade().getScore(),t=this.el.querySelector(".lrn_response_input");t.classList.remove("lrn_incorrect","lrn_correct"),t.classList.add(e.score<e.max_score?"lrn_incorrect":"lrn_correct")}},{key:"handleEvents",value:function(){var e=this;this.events.on("validate",(function(t){"review"!==e.init.state&&e.updateValidationUI()}))}}])&&e(n.prototype,i),t}();LearnosityAmd.define([],(function(){return{Question:t}}))})();