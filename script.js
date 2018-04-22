/**
 * Created by rsun on 12/12/2017.
 */
var //fileRead = new FileReader(),  //use XMLHTTPRequest() instead
    articles,
    str = [],
    cmtArray = [],
    articleList,
    i, title, fileText, pageBar, comment, comments, pageNo;

const   //lineLimit = 3,  //line based
        charLimit = 1000,  //character based
        displayArticleHTML = 'DisplayArticle.html',
        updateVisitCntFile = 'updatevisitcnt.php',
        activePages = 10,
        configFiles = ['.\\contents\\travel\\TravelConfig.json', '.\\contents\\wanglian\\WangLianConfig.json'],
        photoConfig = '.\\photo\\PhotoConfig.json',
        feedback = '.\\contents\\contact\\feedback.txt';


window.onload = function(){
    var pageName;
										
    if (document.title === '《予之网》是一个生活类平台，希望与同好网友在此探讨生活中的幸会或遭遇， 人生的喜怒哀乐的机缘，相互安慰和帮助，取长补短，与之为乐，予人为善。') {
        getDate();

        if (!window.sessionStorage.getItem('Visited')) {
            window.sessionStorage.setItem('Visited', 1);
            updateVisitorCnt(0);
        } else {
            updateVisitorCnt(1);
        }

        addWanglianLink();
		createPicList(photoConfig);
        
        return;
    }

    /*content page   */
    articleList = document.getElementById('article-list');

    if (articleList) {
        pageName = window.sessionStorage.getItem('PageName');

        switch (pageName) {
            case 'travel':
                articles =  configFiles[0];  //'.\\contents\\travel\\TravelConfig.json';
                break;
            case 'wanglian':
                articles = configFiles[1];  //'.\\contents\\wanglian\\WangLianConfig.json'
                break;
            default:
                articles = '';

        }

        addArticleList(articles);
        return;
    }

    /*Article Page*/
    fileText = document.getElementById('filetxt');
    pageNo = document.getElementById('pageno');

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

function getDate(){
    var date1,
        today = new Date(),
        centry = "",
        timestamp = document.getElementById('timestamp');

    if  (today.getFullYear()<2000 )
        centry = "19" ;

    date1 = centry + (today.getFullYear())  + "年" + (today.getMonth() + 1 ) + "月" + today.getDate() + "日  " ;

    timestamp.innerHTML = date1;
}

function updateVisitorCnt(visited){
    var visitCnt = document.getElementById('visitcnt');

    if (visited) {
        $.get('visitcnt.txt', function(txt){
            visitCnt.innerHTML = '访问人数:' + txt;
        })
    } else {
        $.ajax({
            type:"POST",
            url:updateVisitCntFile
        }).done(function(txt){
            visitCnt.innerHTML = '访问人数:' + txt;
        });
    }
}

function menuClick(evt) {
    window.sessionStorage.setItem('PageName',evt.target.getAttribute('value'));
}

function aClick(evt){
    window.sessionStorage.setItem('FileName',evt.target.getAttribute('value'));
    window.sessionStorage.setItem('CommentFile',evt.target.getAttribute('cmtfile'));
    window.sessionStorage.setItem('Title', evt.target.getAttribute('title'));
}

function addWanglianLink(){
    var wanglianConfig = configFiles[1],
        wanglianlink = document.getElementById('wanglianlink'),
        article;

    $.getJSON(wanglianConfig, function(articles) {
        for (var a in articles) {
            if (a) {
                article = document.createElement('a');
                article.setAttribute('class', 'bold');
                article.setAttribute('href', displayArticleHTML);
                article.setAttribute('value', articles[a].source);
                article.target = '_blank';
                article.addEventListener('click',aClick);
                article.innerHTML = articles[a].title;
                article.setAttribute('title',articles[a].title);
                article.setAttribute('cmtfile', articles[a].comment);
                wanglianlink.appendChild(article);
            }
            break;
        }
    })
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

function getList(config, callback){
    var listItem = [];

    $.getJSON(config, function(list){
        for (l in list) {
            if (new Date(list[l].pubdate) <= new Date()){
                listItem.push(list[l]);
            }
        }

        return callback(null, listItem);
    })
}


function addArticleList(articleConfig){
    var list,
        article,
        articles = [],
        dateby,
        summary,
        i = 0;

    articles = getList(articleConfig);

    if (articles.length > 0) {
        for (a in articles) {
            if (new Date(articles[a].pubdate) <= new Date()) {
                list = document.createElement('li');

                dateby = document.createElement('div');
                dateby.innerHTML = '(' + articles[a].pubdate + ' 作者 ' + articles[a].pubby + ')';
                dateby.setAttribute('class', 'small-date');

                article = document.createElement('a');
                article.setAttribute('class', 'article_title');
                article.setAttribute('href', displayArticleHTML);
                article.setAttribute('value', articles[a].source);
                article.target = '_blank';
                article.addEventListener('click', aClick);
                article.innerHTML = articles[a].title;
                article.setAttribute('title', articles[a].title);
                article.setAttribute('cmtfile', articles[a].comment);

                article.appendChild(dateby);

                summary = document.createElement('p');
                summary.setAttribute('class', 'article_summary');
                summary.innerHTML = articles[a].summary;

                //article.appendChild(cmt);
                list.appendChild(article);
                list.appendChild(summary);
                articleList.appendChild(list);
            }
        }
    }
    /*$.getJSON(articleConfig, function(articles){
        for (a in articles) {
            if (new Date(articles[a].pubdate) <= new Date()) {
                list = document.createElement('li');

                dateby = document.createElement('div');
                dateby.innerHTML = '(' + articles[a].pubdate + ' 作者 ' + articles[a].pubby + ')';
                dateby.setAttribute('class', 'small-date');

                article = document.createElement('a');
                article.setAttribute('class', 'article_title');
                article.setAttribute('href', displayArticleHTML);
                article.setAttribute('value', articles[a].source);
                article.target = '_blank';
                article.addEventListener('click', aClick);
                article.innerHTML = articles[a].title;
                article.setAttribute('title', articles[a].title);
                article.setAttribute('cmtfile', articles[a].comment);

                article.appendChild(dateby);

                summary = document.createElement('p');
                summary.setAttribute('class', 'article_summary');
                summary.innerHTML = articles[a].summary;

                //article.appendChild(cmt);
                list.appendChild(article);
                list.appendChild(summary);
                articleList.appendChild(list);
            }
        }
    })*/
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
        addPrev10Btn();
        for (i = 1; i <= len; i++) {

            displaytxt += splitStr[i-1] + linebrk;
            if  (displaytxt.length >= charLimit) { //(i % lineLimit === 0) {
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
        addNext10Btn();

        if (str) {
            var btns = pageBar.getElementsByTagName('button');
            fileText.innerHTML = str[1];
            pageNo.innerHTML = 'Page: 1/' + (btns.length - 3).toString();
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
    var btns = document.getElementById('page-bar').getElementsByTagName('button'),
        len = btns.length - 3;  //minus three btns, prev10, next and next10

    fileText.innerHTML = str[btn.target.value];
    pageNo.innerHTML = 'Page: ' + btn.target.value + '/' + len;
    resetBtnColor();
    btn.target.style.color = 'white';
    btn.target.style.background = 'black';
    window.scrollTo(0,0);
}

function resetBtnColor(){
    var btns = document.getElementById('page-bar').getElementsByTagName('button'),
        len = btns.length;

    for (var i = 1; i < len; i++ ){  //a highlighted btn can be an active or inactive btn, because uses can click Previous or Next
        if (btns[i].style.color) {
            btns[i].removeAttribute('style');
        }
    }
}

function addPrev10Btn() {
    var btn = document.createElement('button');

    btn.innerHTML = '前 ' + activePages + '&#x2190;';
    btn.value = 'p10';
    btn.setAttribute('class', 'pagebar');
    btn.addEventListener('click', PrevNextBtnsClick);
    pageBar.appendChild(btn);
}

function addNextBtn() {
    var btn = document.createElement('button');

    btn.innerHTML = '下一页';
    btn.value = 'n';
    btn.setAttribute('class', 'pagebar');
    btn.addEventListener('click', PrevNextBtnsClick);
    pageBar.appendChild(btn);
}

function addNext10Btn() {
    var btn = document.createElement('button');

    btn.innerHTML = '&#x2192;后 ' + activePages;
    btn.value = 'n10';
    btn.setAttribute('class', 'pagebar');
    btn.addEventListener('click', PrevNextBtnsClick);
    pageBar.appendChild(btn);
}

function PrevNextBtnsClick(){
    var pageBtns = pageBar.getElementsByTagName('button'),
        len = pageBtns.length - 3,   //no prev and next btns
        startActive = 0,
        pn = this.getAttribute('value'),
        i;
    if (len > 0) {
        if (pn === 'p10') {  //prev 10 btn
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
        } else if (pn ==='n10') {   //next 10 btn
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
        } else {
            for (i = 1; i < len; i++ ){
                if (pageBtns[i].style.color && i < len){
                    pageBtns[i].removeAttribute('style');
                    pageBtns[i + 1].style.color = 'white';
                    pageBtns[i + 1].style.background = 'black';
                    fileText.innerHTML = str[i+1];
                    pageNo.innerHTML = 'Page: ' + (i+1).toString() + '/' + len.toString();
                    getNextNoPages(pageBtns, i + 1);
                    break;
                }
            }
        }
    }

    window.scrollTo(0,0);
}

function getNextNoPages(pageBtns, activePos){
    var startActive,
        len = pageBtns.length -3,
        midPos = Math.ceil(activePages/2);

    for (var i = 1; i <= len; i++){
        if (!pageBtns[i].getAttribute('hidden') && activePos - midPos > i && i + activePages - 1 < len){
            startActive = i;
            pageBtns[i].setAttribute('hidden', true);
        } else if (startActive) {
            for (var k = startActive + 1; k <= startActive + activePages; k++){
                if (pageBtns){
                    pageBtns[k].removeAttribute('hidden');
                }
            }
            break;
        } else if (i == activePos && !startActive){
            startActive = activePos -midPos <= 1?1:activePos -midPos;
            for (var k = startActive; k <= len; k++) {
                if (k < startActive + activePages) {
                    pageBtns[k].removeAttribute('hidden');
                } else if (!pageBtns[k].getAttribute('hidden')) {
                    pageBtns[k].setAttribute('hidden', true);
                }
            }
            break;
        }
    }
}

function createPicList(config){
    var picList = document.getElementById('piclist'),
        num = 0,
        pathname, li, image, lis, len, a, di;

    if (!picList) {
        return;
    }

    /*rs: 20180420 forbidden error 403 in heroku
    $.ajax({
        url:folder,
        success: function(data){            
            var hrefs = $(data).find('[HREF]'),
                len = hrefs.length;

            for (href in hrefs){
                pathname = hrefs[href].pathname;
                if (pathname && /\.jpg|\.png/i.test(pathname)) {
                    li = document.createElement('li');
                    li.style.listStyle = 'none';
                    li.style.display = 'none';
                    image = document.createElement('img');
                    image.src = '.' + pathname;
                    image.width = 270;
                    image.height = 200;
                    li.appendChild(image);
                    picList.appendChild(li);
                    num++;
                }
            }

            if (num) {
                lis = picList.getElementsByTagName('li');
				len = lis.length;
                num = 0;
                setInterval(function(){
                    lis[num].style.display="none";
                    num=++num >= len?0:num;
                    lis[num].style.display="inline-block";
                },3000);//切换时间
            }
        }
    })*/

    //var files, //= ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg'],
    //    a, di;

    var callback = function(err, files) {

        if (err) {
            alert(err.message);
            return;
        }

        files.forEach(function (file) {
            li = document.createElement('li');
            li.style.listStyle = 'none';
            li.style.display = 'none';

            di = document.createElement('div');
            di.setAttribute('class', 'center');

            image = document.createElement('img');
            image.src = file.source; //folder + "\\" + file;
            image.width = 270;
            image.height = 200;
            image.style.width = '100%';

            a = document.createElement('a');
            a.href = file.source;  //folder + "\\" + file;
            a.target = '_blank';
            a.innerHTML = '放大:' + file.title;

            di.appendChild(image);
            di.appendChild(a);
            li.appendChild(di);
            picList.appendChild(li);
        })

        lis = picList.getElementsByTagName('li');
        len = lis.length;
        num = 0;

        if (lis.length == 0) {
            return;
        }

        setInterval(function () {
            lis[num].style.display = "none";
            num = ++num >= len ? 0 : num;
            lis[num].style.display = "inline-block";
        }, 3000); //切换时间
    }

    getList(config, callback);
}

function scanComment(){
    /*Comment Scan Page*/
    var type = document.getElementById('Type'),
        fromDate = document.getElementById('FromDate'),
        commentScan = document.getElementById('comment');

    if (!type.value) {
        alert('Please enter Type.');
        return;
    }

    if (!fromDate.value){
        alert('Please enter Scan From Date');
        return;
    }

    commentScan.innerHTML = '';

    if (type.value==='Comment') {
        cmtArray = [];
        configFiles.forEach(function(config){
           getCommentFiles(config, new Date(fromDate.value));
        })
    } else {
        getAllComments('Contact Feedback', feedback, new Date(fromDate.value));
    }
}

function getCommentFiles(configFile, dt) {
    $.getJSON(configFile, function(items){
        //console.log(items.comment);
        for (var item in items){
            getAllComments(items[item].title,items[item].comment, dt);
        }

    })
}

function getAllComments(title, cmtFile, begDT) {
    $.get(cmtFile, function(txt){
        var splitStr = [],
            str = '',
            len, dt;
        splitStr = txt.split(/\n|\s{2,}/);
        len = splitStr.length;

        for (var i = 0; i < len; i++) {
            dt = new Date(splitStr[i].substr(0, 20));
            if (begDT <= dt) {
                insertCMT(title, cmtFile, str);
                str = splitStr[i];
            } else if  (dt == 'Invalid Date') {
                str += splitStr[i];
            } else {
                insertCMT(title, cmtFile,str);
                str = '';
                break;
            }
        }

        insertCMT(title, cmtFile, str);
        console.log(cmtArray);

    })
}

function insertCMT(title, cmtFile, str){
    var commentScan = document.getElementById('comment');

    if (str) {
        cmtArray.push(title + '-' + cmtFile + ':  ' + str);
        commentScan.innerHTML += title + '-' + cmtFile + ':  ' + str
    }
}

function addFeedback() {
    var fb = document.getElementById('fb'),
        feedback = document.getElementById('feedback');

    feedback.innerHTML += feedback.innerHTML?'<hr>':'' + '<p>' + fb.value + '</p>';

}

function excludeWordFromName () {
    var name = document.getElementById('name'),
        w = /厚君|力予/

    if (w.test(name.value)) {
        alert('你的名字包括非法字.');
        name.value = '';
    }
}