//
// main.js
//

// スクロール矢印
// 将来的に
// TODO: Vue.js で遊びを入れたい
// TODO: 右画面にも
// TODO: 768の境目がWorksおかしい。

$(function(){

    // モバイルブラウザかどうか判定
    const isMobile = !!new MobileDetect(window.navigator.userAgent).mobile();

    // CSSのブレークポイントと一致させる
    const maxWidthForMobile = 768;
    let isMobileWidth = (width) => (width <= maxWidthForMobile);

    // メニューを元に戻すため、ロード時の位置を覚える
    // TODO: PC幅で覚えてスクロール途中でSP幅に切り替えられると場所が変わってしまう。
    let originalPositionOfNavmenu = $(`#navmenu`).position().top;

    /**
     * nav のリンクをクリックしたときに、同じページであることが分かるように、スクロールをする
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
        if ($(window).scrollTop() > originalPositionOfNavmenu) {
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
        $('article').each( function() {
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

        $('article').each( function() {
            const isAbove = $(this).position().top < $(window).scrollTop();
            const togglingArrow = $(this).attr('id');
            const hasClassAbove = $(`#navmenu a[href="#${togglingArrow}"]`).parent('li').hasClass('article-above');
            // articleの位置がスクリーン上部よりも上にあったら（座標が小さかったら）
            if ( isAbove && !hasClassAbove ){
                $(`#navmenu a[href="#${togglingArrow}"]`).parent('li').addClass('article-above');
            } else if ( !isAbove && hasClassAbove ){
                $(`#navmenu a[href="#${togglingArrow}"]`).parent('li').removeClass('article-above');
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
            originalPositionOfNavmenu = $(`#navmenu`).position().top;
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
