$(document).ready(function() {

// Company data
	var companies =
	[{ name: 'Apple', symbol: 'AAPL', price: 577, qty: 0 },
	{ name: 'Google', symbol: 'GOOG', price: 650, qty: 0 },
	{ name: 'JP Morgan Chase', symbol: 'JPM', price: 33, qty: 0 },
	{ name: 'Microsoft', symbol: 'MSFT', price: 35, qty: 0 },
	{ name: 'Facebook' , symbol: 'FB', price: 27, qty: 0 }];	
	
// Portfolio value
	var cash = 1000;
	
// Initializes portfolio with provided company data
	function load_data() {
		var ctr=0;
		$('.stock_info>li').each(function(){		
			$(this).append(companies[ctr][$(this).attr('class')]);	
			if($(this).attr('class')=='sell'){ ctr+=1; }		
		});
		ctr=0;
	}
	
	load_data();	
	
// Enables buying and selling of single shares (with restrictions)
	$('.buy>input').click(function(e){
		e.preventDefault();
		
		var symbol = $(this).parent().siblings('.symbol').text().replace('Symbol: ','');		
		var co = companies.filter(function(company){ return company.symbol == symbol });		
		
		// updates quantity of shares after buying 1 share
		// need to make sure cannot buy if not enough cash
		if(co[0]['price']>cash){
			alert("You cannot afford to buy this share; try selling a share to raise cash");
		} else {
			co[0]['qty'] += 1;		
			$(this).parent().siblings('.qty').text('Quantity Owned: '+co[0]['qty']);
			
			// reduces cash based on price of stock
			cash -= co[0]['price'];
			cash = Math.round(cash*100)/100;
			cash.toFixed(2);
			$('#cash').text('Cash: $'+cash);
		}	
	});
	
	$('.sell>input').click(function(e){
		e.preventDefault();
		
		var symbol = $(this).parent().siblings('.symbol').text().replace('Symbol: ','');		
		var co = companies.filter(function(company){ return company.symbol == symbol });
		
		// updates quantity of shares after selling 1 share
		// need to make sure cannot sell if no shares owned
		if(co[0]['qty']>=1){
			co[0]['qty'] -= 1;
			$(this).parent().siblings('.qty').text('Quantity Owned: '+co[0]['qty']);
			
			// increases cash based on price of stock
			cash += co[0]['price'];
			cash = Math.round(cash*100)/100;
			cash.toFixed(2);
			$('#cash').text('Cash: $'+cash);			
		} else {
			alert("You do not have any shares to sell.")
		}		
	});

// Randomizes stock prices by +/- $0.10 every second

	function rand_price(x){
		// went a little over to ensure could include +/- .1
		x['price'] += Math.random() < 0.5 ? -1.1*Math.random() : 1.1*Math.random();
		
		// formats display of number
		// toFixed(2) can fail to limit the length after decimal 
		x['price'] = Math.round(x['price']*100)/100;
	}

	setInterval(function(){
		companies.map(rand_price);		
		$('.stock_info>li').filter('.price').each(function(i){
			$(this).text('Price: '+companies[i]['price']);
		});
	},1000);

});
