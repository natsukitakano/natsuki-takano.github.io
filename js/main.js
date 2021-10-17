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

$(function(){

    // モバイルブラウザかどうか判定
    const isMobile = !!new MobileDetect(window.navigator.userAgent).mobile();

    // CSSのブレークポイントと一致させる
    const maxWidthForMobile = 768;
    let isMobileWidth = (width) => (width <= maxWidthForMobile);

    // メニューを元に戻すための位置参照用
    let originalPositionOfNavmenu = $(`#original-position`);

    // 各articleの位置参照用
    const articles = $('article');

    /**
     * nav のリンクをクリックしたときジャンプせずに、スクロールをする
     */
    $('.nav-list').on('click', (e) => {
        const destination = $(e.target).attr('href');
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $(destination).offset().top - 30,
            },
            400,
        );
    });

    /**
     * navlinkの制御
     */
    let isMenuAtOriginalPosition = true;
    function toggleMenuPosition(){
        if (!isMobileWidth($(window).innerWidth())) return;

        // 現在の画面上部位置がメニューのオリジナル位置よりも下だったら、
        // 1. リストのpositionをfixedにしてtopを0にする。
        // 2. Contactをメニューに加える
        if ($(window).scrollTop() > originalPositionOfNavmenu.position().top) {
            if (isMenuAtOriginalPosition) {
                $('#navmenu').addClass('fixed-navmenu');
                $('#navmenu li:first-child').show(100);
                isMenuAtOriginalPosition = false;
            }
        } else {
            if (!isMenuAtOriginalPosition) {
                $('#navmenu').removeClass('fixed-navmenu');
                $('#navmenu li:first-child').hide(100);
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
        const screenCenter = $(window).scrollTop() + $(window).innerHeight() / 2;
        articles.each( function() {
            // articleの位置がスクリーン中央よりも上にあったら（座標が小さかったら）
            if ( $(this).position().top < screenCenter ){
                viewingArticleId = $(this).attr('id');
            }
        });

        if (viewingArticleId == lastArticleId) return;

        $('#navmenu a').removeClass('current-position');
        $(`#navmenu a[href="#${viewingArticleId}"]`).addClass('current-position');
        lastArticleId = viewingArticleId;
    }

    /**
     * スクロール位置によって矢印の向きを変える
     */
    function toggleArrow(){
        if (!isMobileWidth($(window).innerWidth())) return;

        articles.each( function() {
            const isAbove = $(this).position().top < $(window).scrollTop();
            const togglingArrow = $(this).attr('id');
            const parent_li = $(`#navmenu a[href="#${togglingArrow}"]`).parent('li');
            const hasClassAbove = parent_li.hasClass('article-above');
            // articleの位置がスクリーン上部よりも上にあったら（座標が小さかったら）
            if ( isAbove && !hasClassAbove ){
                parent_li.addClass('article-above');
            } else if ( !isAbove && hasClassAbove ){
                parent_li.removeClass('article-above');
            }
        });
    }


    let isNextShown = [];
    const nexts = $('.next');
    function showNexts(){
        const positionToShow = $(window).scrollTop() + $(window).innerHeight() * 0.7;
        nexts.each( function( index ) {
            if (isNextShown[index]) return;
            // articleの位置がスクリーン中央よりも上にあったら（座標が小さかったら）
            if ( $(this).position().top < positionToShow ){
                $(this).removeClass('next--waiting-to-showup');
                isNextShown[index] = true;
            }
        });
    }

    /**
     * ロードとスクロールの監視
     */
    $(window).on('load scroll', () => {

        toggleMenuPosition();
        toggleArrow();

        switchNavlinkColor();

        showNexts();
    });

    /**
     * 途中で画面幅がPC <--> SPで切り替えられた場合、それぞれに合わせてリセット
     */
    let wasMobile = isMobileWidth($(window).innerWidth());
    function switchScreen() {
        const isMobile = isMobileWidth($(window).innerWidth());
        const isSame = ( isMobile ==  wasMobile);
    
        if(isSame) return;

        if (isMobile){
            // CSSのmedia切り替え処理が行われているのでnavlinkのオリジナル位置を正す
//            originalPositionOfNavmenu = $(`#original-position`).position().top;
        }else{
            // SP表示時にスクロール位置によってメニューの色・contact表示を変えているのでPC用に直す
            $('#navmenu').removeClass('fixed-navmenu');
            $('#navmenu li:first-child').show();
            isMenuAtOriginalPosition = true;

            // WorksがSP表示時に折りたたまれていたら表示する
            $(`.work__details`).show();
        }
        wasMobile = isMobileWidth($(window).innerWidth());
    }

    /**
     * 画面リサイズ監視
     */
    $(window).on('resize', () => {
        switchScreen();
    });

    /**
     * SP表示時のWorks 詳細窓表示切り替え関係
     */
    $('.work__category').on('click', (e) => {
        e.preventDefault();
        if (!isMobileWidth($(window).innerWidth())) return;

        const workId = $(e.target).attr('id');
        $(`#${workId}__details`).slideToggle( 300 );
        $(e.target).toggleClass('is-details-opened');
    });

});
