/**
 * Created by rsun on 12/12/2017.
 */
var //fileRead = new FileReader(),  //use XMLHTTPRequest() instead
    articles,
    str = [],
    articleList,
    i, title, fileText, pageBar, comment, comments, articleConfig;

const   lineLimit = 3,  //line based
        displayArticleHTML = 'DisplayArticle.html',
        updateVisitCntFile = 'updatevisitcnt.php',
        activePages = 10;


window.onload = function(){
    var pageName;

    if (document.title === '首页') {
        updateVisitorCnt();
        runLunbo();
        return;
    }
    /*content page   */
    articleList = document.getElementById('article-list');

    if (articleList) {
        pageName = window.sessionStorage.getItem('PageName');

        switch (pageName) {
            case 'travel':
                articles = '.\\contents\\travel\\TravelConfig.json';
                break;
            case 'wanglian':
                articles = '.\\contents\\wanglian\\WangLianConfig.json'
                break;
            default:
                articles = '';

        }

        addArticleList(articles);
        return;
    }

    /*Article Page*/
    fileText = document.getElementById('filetxt');

    if (fileText) {
        var fileName = window.sessionStorage.getItem('FileName'),
            cmtFile = window.sessionStorage.getItem('CommentFile'),
            fileTitle = window.sessionStorage.getItem('Title');

        pageBar = document.getElementById('page-bar');
        comment = document.getElementById('comment');
        comments = document.getElementById('comments'),
        title = document.getElementById('title');

        $.ajaxSetup({cache:false});
        loadFile(fileName, fileTitle);
        loadComments(cmtFile);
        return;
    }
}

function updateVisitorCnt(){
    var cnt,
        visitCnt = document.getElementById('visitcnt');

    $.ajax({
        type:"POST",
        url:updateVisitCntFile
    })
        .done(function(txt){
            cnt = parseInt(txt) + 1;
            visitCnt.value = cnt.toFixed(0);
        });
}

function runLunbo(){
    var li=document.getElementById('lunbo').getElementsByTagName("li");
    var num=0;
    var len=li.length;

    setInterval(function(){
        li[num].style.display="none";
        num=++num==len?0:num;
        li[num].style.display="inline-block";

    },3000);//切换时间
}

function menuClick(evt) {
    window.sessionStorage.setItem('PageName',evt.target.getAttribute('value'));
}

function aClick(evt){
    window.sessionStorage.setItem('FileName',evt.target.getAttribute('value'));
    window.sessionStorage.setItem('CommentFile',evt.target.getAttribute('cmtfile'));
    window.sessionStorage.setItem('Title', evt.target.getAttribute('title'));
}

function loadFile(file,fileTitle) {
    $.get(file, function(txt){
        splitText(txt, fileTitle);
    })
}

function loadComments(file){
    var commentFile = document.getElementById('commentfile');

    if (commentFile) {
        commentFile.value = file;
    }

    $.get(file, function(txt){
        comments.innerHTML = txt;
    })
}

function addComment(txt){
    var cmtFileName = window.sessionStorage('CommentFile');

    if (!txt) {
        alert('Nothing is added!');
        return;
    }
}

function addArticleList(articleConfig){
    var list,
        article,
        summary,
        i = 0;

    $.getJSON(articleConfig, function(articles){
        for (a in articles) {
            list = document.createElement('li');

            article = document.createElement('a');
            article.setAttribute('class', 'article_title');
            article.setAttribute('href', displayArticleHTML);
            article.setAttribute('value', articles[a].source);
            article.target = '_blank';
            article.addEventListener('click',aClick);
            article.innerHTML = articles[a].title;
            article.setAttribute('title',articles[a].title);
            article.setAttribute('cmtfile', articles[a].comment);

            summary = document.createElement('p');
            summary.setAttribute('class','article_summary');
            summary.innerHTML = articles[a].summary;

            //article.appendChild(cmt);
            list.appendChild(article);
            list.appendChild(summary);
            articleList.appendChild(list);
        }
    })
}

function splitText (txt, fileTitle) {
    var len, i, displaytxt, page, splitStr = [], linebrk,
        btn = [];
    str = [];

    title.innerHTML = fileTitle;

    /*line based                 */
    splitStr = txt.split(/\n|\s{2,}/);  //line return + at least 2 spaces.
    len = splitStr.length;
    page = 1;
    displaytxt = '';
    linebrk = '<br /><br />'


    if (len) {
        addPrevBtn();
        for (i = 1; i <= len; i++) {

            displaytxt += splitStr[i-1] + linebrk;
            if (i % lineLimit === 0) {
                str[page] = displaytxt;
                addPageNoBtn(page, page <= activePages);
                page++;
                displaytxt = '';
            }
        }

        if (displaytxt.trim() != linebrk && displaytxt.trim() != '') {
            str[page] = displaytxt;
            addPageNoBtn(page, page <= activePages);
        }

        addNextBtn();
        if (str) {
            var btns = document.getElementsByTagName('button');

            fileText.innerHTML = str[1];
            btns[1].style.color = 'white';
            btns[1].style.background = 'black';
        }
    }
}

function addPageNoBtn(page,active){
    var btn = document.createElement('button','pagebar');

    btn.innerHTML = page.toString();
    btn.value = page;
    if (!active){
        btn.setAttribute('hidden', true);
    }
    btn.addEventListener('click', assignFileText);
    pageBar.appendChild(btn);
}

function assignFileText(btn) {
    fileText.innerHTML = str[btn.target.value];
    resetBtnColor();
    btn.target.style.color = 'white';
    btn.target.style.background = 'black';
}

function resetBtnColor(){
    var btns = document.getElementById('page-bar').getElementsByTagName('button'),
        len = btns.length;

    for (var i = 1; i < len; i++ ){  //a highlighted btn can be an active or inactive btn, because uses can click Previous or Next
        if (btns[i].style.color) {
            btns[i].style.color = '';
            btns[i].style.background = '';
        }
    }
}

function addPrevBtn() {
    var btn = document.createElement('button');

    btn.innerHTML = 'Previous ' + activePages + '&#x2190;';
    btn.value = 'p';
    btn.setAttribute('class', 'pagebar');
    btn.addEventListener('click', PrevNextBtnsClick);
    pageBar.appendChild(btn);
}

function addNextBtn() {
    var btn = document.createElement('button');

    btn.innerHTML = '&#x2192;Next ' + activePages;
    btn.value = 'n';
    btn.setAttribute('class', 'pagebar');
    btn.addEventListener('click', PrevNextBtnsClick);
    pageBar.appendChild(btn);
}

function PrevNextBtnsClick(){
    var pageBtns = pageBar.getElementsByTagName('button'),
        len = pageBtns.length - 2,   //no prev and next btns
        startActive = 0,
        pn = this.getAttribute('value'),
        i;
    if (len > 0) {
        if (pn === 'p') {  //prev 10 btn
            for (i = 1; i <= len; i++){  //btn[0] is previous 10
                if (!pageBtns[i].getAttribute('hidden')){
                    if (!startActive) {
                        startActive = i;
                    }

                    if (i - activePages > 0){
                        pageBtns[i].setAttribute('hidden',true);
                    }

                    if (i >= startActive + activePages - 1){
                        var beg = startActive > activePages?startActive - activePages:1;
                        for (var k = beg; k < startActive; k++){
                            pageBtns[k].removeAttribute('hidden');
                        }
                        break;
                    }
                }
            }
        } else {   //next 10 btn
            for (i = 1; i <= len; i++){
                if (!pageBtns[i].getAttribute('hidden') && i + activePages - 1 < len){
                    startActive = i;
                    pageBtns[i].setAttribute('hidden', true);
                } else if (startActive) {
                    for (var k = startActive + 1; k <= startActive + activePages; k++){
                        if (pageBtns){
                            pageBtns[k].removeAttribute('hidden');
                        }
                    }
                    break;
                }

            }
        }
    }
}