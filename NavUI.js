/***************** GENERATE CONTENT FOR TESTING PURPOSE *********************/
			const getContainer = document.querySelector('.eltContainer');
		
			class Populate {
				static rep = 79;
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
			
			/********************* DECOUPAGE en BOOK **************************/
			
			class Split {
			
				static pageLimit = 5;
				static containerClass = '.eltContainer';
				
				static formatBook() {
				
					let container = document.querySelector(Split.containerClass);
					let eltCollection = [];
					
					for (const child of container.children ) {
						eltCollection.push(child);
					}
					let book = {};
					let pages = 1; //On toujours commence à la page 1
					let currentPage = []; //Cette variable est importante, elle va permettre d'utiliser les caractéristiques mathématiques du modulo pour pousser le bon nombre d'item dans chaque page
						for (let i = 1; i < eltCollection.length + 1; i++) { 
						
							if ( i % Split.pageLimit === 0 ) { //Si le numéro de l'item modulo le nombre max d'items par page égal à 0, alors on est certain qu'on est sur un multiple parfait
								currentPage.push(eltCollection[i - 1]);//on pousse le dernier item dans currentPage
								book[pages] = currentPage;//on pousse la page complète dans le book
								currentPage = []; //Attention à bien réinitialiser la variable !
								pages++; //On rajoute une page au livre
							} else if (i % Split.pageLimit != 0 && i === eltCollection.length ) {
								currentPage.push(eltCollection[i - 1]);
								book[pages] = currentPage;
							} else {
								currentPage.push(eltCollection[i - 1]);
							}
							
						}
					return book;
				}
			}	
			//console.log(Split.formatBook( document.querySelector('.eltContainer'), false) ); -----> test
			
			class NavUI {
			
				constructor ( container ) {
				
					this.container = container;
					this.createNavUI();
					this.navController();
					
				}
				
				book = Split.formatBook();
				direction = 'ltr';
								
				createNavUI(startingPage = 1, direction = 'ltr') {
									
					//On vide le contenu du container
					while(this.container.firstElementChild) {
						this.container.firstElementChild.remove();
					}
					//On commence par créer le bouton previous qui est toujours au même endroit
					if ( Object.keys(this.book).length > 1 ) { //Si le book a plus d'une page
						if (startingPage === 1) {
							this.container.append(this.createNavItem('previous'));
						} else {
							this.container.append(this.createNavItem('previous', [false, false]));
						}
					}
					
					//On crée les pages courantes
					if ( Object.keys(this.book).length < 6) {
						for (let i = 1; i < Object.keys(this.book).length + 1; i++) {
						
							if (startingPage === i) {
								this.container.append(this.createNavItem('page', [], [i, true]));
							} else {
								this.container.append(this.createNavItem('page', [], [i, false]));
							}
							
						}
					} else {
						//C'est la qu'il faut prendre en compte la direction !
						//La position du focus est égale à (startingPage % 3) sauf si startingPage % 3 = 0, dans ce cas la position sera 3. On peut en déduire les positions adjancentes.
						if (direction === 'ltr') {
							switch (startingPage % 3) {
								case 1 :
									this.container.append(this.createNavItem('page', [], [startingPage, true, false]));
									this.container.append(this.createNavItem('page', [], [startingPage + 1, false, false]));
									this.container.append(this.createNavItem('page', [], [startingPage + 2, false, false]));
									break;
								case 2 :
									this.container.append(this.createNavItem('page', [], [startingPage - 1, false, false]));
									this.container.append(this.createNavItem('page', [], [startingPage, true, false]));
									this.container.append(this.createNavItem('page', [], [startingPage + 1, false, false]));
									break;
								case 0 :
									this.container.append(this.createNavItem('page', [], [startingPage - 2, false, false]));
									this.container.append(this.createNavItem('page', [], [startingPage - 1, false, false]));
									this.container.append(this.createNavItem('page', [], [startingPage, true, false]));
									break;
							}
							
							this.container.append(this.createNavItem('...'));
							this.container.append(this.createNavItem('page', [], [Object.keys(this.book).length, false, true]));
							
						}
						if (direction === 'rtl') { 
							this.container.append(this.createNavItem('page', [], [1, false, true]));
							this.container.append(this.createNavItem('...'));
							switch ( ( Object.keys(this.book).length - startingPage ) % 3) {
								case 2 :
									this.container.append(this.createNavItem('page', [], [startingPage, true, false]));
									this.container.append(this.createNavItem('page', [], [startingPage + 1, false, false]));
									this.container.append(this.createNavItem('page', [], [startingPage + 2, false, false]));
									break;
								case 1 :
									this.container.append(this.createNavItem('page', [], [startingPage - 1, false, false]));
									this.container.append(this.createNavItem('page', [], [startingPage, true, false]));
									this.container.append(this.createNavItem('page', [], [startingPage + 1, false, false]));
									break;
								case 0 :
									this.container.append(this.createNavItem('page', [], [startingPage - 2, false, false]));
									this.container.append(this.createNavItem('page', [], [startingPage - 1, false, false]));
									this.container.append(this.createNavItem('page', [], [startingPage, true ,false]));
									break;
							}
						}
					}
					//On finit par le bouton next qui est toujours au même endroit
					if ( Object.keys(this.book).length > 1 ) {
						if ( startingPage === Object.keys(this.book).length ) {
							this.container.append(this.createNavItem('next', [false, true]));
						} else {
							this.container.append(this.createNavItem('next'));
						}
					}
				}
				createNavItem( type, disablePrevNext = [true, false], pageNumber = [1, true, false]) { // 'previous', 'next', 'page', '...'
					let button = document.createElement('button');
					switch (type) {
						case 'previous' :
							button.innerHTML = '&lsaquo;';
							//button.innerHTML = '<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/></svg>';
							button.setAttribute('data-nav', 'previous');
							if (disablePrevNext[0] === true) { button.setAttribute('disabled', 'true'); }
							break;
						case 'next' : 
							button.innerHTML = '&rsaquo;';
							//button.innerHTML = '<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>';
							button.setAttribute('data-nav', 'next');
							if (disablePrevNext[1] === true) { button.setAttribute('disabled', 'true'); };
							break;
						case '...' :
							button.textContent = '...';
							button.setAttribute('disabled', 'true');
							break;
						case 'page' :
							if (pageNumber[0] != 0) {
								button.textContent = pageNumber[0].toString();
								button.setAttribute('data-nav', 'page');
							}
							if (pageNumber[1] === true) {
								button.setAttribute('aria-current', 'true');
							}
							if (pageNumber[2] === true) {
								button.setAttribute('data-fast', 'true');
							}
							break;
						default :
							console.log('NavUI.createNavItem a reçu un argument invalide');
							return;
					}
					return button;
				}
				displayActivePage( page ) { //Permet de n'afficher que les items de la page qui a le focus
					
					console.log(this.book);
					
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
				navController() {
					let currentPage = 1;
					this.displayActivePage(1);
					
					document.addEventListener('click', (event) => {
					
						let currentPos = this.getFocusedElt(); //Renvoie l'element qui a le focus
						
						if (event.target.getAttribute('data-nav') === 'page' ) {
							this.resetFocus();
							this.displayActivePage(event.target.textContent);
							event.target.setAttribute('aria-current', 'true');
							currentPage = parseInt(event.target.textContent);
							if (parseInt(event.target.textContent) === 1 && event.target.getAttribute('data-fast') === 'true') {
								this.createNavUI(currentPage, 'ltr');
								this.direction = 'ltr';
							}
							if (parseInt(event.target.textContent) === Object.keys(this.book).length && event.target.getAttribute('data-fast') === 'true') {
								this.createNavUI(currentPage, 'rtl');
								this.direction = 'rtl';
							}
						}
						
						if (event.target.getAttribute('data-nav') === 'next' ) {
													
							if (currentPos.nextElementSibling.getAttribute('data-nav') === 'page' ) {
								currentPos.removeAttribute('aria-current');
								currentPos.nextElementSibling.setAttribute('aria-current', 'true');
								currentPage++;
								this.displayActivePage(currentPage);
							} else if ( ( currentPos.nextElementSibling.textContent === '...' || currentPos.nextElementSibling.getAttribute('data-nav') === 'next' ) && Object.keys(this.book).length - parseInt(currentPos.textContent) > 3 ) { //Si il reste toujours au moins 4 éléments après
								this.resetFocus();
								currentPage++;
								this.displayActivePage(currentPage);
								if (this.direction === 'ltr') {
									this.createNavUI(currentPage, 'ltr');
								} else if (this.direction === 'rtl') {
									this.createNavUI(currentPage, 'rtl');
								}
							} else if ( ( currentPos.nextElementSibling.textContent === '...' || currentPos.nextElementSibling.getAttribute('data-nav') === 'next' ) && Object.keys(this.book).length % parseInt(currentPos.textContent) <= 3 ) {
								this.resetFocus();
								currentPage++;
								this.displayActivePage(currentPage);
								this.createNavUI(currentPage, 'rtl');
								this.direction = 'rtl';
							}
						}
						
						if (event.target.getAttribute('data-nav') === 'previous' ) {
													
							if (currentPos.previousElementSibling.getAttribute('data-nav') === 'page') {
								currentPos.removeAttribute('aria-current');
								currentPos.previousElementSibling.setAttribute('aria-current', 'true');
								currentPage--;
								this.displayActivePage(currentPage);
							} else if ( ( currentPos.previousElementSibling.textContent === '...' || currentPos.previousElementSibling.getAttribute('data-nav') === 'previous' ) && parseInt(currentPos.textContent) - 1 > 3 ) {
								this.resetFocus();
								currentPage--;
								this.displayActivePage(currentPage);
								if (this.direction === 'rtl') {
									this.createNavUI(currentPage, 'rtl');
								} else if (this.direction === 'ltr') {
									this.createNavUI(currentPage, 'ltr');
								}
								
							} else if ( ( currentPos.previousElementSibling.textContent === '...' || currentPos.previousElementSibling.getAttribute('data-nav') === 'previous' ) && parseInt(currentPos.textContent) - 1 <= 3 ) {
								this.resetFocus();
								currentPage--;
								this.displayActivePage(currentPage);
								this.createNavUI(currentPage, 'ltr');
								this.direction = 'ltr';
							}
						}
						
						//Gère la desactivation de prev et next
						currentPos = this.getFocusedElt();
						
						if (parseInt(currentPos.textContent) > 1) {
							this.container.firstElementChild.removeAttribute('disabled');
						} else {
							this.container.firstElementChild.setAttribute('disabled', 'true');
						}
						
						if (parseInt(currentPos.textContent) === Object.keys(this.book).length) {
							this.container.lastElementChild.setAttribute('disabled', 'true');
						} else {
							this.container.lastElementChild.removeAttribute('disabled');
						}
						
					});
				}
				resetFocus() { //méthode utilitaire pour reset le focus des items de nav
					for (const button of this.container.children) {
						button.removeAttribute('aria-current');
					}
				}
				getFocusedElt() { //retourne l'élément qui a le focus
					for (const button of this.container.children) {
						if (button.getAttribute('data-nav', 'page') ) {
							if (button.getAttribute('aria-current') === 'true') {
								return button;
							}
						}
					}
				}
			}
			
			const navigation = new NavUI( document.querySelector('.pageNav') );
