/***************** GENERATE CONTENT FOR DEMO PURPOSE *********************/
const getContainer = document.querySelector('.eltContainer');
class Populate {
	static rep = 155;
	constructor( mainCont ) {
		this.mainCont = mainCont;
		this.push();
	}
	createElt() {
		let item = document.createElement('div');
		let itemTitle = document.createElement('h4');
		itemTitle.textContent = 'Ceci est un élément';
		let itemDesc = document.createElement('p');
		itemDesc.textContent = 'Ceci est une description de cet élément';
		let itemButton = document.createElement('h4');
		itemButton.textContent = 'Cliquez ici';
		item.append(itemTitle);
		item.append(itemDesc);
		item.append(itemButton);
		return item;
	}
	push() {
		for(let i=0; i < Populate.rep; i++) {
			this.mainCont.append(this.createElt());
		}
	}
}
const test = new Populate(getContainer);

/********************* THE NAV UI CLASS **************************/
class NavUI {
	constructor (
			itemsCont, //the CSS selector of the items container
			interfaceCont, //The CSS selector of the nav ui container
			itemsPerPage, //Fix the maximum items per page
			maxNavItems //Fix the maximum nav items within the interface
		) {
								
		this.itemsCont     = document.querySelector(itemsCont);
		this.interfaceCont = document.querySelector(interfaceCont);
		this.itemsPerPage  = itemsPerPage;
		this.book = this.formatBook(this.itemsCont, this.itemsPerPage); //use formatBook to store the book in this.book
		this.maxNavItems   = this.sanitizeMNI(maxNavItems);
		this.createNavUI();
		this.navController();
	}
	
	direction = 'ltr'; //default nav direction is left to right - it's very important since the behavior of remainders is different when you start from the last page
			
	sanitizeMNI( maxItems ) { //Avoid overlength of nav items
		let maxAllowed = 0;
		if ( maxItems > Object.keys(this.book).length / 4) {//total pages cut to the forth, can be changed
			maxAllowed = Math.trunc(Object.keys(this.book).length / 2);//assign the integer part
		} else {
			maxAllowed = maxItems;
		}
		return maxAllowed;
	}
	
	formatBook(target, limit) { //Utility method wich takes 2 params - target has to be CSS selector string - limit has to be an integer
		let eltCollection = []; //We're gonna stock all the items here
		for (const child of target.children ) {//Pushing the items
			eltCollection.push(child);
		}
		let book  = {}; //The book we're gonna use to navigate through the pages
		let pages = 1;  //Starting at page 1
		let currentPage = []; //This is important - it will later allows us to use the remainders properties to push the right number of items within it
		for (let i = 1; i < eltCollection.length + 1; i++) { //Starting from 1 cause of remainder
			if ( i % limit === 0 ) { //if the remainder of i divided by the page limit equal to zero
				currentPage.push(eltCollection[i - 1]); //we push the last item within the current page
				book[pages] = currentPage;//then the page is complete so we push it within the book
				currentPage = []; //reseting the variable
				pages++; //shifting to the next page
			} else if (i % limit != 0 && i === eltCollection.length) { //the remainder is different to 0 and we reached the last item
				currentPage.push(eltCollection[i - 1]); //we push that final item within the final page
				book[pages] = currentPage;//we push the final page within the book
			} else {
				currentPage.push(eltCollection[i - 1]);//else just pushing the current item to populate the page
			}
		}
		return book; //return the book and the number of items
	}
	createNavUI(startingPage = 1, direction = 'ltr') { //2 params - the page from which to start building the ui - the navigation direction
			//Empty the nav ui
			while(this.interfaceCont.firstElementChild) {
				this.interfaceCont.firstElementChild.remove();
			}
			//create the jumpleft button
			if ( Object.keys(this.book).length / this.maxNavItems > 2 ) { //Only if there is enough pages regarding to the size of the nav UI
				if (this.maxNavItems >= startingPage) {
					this.interfaceCont.append(this.createNavItem('jumpleft'));
				} else {
					this.interfaceCont.append(this.createNavItem('jumpleft', [ [], [false, false] ]));
				}
			}
			//create the previous button
			if ( Object.keys(this.book).length > 1 ) { //only if the book has more than 1 page
				if (startingPage === 1) { //if the starting page is the first of the book
					this.interfaceCont.append(this.createNavItem('previous')); //call the createNavItem method to create the previous button and puhsing it within the nav ui - the disablePrevNext argument will get its default value so the button will be disabled
				} else {
					this.interfaceCont.append(this.createNavItem('previous', [ [false, false], [] ] )); // same as above but this time the button will be activated
				}
			}
			//Populate the ui with the pages
			if ( Object.keys(this.book).length <= this.maxNavItems ) { //if the number of pages is inferior or equal to the max number of nav items allowed
				for (let i = 1; i < Object.keys(this.book).length + 1; i++) { //iteration from 1 to the number of pages within the book
					if (startingPage === i) { //if i equal to the starting page 
						this.interfaceCont.append(this.createNavItem('page', [], [i, true])); //create a page element with focus (using last param of createNavItem method)
					} else {
						this.interfaceCont.append(this.createNavItem('page', [], [i, false])); //create a page element without  focus
					}
				}
			} else { //Here is the big part - if the number of pages in the book is higher than the max number of nav items allowed then we need to handle the lookahead functionality
				if (direction === 'rtl') { //if the nav direction param is 'rtl' (reverse nav) then we add the lookahead func on the left
					this.interfaceCont.append(this.createNavItem('page', [], [1, false, true]));
					this.interfaceCont.append(this.createNavItem('...'));
				}
				let inc = 0; //We use this to know when the starting page is reached on the reverse direction
				for (let i = 0; i < this.maxNavItems; i++) { //we iterate a first time to check the currentPage position
					if (direction === 'ltr') {
						if ( ( startingPage % this.maxNavItems === (i + 1) % this.maxNavItems ) )  {//if this condition is true we have reached the starting page regarding to the direction
							inc++
							break;//break the loop to get the position
						} else {
							inc++;
						}
					}
					if (direction === 'rtl') {//if the direction is reverse
						if ( ( startingPage % this.maxNavItems === (Object.keys(this.book).length + (i + 1)) % this.maxNavItems ) )  {//if this condition is true we have reached the starting page regarding to the direction
							inc++
							break;//break the loop to get the position
						} else {
							inc++;
						}
					}
				}
				for (let i = 0; i < this.maxNavItems; i++) {//then we use the currentPage position (inc) to create the UI nav elements
					if ( (i + 1) < inc ) {
						this.interfaceCont.append(this.createNavItem('page', [], [ startingPage - inc + (i + 1), false, false ]));
					} else if ( (i + 1) === inc ) {
						this.interfaceCont.append(this.createNavItem('page', [], [startingPage, true, false])); 
					} else {
						this.interfaceCont.append(this.createNavItem('page', [], [ startingPage + ((i + 1) - inc), false, false ]));
					}
				}
				if (direction === 'ltr') { //if the nav direction param is 'ltr' (default nav) then we add the lookahead func on the right
					this.interfaceCont.append(this.createNavItem('...'));
					this.interfaceCont.append(this.createNavItem('page', [], [Object.keys(this.book).length, false, true]));
				}
			}
			//create the next button
			if ( Object.keys(this.book).length > 1 ) {
				if ( startingPage === Object.keys(this.book).length ) {
					this.interfaceCont.append(this.createNavItem('next', [ [false, true], [] ] ));
				} else {
					this.interfaceCont.append(this.createNavItem('next'));
				}
			}
			//create the jump right button
			if ( Object.keys(this.book).length / this.maxNavItems > 2 ) { //Only if there is enough pages regarding to the size of the nav UI
				if (startingPage + this.maxNavItems > Object.keys(this.book).length) {
					this.interfaceCont.append(this.createNavItem('jumpright', [ [], [false, true] ]));
				} else {
					this.interfaceCont.append(this.createNavItem('jumpright'));
				}
			}
		}
	createNavItem( type, disablePrevNext = [ [true, false], [true, false] ], pageNumber = [1, true, false]) { // type can be 'previous', 'next', 'page', '...' | disableNextPrev is an array of boolean, if true the prev /next button will be disabled respectively | pageNumber is the page that should be displayed
			let button = document.createElement('button'); //create the HTML element
			switch (type) { //switch the type argument
				case 'previous' :
					button.innerHTML = '&lsaquo;'; //this is facultative, could also use CSS to add a previous icon
					button.setAttribute('data-nav', 'previous');//add a custom data-nav attribute to the HTML element
					if (disablePrevNext[0][0] === true) { button.setAttribute('disabled', 'true'); } //disable if needed
					break;
				case 'jumpleft' :
					button.innerHTML = '&laquo;'; //this is facultative, could also use CSS to add a previous icon
					button.setAttribute('data-nav', 'jumpleft');//add a custom data-nav attribute to the HTML element
					if(disablePrevNext[1][0] === true) { button.setAttribute('disabled', 'true'); } //on met 2 tableaux dans un tableau pour gérer les deux types de boutons prev et next !
					break;
				case 'jumpright' :
					button.innerHTML = '&raquo;'; //this is facultative, could also use CSS to add a previous icon
					button.setAttribute('data-nav', 'jumpright');//add a custom data-nav attribute to the HTML element
					if(disablePrevNext[1][1] === true) { button.setAttribute('disabled', 'true'); } //on met 2 tableaux dans un tableau pour gérer les deux types de boutons prev et next ! [ [true, false], [false, false] ] par défaut
					break;
				case 'next' : 
					button.innerHTML = '&rsaquo;'; //this is facultative, could also use CSS to add a next icon
					button.setAttribute('data-nav', 'next');//add a custom data-nav attribute to the HTML element
					if (disablePrevNext[0][1] === true) { button.setAttribute('disabled', 'true'); };//disable if needed
					break;
				case '...' :
					button.textContent = '...';//use to separate regular nav and fast nav
					button.setAttribute('disabled', 'true');//always disabled
					break;
				case 'page' :
					if (pageNumber[0] != 0) {//the page number can't be 0
						button.textContent = pageNumber[0].toString();//writing the number of the page within the button
						button.setAttribute('data-nav', 'page');//add a custom data-nav attribute to the HTML element
					}
					if (pageNumber[1] === true) {//set the focus on the right page
						button.setAttribute('aria-current', 'true');
					}
					if (pageNumber[2] === true) {//needed to set a different behavior for fast nav page button
						button.setAttribute('data-fast', 'true');
					}
					break;
			}
			return button;
		}
	displayActivePage( page ) { //Display the content of the focused page, hide the rest
			for (const [key, value] of Object.entries( this.book ) ) {
				if ( key != page.toString() ) {
					for (const elt of value) {
						elt.style.display = 'none';
					}
				} else {
					for (const elt of value) {
						elt.style.display = 'block';
					}
				}
			}
		}
	resetFocus() { //Utility method - Resets focus
			for (const button of this.interfaceCont.children) {
				button.removeAttribute('aria-current');
			}
		}
	getFocusedElt() { //return focused HTML element
			for (const button of this.interfaceCont.children) {
				if (button.getAttribute('data-nav', 'page') ) {
					if (button.getAttribute('aria-current') === 'true') {
						return button;
					}
				}
			}
		}
		/****** HANDLE THE BEHAVIOR OF THE NAV UI ******/
	navController() {
			let currentPage = 1; //set the first page to 1
			this.displayActivePage(1);//display content of page 1
			document.addEventListener('click', (event) => { //Listen to the click on the ui
				let currentPos = this.getFocusedElt(); //Get back the element with focus
				if (event.target.getAttribute('data-nav') === 'page' ) {//if targeted element is a page button
					this.resetFocus();//removing all the focus on any button
					this.displayActivePage(event.target.textContent);//display the content of the cliked page
					event.target.setAttribute('aria-current', 'true');//add the focus to the button
					currentPage = parseInt(event.target.textContent);//store the displayed page number
					if (parseInt(event.target.textContent) === 1 && event.target.getAttribute('data-fast') === 'true') {//if a fast travel is initiated to the first page
						this.createNavUI(currentPage, 'ltr');//We generate a new UI with the default direction
						this.direction = 'ltr';//we store the current direction
					}
					if (parseInt(event.target.textContent) === Object.keys(this.book).length && event.target.getAttribute('data-fast') === 'true') {//if a fast travel is initiated to the last page
						this.createNavUI(currentPage, 'rtl');//We generate a new UI with the reverse direction
						this.direction = 'rtl';//we store the current direction
					}
				}
				if (event.target.getAttribute('data-nav') === 'next' ) {//if targeted element is a next button
					if (currentPos.nextElementSibling.getAttribute('data-nav') === 'page' ) {//we want to know if the next button is a page one
						currentPos.removeAttribute('aria-current');//removing the focus of the focused element
						currentPos.nextElementSibling.setAttribute('aria-current', 'true');//add focus to the next element
						currentPage++;//change page
						this.displayActivePage(currentPage);//dislay the content of the next page
					} else if ( ( currentPos.nextElementSibling.textContent === '...' || currentPos.nextElementSibling.getAttribute('data-nav') === 'next' ) && Object.keys(this.book).length - parseInt(currentPos.textContent) > this.maxNavItems ) { //if the next element is neither a ... nor a next AND there is more than maxNavItems left in the book
						this.resetFocus();
						currentPage++;
						this.displayActivePage(currentPage);
						if (this.direction === 'ltr') {//if the current direction is ltr
							this.createNavUI(currentPage, 'ltr');//generate the UI in the proper direction
						} else if (this.direction === 'rtl') {
							this.createNavUI(currentPage, 'rtl');//generate the UI in the proper direction
						}
					} else if ( ( currentPos.nextElementSibling.textContent === '...' || currentPos.nextElementSibling.getAttribute('data-nav') === 'next' ) && Object.keys(this.book).length % parseInt(currentPos.textContent) <= this.maxNavItems ) {//if the next element is neither a ... nor a next AND there is not enough items left
						this.resetFocus();
						currentPage++;
						this.displayActivePage(currentPage);
						this.createNavUI(currentPage, 'rtl');//generate a rtl UI because we reached the end of the book
						this.direction = 'rtl';//store the current direction
					}
				}
				if (event.target.getAttribute('data-nav') === 'previous' ) {//if targeted element is a previous button
					if (currentPos.previousElementSibling.getAttribute('data-nav') === 'page') {//we want to know if the previous button is a page one
						currentPos.removeAttribute('aria-current');//removing the focus of the focused element
						currentPos.previousElementSibling.setAttribute('aria-current', 'true');//add focus to the previous element
						currentPage--;//going backward through the pages and store the position
						this.displayActivePage(currentPage);
					} else if ( ( currentPos.previousElementSibling.textContent === '...' || currentPos.previousElementSibling.getAttribute('data-nav') === 'previous' ) && parseInt(currentPos.textContent) - 1 > this.maxNavItems ) { //if the previous element is neither a ... nor a previous AND there is more than maxNavItems left in the book (regarding to the direction)
						this.resetFocus();
						currentPage--;
						this.displayActivePage(currentPage);//dislay the content of the previous page
						if (this.direction === 'rtl') {
							this.createNavUI(currentPage, 'rtl');//generate the UI in the proper direction
						} else if (this.direction === 'ltr') {
							this.createNavUI(currentPage, 'ltr');//generate the UI in the proper direction
						}
					} else if ( ( currentPos.previousElementSibling.textContent === '...' || currentPos.previousElementSibling.getAttribute('data-nav') === 'previous' ) && parseInt(currentPos.textContent) - 1 <= this.maxNavItems ) { //if the previous element is neither a ... nor a previous AND there is not enough items left
						this.resetFocus();
						currentPage--;
						this.displayActivePage(currentPage);
						this.createNavUI(currentPage, 'ltr');//generate a ltr UI because we reached the begining of the book
						this.direction = 'ltr';//store the current direction
					}
				}
				if (event.target.getAttribute('data-nav') === 'jumpright') {
					if (Object.keys(this.book).length - this.maxNavItems >= parseInt(currentPos.textContent) + this.maxNavItems ) {//makes sure that there are enough elements left to jump forward
						this.resetFocus();
						currentPage = currentPage + this.maxNavItems;//we jump forward
						this.displayActivePage(currentPage);
						if (this.direction === 'ltr') {
							this.createNavUI(currentPage, 'ltr');//generate the UI in the proper direction
						} else if (this.direction === 'rtl') {
							this.createNavUI(currentPage, 'rtl');//generate the UI in the proper direction
						}
					} else { //if not then we have to swap the direction when creating the nav UI
						this.resetFocus();
						currentPage = currentPage + this.maxNavItems;
						this.displayActivePage(currentPage);
						this.createNavUI(currentPage, 'rtl');
						this.direction = 'rtl';//store the current direction
					}
				}
				if (event.target.getAttribute('data-nav') === 'jumpleft')  {
					if (parseInt(currentPos.textContent) - this.maxNavItems >= this.maxNavItems) {//makes sure that there are enough elements left to jump back
						this.resetFocus();
						currentPage = currentPage - this.maxNavItems;//we jump back
						this.displayActivePage(currentPage);
						if (this.direction === 'rtl') {
							this.createNavUI(currentPage, 'rtl');//generate the UI in the proper direction
						} else if (this.direction === 'ltr') {
							this.createNavUI(currentPage, 'ltr');//generate the UI in the proper direction
						}
					} else { //if not then we have to swap the direction when creating the nav UI
						this.resetFocus();
						currentPage = currentPage - this.maxNavItems;
						this.displayActivePage(currentPage);
						this.createNavUI(currentPage, 'ltr');//generate the UI in the proper direction
						this.direction = 'ltr';//store the current direction once again
					}
				}
				//Handle the deactivation of prev and next buttons
				currentPos = this.getFocusedElt();
				if (parseInt(currentPos.textContent) > 1) {
					this.interfaceCont.querySelector('[data-nav="previous"]').removeAttribute('disabled');
				} else {
					this.interfaceCont.querySelector('[data-nav="previous"]').setAttribute('disabled', 'true');
				}
					if (parseInt(currentPos.textContent) === Object.keys(this.book).length) {
						this.interfaceCont.querySelector('[data-nav="next"]').setAttribute('disabled', 'true');
					} else {
						this.interfaceCont.querySelector('[data-nav="next"]').removeAttribute('disabled');
					}
			});
	}
}
//How to use : just instanciate the class and pass the HTML container for elements and the HTML container for the UI as arguments	
const navigation = new NavUI( '.eltContainer', '.pageNav', 5, 5 ); //creating an UI with X max elements per page and X page elements in the nav UI
