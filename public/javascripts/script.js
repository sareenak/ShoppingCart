function addToCart(proId){
    $.ajax({
        url:'/add-to-cart/'+proId,
        method:'get',
        success:(response)=>{
            if(response.status){
                let count=$('#cart').html()
                count=parseInt(count)+1
                $('#cart').html(count)
            }
            
        }
    })
}