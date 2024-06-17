var conf = {};
var facteurMMvsPX = 1;


function initDrawBox()
{
	$('#ntrfs .conf input').on('change', valChanged);
	$('.downit').click(telechargerPlan);
	valChanged();
}

function telechargerPlan() 
{
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

function valChanged()
{
	$('input').each(function() {conf[$(this).attr('id')] = parseInt(facteurMMvsPX*$(this).val());})
	
	extdims = ($('#innerbox').is(':checked')) ? 2*conf.espaisseur : 0;
	conf['outlng'] = conf['inlng'] + extdims;
	conf['outlrg'] = conf['inlrg'] + extdims;
	conf['outhtr'] = conf['inhtr'] + conf.espaisseur;

	drawBox();

	$('#preview').attr({
		width: $('#docw').val()+'mm', 
		height: $('#doch').val()+'mm', 
		viewBox: '0 0 '+$('#docw').val()+' '+$('#doch').val(),
		'stroke-width': $('#strkwdth').val(),
	});
}


function drawBox()
{
	$('#preview *').remove();
	
	//dessiner bord gauche
	x0 = conf['mrgzone'];
	y0 = conf['mrgzone'];
	xm = x0;
	ym = y0;
	face1 = preparePart({x:x0, y:y0, w:conf.outhtr, h:conf.outlng, bords:4234, id:'face1'});
	
	//dessiner fond
	x0 += face1.elmw + conf.mrgzone;
	face2 = preparePart({x:x0, y:y0, w:conf.outlrg, h:conf.outlng, bords:4444, id:'face2'});
	
	//dessiner bord droite
	x0 += face2.elmw + conf.mrgzone;
	face3 = preparePart({x:x0, y:y0, w:conf.outhtr, h:conf.outlng, bords:3442, id:'face3'});
	
	//dessiner haut boite
	x0 += face3.elmw + conf.mrgzone;
	face4 = preparePart({x:x0, y:y0, w:conf.outlrg, h:conf.outlng, bords:3272, dekal:[0,0,conf.espaisseur,0], id:'face4'});
	
	ovrLrg = conf.outlrg-2*conf.decalcourbe-2*conf.courbure;
	dessinerCmd([
		'M'+(x0+conf.espaisseur+conf.decalcourbe)+','+(y0+conf.outlng+2*conf.espaisseur),
		'v -' + (conf.outlng+conf.espaisseur-conf.decalcourbe-conf.courbure),
		'q 0,-'+conf.courbure+' '+conf.courbure+',-'+conf.courbure,
		'h ' + ovrLrg,
		'q '+conf.courbure+',0 '+conf.courbure+','+conf.courbure,
		'v ' + (conf.outlng+conf.espaisseur-conf.decalcourbe-conf.courbure),
	]);
	
	//support du couvercle
	x0 += face4.elmw + conf.mrgzone;
	face5 = preparePart({x:x0, y:y0, w:conf.outlrg, h:conf.outlng, bords:7767, dekal:[0,0,conf.espaisseur,0], id:'face5'});
	ym = y0 + face4.elmh + conf.mrgzone + conf.espaisseur;

	x0 += face5.elmw + conf.mrgzone;
	face6 = preparePart({x:x0, y:y0, w:conf.outlrg, h:conf.outhtr, bords:1111, id:'face6'});
	
	y0 += face6.elmh + conf.mrgzone;
	face7 = preparePart({x:x0, y:y0, w:conf.outlrg, h:conf.outhtr, bords:7111, dekal:[-conf.espaisseur,0,0,0], id:'face7'});
	
	xm = x0 + face7.elmw + conf.mrgzone + conf.espaisseur;
	y0 += face7.elmh + conf.mrgzone + conf.espaisseur;
	ym = Math.max(ym, y0);
	
	if($('#innerbox').is(':checked'))
	{
		x0 = conf['mrgzone'];
		y0 = ym;
		
		inbox1 = preparePart({x:x0, y:y0, w:conf.inlng, h:conf.inhtr, bords:7272, id:'inbox1'});
		ym = y0 + inbox1.elmh + conf.mrgzone + conf.espaisseur;
		
		x0 += inbox1.elmw + conf.mrgzone;
		inbox2 = preparePart({x:x0, y:y0, w:conf.inlrg, h:conf.inhtr, bords:6464, id:'inbox2'});
		
		x0 += inbox2.elmw + conf.mrgzone;
		inbox3 = preparePart({x:x0, y:y0, w:conf.inlng, h:conf.inhtr, bords:7272, id:'inbox3'});
		
		x0 += inbox3.elmw + conf.mrgzone;
		inbox4 = preparePart({x:x0, y:y0, w:conf.inlrg, h:conf.inhtr, bords:6464, id:'inbox4'});
		
		xm = Math.max(xm, x0 + inbox4.elmw + conf.mrgzone + conf.espaisseur);
	}



	if($('#autocrop').is(':checked'))
	{
		$('#docw').val(xm);
		$('#doch').val(ym);

	}
	document.getElementById("preview").innerHTML += "";
	//console.log(face2);
}

/**
 * BORDS: hdbg
 * 1 -> cranté, début down/adjaçant down
 * 2 -> cranté, début down/adjaçant up
 * 3 -> cranté, début up/adjaçant down
 * 4 -> cranté, début up/adjaçant up
 * [variable dekal défini le recul, epaisseur par défaut]
 * 6 -> plat, adjaçant up
 * 7 -> plat, adjaçant down
 */
function preparePart(set)
{
	def = {print:true, id:'', cmd:[], elmw:0, elmh:0, dekal:[0,0,0,0]};
	set = $.extend({}, def, set);
	set.elmw = set.w;
	set.elmh = set.h;
	
	bordsX = String(set.bords).split('');

	switch(bordsX[0])
	{
		case '1' : set.cmd = ['M'+(set.x + conf.espaisseur)+','+(set.y + conf.espaisseur)]; break;
		case '2' : set.cmd = ['M'+set.x+','+(set.y + conf.espaisseur) ]; break;
		case '3' : set.cmd = ['M'+(set.x + conf.espaisseur)+','+set.y]; break;
		case '4' : set.cmd = ['M'+set.x+','+set.y]; break;
		case '6' : set.cmd = ['M'+set.x+','+(set.y + conf.espaisseur - set.dekal[0])]; break;
		case '7' : set.cmd = ['M'+(set.x + conf.espaisseur)+','+(set.y + conf.espaisseur - set.dekal[0])]; break;
	}
	//console.log(set.cmd);

	for(s=0; s<4; s++)
	{
		bordsX[s] = parseInt(bordsX[s]);
		lng = isEven(s) ? set.w : set.h;
		
		sside = (s>0) ? s-1 : 3;
		sup = (bordsX[s]<3 || bordsX[s]==7) ? 0 : 1;
		sdekal = set.dekal[sside];
		if(bordsX[sside]<5 && (bordsX[s]==2 || bordsX[s]==4 || bordsX[s]==6)) {sdekal += conf.espaisseur;}
		
		eside = (s<3) ? s+1 : 0;
		eup = (isEven(bordsX[eside])) ? 0 : 1;
		edekal = set.dekal[eside];
		if(bordsX[eside]==3 || bordsX[eside]==4) {edekal += conf.espaisseur;}


		if(bordsX[s]>5)
		{
			switch(s)
			{
				case 0: set.cmd.push('h '+(lng + sdekal + edekal)); break;
				case 1: set.cmd.push('v '+(lng + sdekal + edekal)); break;
				case 2: set.cmd.push('h '+(-lng - sdekal - edekal)); break;
				case 3: set.cmd.push('v '+(-lng - sdekal - edekal)); break;
			}
		}
		else
		{
			ncmd = creerLigneCrantee(
				lng,
				s,
				sup, 
				sdekal, 
				eup,
				edekal
			)
			set.cmd.push(ncmd);

			//console.log(set.id+' - '+s);
			//console.log(ncmd);
		}

		if(isOdd(s)) 
		{set.elmh+=conf.espaisseur}
		else
		{set.elmw+=conf.espaisseur}
	}

	if(set.print)
	{
		set.elm = $('<path d="'+set.cmd.join(' ')+'" fill="transparent" stroke="black" id="'+set.id+'" />');
		set.elm.appendTo('#preview');
		if(set.id!='') 
		{
			document.getElementById("preview").innerHTML += "";
			set.elmbox = $('#'+set.id)[0].getBBox();
		}
		
	}

	return set;
}

/**
 * sens 	-> 0 haut, 1 droite, 2 bas, 3 gauche
 * sup  	-> start up
 * eup 		-> end side up
 */
function creerLigneCrantee(lng, sens, sup, sdekal, eup, edekal)
{
	cmd = [];
	//calcul de la largeur des crans, pour la régularité
	crans = Math.floor(Math.abs(lng)/conf['wcrans']);
	if((sup==eup && isOdd(crans)) || (sup!=eup && isEven(crans)))
	{crans++;}
	wcrans = lng/crans;

	/**** preparation des commandes selon sens ****/
	//inversion horizontal/vertical
	cld = isEven(sens) ? 'hv'.split('') : 'vh'.split('');
	//on commence en up ou en down
	dir = (sup==1) ? -1 : 1;
	//sens de progression des axes selon la face
	mlt = {
		x: (sens<2) ? 1 : -1,
		y: (sens==1 || sens==2) ? 1 : -1
	};

	for(i=1; i<=crans; i++)
	{
		//coté adjacent up
		if(i==1)
		{cmd.push(cld[0] +' '+ (mlt.x * (wcrans + sdekal)));}
		else if(i==crans)
		{cmd.push(cld[0] +' '+ (mlt.x * (wcrans + edekal)));}
		else
		{
			cmd.push(cld[0] +' '+ (mlt.x * wcrans));
		}

		if(i<crans)
		{
			cmd.push(cld[1] +' '+ (mlt.y * dir * conf.espaisseur));
			dir*=-1;
		}
	}
	//console.log(cmd);
	return cmd.join(' ');
}

function dessinerCmd(cmd)
{
	elm = $('<path d="'+cmd.join(' ')+'" />');
	elm.appendTo('#preview');
}









function isENotNull(n) {return (n!=0 && n % 2 == 0);}
function isEven(n) {return n % 2 == 0;}
function isOdd(n) {return Math.abs(n % 2) == 1;}