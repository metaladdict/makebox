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
			docw:					400,
			doch: 				300,

			espaisseur: 	3,
			brulage: 			.1,
			strkwdth: 		.2,
			mrgzone: 			2,

			wcrans: 			10,
			courbure: 		5,
			decalcourbe: 	3,
			autocrop: 		true,

			list:					[],
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

			p.creerElement();
		}
		


		p.uploadConf = function()
		{
			console.log('Charger une configuration');
		}
		p.downloadConf = function()
		{
			console.log('Télécharger une configuration');
		}
		p.downloadSVG = function()
		{
			console.log('Téléchaerger le SVG');
		}
		p.updateSVGView = function()
		{

		}

		p.creerElement = function(req)
		{
			var def = {
				'type': 'quad', 'x' : 0, 'y' : 0, 'w' : 100, 'h' : 50, 
				'dtls':	"11111111", 'dlta': [0,0,0,0],
			};
			conf = $.extend({}, def, req);
			dtlsX = conf.dtls.split('');

			var configurateur = $('<div class="element"></div>');
			$('<div data-type="'+dtlsX[0]+'" class="coin hg"><span></span></div>').appendTo(configurateur);
			$('<div data-type="'+dtlsX[1]+'" class="cote h"><span></span></div>').appendTo(configurateur);
			$('<div data-type="'+dtlsX[2]+'" class="coin hd"><span></span></div>').appendTo(configurateur);
			$('<div data-type="'+dtlsX[7]+'" class="cote g"><span></span></div>').appendTo(configurateur);
			$('<div class="zconf"></div>').appendTo(configurateur);
			$('<div data-type="'+dtlsX[3]+'" class="cote d"><span></span></div>').appendTo(configurateur);
			$('<div data-type="'+dtlsX[6]+'" class="coin bg"><span></span></div>').appendTo(configurateur);
			$('<div data-type="'+dtlsX[5]+'" class="cote b"><span></span></div>').appendTo(configurateur);
			$('<div data-type="'+dtlsX[4]+'" class="coin bd"><span></span></div>').appendTo(configurateur);
			
			p.set.elmRoot.append(configurateur);
		}

		p.transmuterCoin = function(e)
		{
			tp = parseInt($(e.currentTarget).attr('data-type'));
			$(e.currentTarget).attr('data-type', (tp>=4) ? 1 : tp+1);
		}
		p.transmuterCote = function(e)
		{
			tp = parseInt($(e.currentTarget).attr('data-type'));
			$(e.currentTarget).attr('data-type', (tp>=5) ? 1 : tp+1);
		}

		/**********************************************************/
		/*												 SETUP 													*/
		/**********************************************************/
		p.creerActions = function()
		{
			p.set.btnLoad.click(p.uploadConf);
			p.set.btnSave.click(p.downloadConf);
			p.set.btnDown.click(p.downloadSVG);
			p.set.zonechps.find('input').on('change', p.updateSVGView);

			p.set.elmRoot.on('click', '.coin', p.transmuterCoin);
			p.set.elmRoot.on('click', '.cote', p.transmuterCote);
		}
		/**
		 * Création de l'interface de l'application
		 */
		p.creerInterface = function()
		{
			var chp = {
				"document":	[
					["docw",				"Largeur doc."],
					["doch",				"Hauteur doc."],
				],
				"bois":	[
					["espaisseur",	"Epaisseur du bois"],
					["brulage",			"Compensation brûlage"],
					["strkwdth",		"Epaisseur de trait"],
					["mrgzone",			"Marge de base"],
				],
				"dessin": [
					["wcrans",			"Largeur des crans"],
					["courbure",		"Courbe couvercle"],
					["decalcourbe",	"Débord blocage couvercle"],
				],
				"options": [
					["autocrop",		"Recadrer doc", "checkbox"]
				],
				"listeelm": []
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
			
			$.each(chp, function(k,l){
				p.creerFieldSet(k,l).appendTo(p.set.zonechps);
			});
			
			p.set.zonechps.appendTo(cnf);

			//boutons
			var zonebtn = $('<div class="areabtn"></div>');
			p.set.btnLoad = $('<a href="#" class="loader">✏️ Charger</a>').appendTo(zonebtn);
			p.set.btnSave = $('<a href="#" class="saver">💾 Sauvegarder</a>').appendTo(zonebtn);
			p.set.btnDown = $('<a href="#" class="dwnld">🗺️ Télécharger</a>').appendTo(zonebtn);
			
			zonebtn.appendTo(cnf);

			p.set.elmRoot = cnf.find('.listeelm');
			
			cnf.appendTo($elm);
		}

		
		/**********************************************************/
		/*												 UTILS 													*/
		/**********************************************************/

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
				switch(f[2])
				{
					case 'checkbox':
						var fld = $('<label data-placeholder="'+f[1]+'" class="ischeck" ><input id="'+f[0]+'" type="checkbox"></label>');
						if(typeof p.set[f[0]] != undefined && p.set[f[0]]===true) {$(fld).find('input').prop('checked', true);}
					break;
					default:
						var fld = $('<label data-placeholder="'+f[1]+'" ><input id="'+f[0]+'" type="text"></label>');
						if(typeof p.set[f[0]] != undefined) {fld.find('input').val(p.set[f[0]]);}
					break;
				}
				fld.appendTo(grp);
			});
			return grp;
		}
		

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

