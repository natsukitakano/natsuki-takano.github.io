//
// main.js
//

// スクロール矢印
// 将来的に
// TODO: Vue.js で遊びを入れたい
// TODO: 右画面にも

// new Vue({
//     el: '#works',
//     data: {
//     }
// })


  // モバイルブラウザかどうか判定
  const isMobile = !!new MobileDetect(window.navigator.userAgent).mobile();

  // CSSのブレークポイントと一致させる
  const maxWidthForMobile = 768;
  let isMobileWidth = (width) => (width <= maxWidthForMobile);

  
  /**
   * DOM 操作用
   */
  
  // メニューを元に戻すための位置参照用
  let originalPositionOfNavmenu = document.querySelector(`#original-position`);
  // ナビバー
  const navMenu = document.querySelector('#navmenu');
  const navList = navMenu.querySelector('.nav-list');
  // 各articleの位置参照用
  const articles = document.querySelectorAll('.article');

  // 出来ること
  const works = document.querySelectorAll('.work__category');

  // 構想中
  const nexts = document.querySelectorAll('.next');


  /**
   * nav のリンクをクリックしたときジャンプせずに、スクロールをする
   */
  navList.addEventListener( 'click', (e) => {
    e.preventDefault();

    const adjust = isMobileWidth(window.innerWidth) ? navMenu.offsetHeight : 0

    const articleId = e.target.dataset.link;
    const scrollTo = Array.from(articles).find(article => article.id == articleId).offsetTop - adjust;

    window.scrollTo( {
      top: scrollTo,
      behavior: "smooth",
    } );
  });

  /**
   * navlinkの制御
   */
  let isMenuAtOriginalPosition = true;
  function toggleMenuPosition(){
    if (!isMobileWidth(window.innerWidth)) return;

    // 現在の画面上部位置がメニューのオリジナル位置よりも下だったら、
    // リストのpositionをfixedにしてtopを0にする。
    if (window.scrollY > originalPositionOfNavmenu.offsetTop) {
      if (isMenuAtOriginalPosition) {
        navMenu.classList.add('fixed-navmenu');
        isMenuAtOriginalPosition = false;
      }
    } else {
      if (!isMenuAtOriginalPosition) {
        navMenu.classList.remove('fixed-navmenu');
        isMenuAtOriginalPosition = true;
      }
    }

  }

  /**
   * スクロール位置によってnavlinkの色を変える
   */
  let lastArticleId;
  function switchNavlinkColor(){
    let viewingArticleId = "";
    const screenCenter = window.scrollY + window.innerHeight / 2;
    articles.forEach( (article) => {
      // articleの位置がスクリーン中央よりも上にあったら（座標が小さかったら）
      if ( article.offsetTop < screenCenter ){
        viewingArticleId = article.id;
      }
    });
    
    if (viewingArticleId == lastArticleId) return;
    navMenu.querySelectorAll('a').forEach( anchor => anchor.classList.remove('current-position'));
    navMenu.querySelector(`a[href="#${viewingArticleId}"]`).classList.add('current-position');
    lastArticleId = viewingArticleId;
  }

  /**
   * スクロール位置によって矢印の向きを変える
   */
  function toggleArrow(){
    if (!isMobileWidth(window.innerWidth)) return;

    articles.forEach( article => {
      const isAbove = article.offsetTop < window.scrollY;
      const li = navMenu.querySelector(`a[href="#${article.id}"]`).parentElement;
      const hasClassAbove = li.classList.contains('article-above');
      // articleの位置がスクリーン上部よりも上にあったら（座標が小さかったら）
      if ( isAbove && !hasClassAbove ){
        li.classList.add('article-above');
      } else if ( !isAbove && hasClassAbove ){
        li.classList.remove('article-above');
      }
    });
  }


  function showNexts(){
    const positionToShow = window.scrollY + window.innerHeight * 0.7;
    nexts.forEach( next =>  {
      if (!next.classList.contains('next--waiting-to-showup')) return;
      // articleの位置がスクリーン中央よりも上にあったら（座標が小さかったら）
      if ( next.offsetTop < positionToShow ){
        next.classList.remove('next--waiting-to-showup');
      }
    });
  }

  function debounce(func, wait = 20) {
    var timeout; // setTimeout の制御用変数 

    return function() {
      clearTimeout(timeout);
      timeout = setTimeout( func, wait );
    }
  }

  function scrollFunctions() {
    toggleMenuPosition();
    toggleArrow();
    switchNavlinkColor();
    showNexts();
  }
  
  /**
   * ロードとスクロールの監視
   */
  window.addEventListener('load', scrollFunctions);
  window.addEventListener('scroll', debounce(scrollFunctions, 10));

  /**
   * 途中で画面幅がPC <--> SPで切り替えられた場合、それぞれに合わせてリセット
   */
  let wasMobile = isMobileWidth(window.innerWidth);

  function switchScreen() {
    const isMobile = isMobileWidth(window.innerWidth);
    const isSame = ( isMobile ==  wasMobile);
  
    if(isSame) return;

    if (isMobile){
      // CSSのmedia切り替え処理が行われているのでnavlinkのオリジナル位置を正す
//            originalPositionOfNavmenu = $(`#original-position`).position().top;
    } else {
      // SP表示時にスクロール位置によってメニューの色・contact表示を変えているのでPC用に直す
      navMenu.classList.remove('fixed-navmenu');
      isMenuAtOriginalPosition = true;

      // WorksがSP表示時に折りたたまれていたら表示する
      works.forEach( work => work.classList.add('opened'));
    }
    wasMobile = isMobileWidth(window.innerWidth);
  }

  /**
   * 画面リサイズ監視
   */
  window.addEventListener('resize', () => {
    switchScreen();
  });

  /**
   * SP表示時のWorks 詳細窓表示切り替え関係
   */
  works.forEach( work => work.addEventListener('click', (e) => {
    e.preventDefault();

    if (!isMobileWidth(window.innerWidth)) return;

    const work = e.target.parentElement;
    if ( work.classList.contains('opened') ) {
      work.classList.remove('opened');
    } else {
      work.classList.add('opened');
    }

  }) );

