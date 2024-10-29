$(document).ready(function() {

    // 주문 목록의 총 금액 출력 제어 기능
    function checkOrderItems() {
        let allEmpty = true;  // 모든 .order_item이 비어 있는지 확인하는 플래그

        $('.order_item').each(function() {
            // 각 .order_item이 비어 있는지 확인
            if ($.trim($(this).html()) !== '') {
                allEmpty = false;  // 하나라도 비어있지 않다면 false로 설정
                return false;  // 루프 중지
            }
        });

        // 만약 모든 .order_item이 비어 있다면 총 금액 보이지 않게 설정
        if (allEmpty) {
            $('.total_text').addClass('display_none');
        }
    }

    // 총금액 더하기
    function totalPrice(){
        let total = 0;

        $('.price').each(function(){
            let price = parseInt($(this).text());
            total = total+=price;
        }); 

        $('.total_price').text(total);
    }

    // 카테고리 선택 기능
    $('.menu_btn').click(function() {

        var target = $(this).data('target');
        
        // 메뉴 버튼 클릭 시 버튼색 변경
        $('.menu_btn').not(this).find('h1').css('color', 'white');
        $(this).find('h1').css('color', '#843c0c');

        // 메뉴 버튼 클릭 시 세부 카테고리 변경
        $('.sub_menu').not($(target)).css('display', 'none');
        $(target).css('display', 'flex'); 

    });

    // 메뉴를 주문 목록에 담는 기능
    $('.menu_list').click(function() {

        // 총 금액 보이기
        $('.total_text').removeClass('display_none');

        // 만약 .goods 안의 내용 중 $(this).data('goods')가 없다면 안에 내용이 없는 .order_item에
        // '<span class="goods"></span><span class="price"></span><span class="won">원</span><span class="up_btn">▲</span><span class="count">1</span><span class="down_btn">▼</span>'의
        // html 태그를 생성하고 .goods 안에는 $(this).data('goods')을 넣고 .price 안에는 $(this).data('price')를 넣어라.
        // 그리고 .goods 안의 내용 중 $(this).data('goods')가 있다면 해당 형제 요소 중 .price의 내용에 $(this).data('price')만큼 더하고 해당 형제 요소 중 .count의 내용에 +1하라
        
        const selectedGoods = $(this).data('goods');
        const selectedPrice = $(this).data('price');
        let isGoodsFound = false;
    
        $('.order_item').each(function() {
            const currentGoods = $(this).find('.goods').text();
    
            if (currentGoods === selectedGoods) {
                // .goods 안에 내용이 해당 goods와 일치할 경우
                const price = $(this).find('.price');
                const count = $(this).find('.count');
    
                // 기존 가격에 새로운 가격을 더함
                const updatedPrice = parseInt(price.text()) + selectedPrice;
                price.text(updatedPrice);
    
                // count를 +1
                const updatedCount = parseInt(count.text()) + 1;
                count.text(updatedCount);
    
                isGoodsFound = true;
                return false; // 반복문 중지
            }
        });
    
        if (!isGoodsFound) {
            // 비어 있는 .order_item 요소를 찾음
            const emptyOrderItem = $('.order_item').filter(function() {
                return $(this).text() === '';
            }).first(); // 첫 번째 빈 요소만 선택
    
            if (emptyOrderItem.length > 0) {
                // 빈 .order_item이 있다면 해당 요소에 내용을 추가
                emptyOrderItem.html(`
                    <span class="goods">${selectedGoods}</span>
                    <span class="price" data-price="${selectedPrice}">${selectedPrice}</span>
                    <span class="won">원</span>
                    <button class="up_btn">▲</button>
                    <span class="count">1</span>
                    <button class="down_btn">▼</button>
                `);
            }
        }

        totalPrice();
    });

    // 나중에 동적으로 생성된 태그에 관한 이벤트라 이벤트 위임 방식을 사용

    // 수량 추가 버튼 클릭 이벤트
    $('.order_list').on('click', '.up_btn', function() {

        // 현재 값에 새로운 값을 더함
        const updatedPrice = parseInt($(this).siblings('.price').text()) + parseInt($(this).siblings('.price').data('price'));
        $(this).siblings('.price').text(updatedPrice); // 그 값을 출력
        
        // 수량 추가
        const uptatecnt = parseInt($(this).siblings('.count').text())+1;
        $(this).siblings('.count').text(uptatecnt);

        totalPrice();
    });

    // 수량 감소 버튼 클릭 이벤트
    $('.order_list').on('click', '.down_btn', function() {

        // 현재 값에 새로운 값을 뺌
        const updatedPrice = parseInt($(this).siblings('.price').text()) - parseInt($(this).siblings('.price').data('price'));
        const uptatecnt = parseInt($(this).siblings('.count').text())-1;
        
        // 값이 0이면 태그 삭제
        if(updatedPrice <= 0){

            // $(this).parent().empty();

            let orderItme = $(this).parent();
            
            // 리스트가 중간에 비는 문제를 해결
            orderItme.nextAll('.order_item').each(function() {
                // 바로 위의 li 요소에 현재 li의 html를 복사
                $(this).prev('.order_item').html($(this).html());
            });

            // 리스트가 끝까지 차있을 경우 마지막 오더로 증식 하는 문제해결
            $('.order_item').last().empty();
            
            // 모든 .order_item의 내용이 없다면 총금액 보이지 않게
            checkOrderItems();

        }else{

            // 아니라면 그 값을 출력
            $(this).siblings('.price').text(updatedPrice);
            // 수량 감소
            $(this).siblings('.count').text(uptatecnt);

        }

        totalPrice();
    });

    $('.reset').click(function(){
        $('.order_item').empty();
        checkOrderItems();
        alert('전체취소');
    });


    // 백앤드 작업임으로 구현하지 않음
    $('.submit').click(function(){
        $('.order_item').empty();
        checkOrderItems();
        alert('주문완료');
    });
    
});