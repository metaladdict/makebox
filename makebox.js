/*
 * makeBox
 * 
 * Author : Erwan Kuznik
 * http://www.wdev.pro/
 * 
 */

(function( $ )
{
	$.makeBox = function(elm, options) 
	{
		var def = 
		{
			docw:					200,
			doch: 				200,

			espaisseur: 	3,
			brulage: 			.2,
			strkwdth: 		.2,
			mrgzone: 			2,

			wcrans: 			10,
			courbure: 		5,
			decalcourbe: 	3,
			autocrop: 		true,
			autopos: 			true,

			listElms:			{},
			p0: 					[0,0],
		}
		var p = this;
		p.set = {};
		
		var $elm = $(elm), elm = elm;
		
		p.init = function()
		{
			p.set = $.extend({}, def, options, $elm.data());
			
			$elm.addClass('makebox');
			p.creerInterface();
			p.creerActions();

			p.creerElement({cotes:'1234', y:20, x:20, w:50, h:50});
		}


		/**********************************************************/
		/*													 SVG													*/
		/**********************************************************/
		p.updateSVGView = function()
		{
			$('#preview *').remove();
			$('#preview').attr({
			"width"						:	p.set.docw+"mm",
			"height"					:	p.set.doch+"mm",
			"viewBox"					:	"0 0 "+p.set.docw+" "+p.set.doch,
			"stroke-width"		:	p.set.strkwdth
			});
			
			$.each(p.set.listElms, function(id,elm){
				p.fabriquerPiece(id, elm);
			});
		}

		p.fabriquerPiece = function(id, dts)
		{
			var p0 = [
				p.set.p0[0] + p.set.mrgzone + dts.x,
				p.set.p0[1] + p.set.mrgzone + dts.y
			]
			switch(dts.coins[0])
			{
				case "1":
					var cmd = ['M ' + (p0[0] - p.set.brulage) + ',' + (p0[1] - p.set.brulage),];
				break;
				case "2":
					var cmd = ['M ' + (p0[0] - p.set.brulage + p.set.espaisseur) + ',' + (p0[1] - p.set.brulage)];
				break;
				case "3":
					var cmd = ['M ' + (p0[0] - p.set.brulage + p.set.espaisseur) + ',' + (p0[1] - p.set.brulage + p.set.espaisseur)];
				break;
				case "4":
					var cmd = ['M ' + (p0[0] - p.set.brulage) + ',' + (p0[1] - p.set.brulage + p.set.espaisseur),];
				break;
			}
			
			for(cote=0; cote<4; cote++)
			{
				var obj = {
					w: 				p.isEven(cote) ? dts.w : dts.h, 
					sens:			cote, 
					type:			dts.cotes[cote], 
					sides:		[
						(dts.coins[cote]=="1" || dts.coins[cote]=="4") ? 1 : 0, 
						((parseInt(dts.coins[(cote+1)%4])+1)%4>1) ? 1 : 0
					], // 1ou4 / 1ou2
					delta:		[
						parseFloat(dts.dlta[(cote+3)%4]),
						parseFloat(dts.dlta[(cote+1)%4])
					],
				};
				
				cmd.push(p.creerLigneDecoupe(obj));
			}
			
			p.drawIt(cmd, id);
			
		}

		p.drawIt = function(cmd, id)
		{
			var elm = $('<path d="'+cmd.join(' ')+'" fill="transparent" stroke="black" id="'+id+'" />');
			elm.appendTo(p.set.svg);
			document.getElementById("preview").innerHTML += "";
		}

		p.creerLigneDecoupe = function(req)
		{
			def = {w: 50, sens: 0, type:1, delta: 0, sides: [0,0]};
			var cnf = $.extend({}, def, req);
			//console.log(cnf);
			cmd = [];

			// sélection de la progression de découpe : horizontal/vertical, xy/yx et direction
			cld = p.isEven(cnf.sens) ? 'hv' : 'vh';
			dir = p.isEven(cnf.type) ? -1 : 1;
			mlt = {
				x: (cnf.sens<2) ? 1 : -1,
				y: (cnf.sens==1 || cnf.sens==2) ? -1 : 1
			};


			if(cnf.type=="5")
			{
				// plat
				var wTot = cnf.w + (cnf.sides[0] * p.set.espaisseur) + (cnf.sides[1] * p.set.espaisseur) + cnf.delta[0] + cnf.delta[1] + 2 * p.set.brulage;
				cmd.push(cld[0] +' '+ (mlt.x * wTot));
			}
			else
			{
				// cranté
				var crans = Math.floor(Math.abs(cnf.w)/p.set.wcrans);
				if((cnf.type<=2 && p.isEven(crans)) || (cnf.type>=3 && p.isOdd(crans))) {crans++;}
				wcrans = cnf.w/crans;

				
	
				for(i=1; i<=crans; i++)
				{
					//coté adjacent up
					if(i==1)
					{cmd.push(cld[0] +' '+ (mlt.x * (wcrans + (cnf.sides[0] * p.set.espaisseur) + cnf.delta[0] + p.set.brulage + (dir * p.set.brulage))));}
					else if(i==crans)
					{cmd.push(cld[0] +' '+ (mlt.x * (wcrans + (cnf.sides[1] * p.set.espaisseur) + cnf.delta[1] + p.set.brulage + (dir * p.set.brulage))));}
					else
					{
						console.log(dir);
						cmd.push(cld[0] +' '+ (mlt.x * (wcrans + (2 * dir * p.set.brulage))));
					}
			
					if(i<crans)
					{
						cmd.push(cld[1] +' '+ ((mlt.y * dir * p.set.espaisseur)));
						dir*=-1;
					}
				}
			}
			
			return cmd.join(' ');
		}

		/**********************************************************/
		/*									 ACTIONS BOUTONS											*/
		/**********************************************************/
		p.uploadConf = function()
		{
			console.log('Charger une configuration');
			return false;
		}
		p.downloadConf = function()
		{
			console.log('Télécharger une configuration');
			return false;
		}

		p.downloadSVG = function()
		{
			console.log('Téléchaerger le SVG');
			var element = document.createElement('a');
			text = document.querySelector('svg').outerHTML;
			element.setAttribute('href', 'data:text/plain;charset=utf-8,' + text);
			element.setAttribute('download', 'plan.svg');
		
			element.style.display = 'none';
			document.body.appendChild(element);
		
			element.click();
		
			document.body.removeChild(element);
			return false;
		}
		p.killMe = function(e)
		{
			var elmID = $(e.currentTarget).parents('.element').attr('id');
			delete p.set.listElms[elmID];
			p.set.zoneElms.find('.element#'+elmID).remove();

			p.updateSVGView();
			return false;
		}

		p.copyMe = function(e)
		{
			var elmID = $(e.currentTarget).parents('.element').attr('id');
			var newObj = p.set.listElms[elmID];
			//console.log(newObj);
			delete newObj.id;
			p.creerElement(newObj);


			p.updateSVGView();
			return false;
		}
		p.addOne = function(e)
		{
			p.creerElement({});
			return false;
		}


		/**********************************************************/
		/*										 INTERFACE													*/
		/**********************************************************/
		/**
		 * Création de l'interface de l'application
		 */
		p.creerInterface = function()
		{
			var chp = {
				"document":	[
					["docw",				"Largeur doc.", p.set.docw],
					["doch",				"Hauteur doc.", p.set.doch],
				],
				"bois":	[
					["espaisseur",	"Epaisseur du bois", p.set.espaisseur],
					["brulage",			"Compensation brûlage", p.set.brulage],
					["strkwdth",		"Epaisseur de trait", p.set.strkwdth],
					["mrgzone",			"Marge de base", p.set.mrgzone],
				],
				"dessin": [
					["wcrans",			"Largeur des crans", p.set.wcrans],
					["courbure",		"Courbe couvercle", p.set.courbure],
					["decalcourbe",	"Débord blocage couvercle", p.set.decalcourbe],
				],
				"options": [
					["autocrop",		"Recadrer doc", p.set.autocrop, "checkbox"],
					["autopos",		"Repositionnement doc", p.set.autocrop, "checkbox"]
				],
			};
			
			// vue
			p.set.svg = $('<svg xmlns="http://www.w3.org/2000/svg" stroke-width=".2" id="preview" fill="transparent" stroke-opacity="1" stroke="black"></svg>').attr(
				{
					"width"						:	p.set.docw+"mm",
					"height"					:	p.set.doch+"mm",
					"viewBox"					:	"0 0 "+p.set.docw+" "+p.set.doch,
					"stroke-width"		:	p.set.strkwdth,
				});
			var vue = $('<section class="vue"></section>').append(p.set.svg);
			$elm.append(vue);
			
			//champs
			var cnf = $('<section class="conf"></section>');
			p.set.zonechps = $('<div class="areachp"></div>');
			p.set.zoneBase = $('<div class="baseparams"></div>').appendTo(p.set.zonechps);
			p.set.zoneElms = $('<div class="listeelm"></div>').appendTo(p.set.zonechps);
			
			$.each(chp, function(k,l){
				p.creerFieldSet(k,l).appendTo(p.set.zoneBase);
			});
			
			p.set.zonechps.appendTo(cnf);
			
			//boutons
			var zonebtn = $('<div class="areabtn"></div>');
			p.set.addOne = $('<a href="#" class="addone">Ajouter</a>').appendTo(zonebtn);
			p.set.btnLoad = $('<a href="#" class="loader">Charger</a>').appendTo(zonebtn);
			p.set.btnSave = $('<a href="#" class="saver">Sauvegarder</a>').appendTo(zonebtn);
			p.set.btnDown = $('<a href="#" class="dwnld">Télécharger</a>').appendTo(zonebtn);
			
			zonebtn.appendTo(cnf);
			
			cnf.appendTo($elm);
		}

		p.creerElement = function(req)
		{
			var def = {
				'type': 'quad', 'x' : 0, 'y' : 0, 'w' : 50, 'h' : 50, 
				'cotes':	"1111", 'dlta': [0,0,0,0], "id" : 'elm'+p.uid(), 'kp':[0,0,0,0,0,0,0,0]
			};
			var blockConf = $.extend({}, def, req);
			blockConf.coins = p.recreerCoins(blockConf.cotes);
			var zconf = $('<div class="zconf"></div>');
			var btnlst = $('<div class="btnlst"></div>').appendTo(zconf);
			$('<a href="#">X</a>').click(p.killMe).appendTo(btnlst);
			$('<a href="#">+1</a>').click(p.copyMe).appendTo(btnlst);

			p.creerFieldSet('base',JSON.parse('[["w","Larg.", '+blockConf.w+'],["h","Haut.", '+blockConf.h+'],["x","X", '+blockConf.x+'],["y","Y", '+blockConf.y+']]')).addClass('quadri').appendTo(zconf);
			p.creerFieldSet('dlta',JSON.parse('[["dlta.0","⮝", '+blockConf.dlta[0]+'],["dlta.1","⮞", '+blockConf.dlta[1]+'],["dlta.2","⮟", '+blockConf.dlta[2]+'],["dlta.3","⮜", '+blockConf.dlta[3]+']]')).addClass('quadri').prepend('<strong>Décalage</strong>').appendTo(zconf);
			p.creerFieldSet('dkp1',JSON.parse('[["kp.0","⮝", '+blockConf.kp[0]+'],["kp.1","⮞", '+blockConf.kp[1]+'],["kp.2","⮟", '+blockConf.kp[2]+'],["kp.3","⮜", '+blockConf.kp[3]+'],["kp.4","⮝", '+blockConf.kp[0]+'],["kp.5","⮞", '+blockConf.kp[1]+'],["kp.6","⮟", '+blockConf.kp[2]+'],["kp.7","⮜", '+blockConf.kp[3]+']]')).addClass('quadri').prepend('<strong>Découpe delta / arrondi</strong>').appendTo(zconf);


			var configurateur = $('<div class="element" data-cotes="'+blockConf.cotes+'" id="'+blockConf.id+'"></div>');
			$('<div data-type="'+blockConf.coins[0]+'" class="coin hg"><span></span></div>').appendTo(configurateur);
			$('<div data-type="'+blockConf.cotes[0]+'" class="cote h"><span></span></div>').appendTo(configurateur);
			$('<div data-type="'+blockConf.coins[1]+'" class="coin hd"><span></span></div>').appendTo(configurateur);
			$('<div data-type="'+blockConf.cotes[3]+'" class="cote g"><span></span></div>').appendTo(configurateur);
			zconf.appendTo(configurateur);
			$('<div data-type="'+blockConf.cotes[1]+'" class="cote d"><span></span></div>').appendTo(configurateur);
			$('<div data-type="'+blockConf.coins[3]+'" class="coin bg"><span></span></div>').appendTo(configurateur);
			$('<div data-type="'+blockConf.cotes[2]+'" class="cote b"><span></span></div>').appendTo(configurateur);
			$('<div data-type="'+blockConf.coins[2]+'" class="coin bd"><span></span></div>').appendTo(configurateur);
			
			p.set.listElms[blockConf.id] = blockConf;
			p.set.zoneElms.append(configurateur);

			p.updateSVGView();
		}


		/**
		 * Crée un <div> avec la class k, contenant les champs définits dans l
		 * @param {string} k clé du groupe de champs
		 * @param {Array} l liste de champs [id, label, [type]]
		 * @returns object jQuery d'un div
		 */
		p.creerFieldSet = function(k,l)
		{
			var grp = $('<div class="'+k+'"></div>');
			$.each(l, function(i,f){
				switch(f[3])
				{
					case 'checkbox':
						var fld = $('<label data-placeholder="'+f[1]+'" class="ischeck" ><input id="'+f[0]+'" type="checkbox"></label>');
						if(typeof f[2] != undefined && f[2]===true) {$(fld).find('input').prop('checked', true);}
					break;
					default:
						var fld = $('<label data-placeholder="'+f[1]+'" ><input id="'+f[0]+'" type="text"></label>');
						if(typeof f[2] != undefined) {fld.find('input').val(f[2]);}
					break;
				}
				fld.appendTo(grp);
			});
			return grp;
		}

		p.creerActions = function()
		{
			p.set.addOne.click(p.addOne);
			p.set.btnLoad.click(p.uploadConf);
			p.set.btnSave.click(p.downloadConf);
			p.set.btnDown.click(p.downloadSVG);
			p.set.zonechps.find('input').on('change', p.updateSVGView);

			//p.set.zoneElms.on('click', '.coin', p.transmuterCoin);
			p.set.zoneElms.on('click', '.cote', p.transmuterCote);
			p.set.zoneElms.on('change', 'input', p.elmDataChanged);
			p.set.zoneBase.on('change', 'input', p.bazDataChanged);
		}

		/**********************************************************/
		/*											 UPDATERS													*/
		/**********************************************************/
		p.recreerCoins = function(c)
		{
			coins = "";

			for(i=0; i<=3; i++)
			{
				duo = ((i==0)?c[3]:c[i-1])+''+c[i]; //création d'une chaine des cote précédents et suivants
				if(duo=='11' || duo=='13' || duo=='41' || duo=='43')
				{coins+='1';}
				else if(duo=='51' || duo=='53' || duo=='21' || duo=='23' || duo=='31' || duo=='33')
				{coins+='2';}
				else if(duo=='52' || duo=='54' || duo=='55' || duo=='22' || duo=='24' || duo=='25' || duo=='32' || duo=='34' || duo=='35')
				{coins+='3';}
				else if(duo=='12' || duo=='14' || duo=='15' || duo=='42' || duo=='44' || duo=='45')
				{coins+='4';}
			}

			return coins;
		}

		p.refreshElements = function(el)
		{
			var elmID = el.attr('id');
			p.set.listElms[elmID].cotes = el.find('.h').attr('data-type')+el.find('.d').attr('data-type')+el.find('.b').attr('data-type')+el.find('.g').attr('data-type');
			p.set.listElms[elmID].coins = p.recreerCoins(p.set.listElms[elmID].cotes);
			el.find('.hg').attr('data-type', coins[0]);
			el.find('.hd').attr('data-type', coins[1]);
			el.find('.bd').attr('data-type', coins[2]);
			el.find('.bg').attr('data-type', coins[3]);

			p.updateSVGView();
		}

		p.transmuterCote = function(e)
		{
			tp = parseInt($(e.currentTarget).attr('data-type'));
			$(e.currentTarget).attr('data-type', (tp>=5) ? 1 : tp+1);
			p.refreshElements($(e.currentTarget).parents('.element'));
		}

		p.bazDataChanged = function(e)
		{
			var fld = $(e.currentTarget);
			var k = (fld.attr('id').includes('.')) ? fld.attr('id').split('.') : fld.attr('id');
			var newV = (isNaN(fld.val())) ? fld.val() : parseFloat(fld.val());
			if(Array.isArray(k))
			{p.set[k[0]][k[1]] = newV;}
			else
			{p.set[k] = newV;}

			p.updateSVGView();
		}

		p.elmDataChanged = function(e)
		{
			var fld = $(e.currentTarget);
			var elmID = fld.parents('.element').attr('id');
			var k = (fld.attr('id').includes('.')) ? fld.attr('id').split('.') : fld.attr('id');
			var newV = (isNaN(fld.val())) ? fld.val() : parseFloat(fld.val());
			if(Array.isArray(k))
			{p.set.listElms[elmID][k[0]][k[1]] = newV;}
			else
			{p.set.listElms[elmID][k] = newV;}

			p.updateSVGView();
		}


		/**********************************************************/
		/*												 UTILS 													*/
		/**********************************************************/
		p.isEven = function(n) {return n % 2 == 0;}
		p.isOdd = function(n) {return Math.abs(n % 2) == 1;}
		p.uid = function() {return Math.random().toString(16).slice(2).slice(-8)+'-'+Math.random().toString(16).slice(2).slice(-4);}
		

		p.init();
	};

	$.fn.makeBox = function(options) 
	{
		return this.each(function() 
			{
				if (undefined == $(this).data('makeBox')) 
				{
					var p = new $.makeBox(this, options);
					$(this).data('makeBox', p);
				}
		});
	}
})(jQuery);

