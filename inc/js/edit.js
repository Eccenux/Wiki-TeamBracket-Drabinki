function generuj()
{
	var el_sz = document.getElementById('pole_szablonu');

	var inps = document.getElementsByTagName('input');
	
	//
	// Ilość rund
	//
	var rd=0;
	var rdRe = /^RD([0-9]+)$/;
	for (var i=0; i<inps.length; i++)
	{
		var m = rdRe.exec(inps[i].id);
		if (m && inps[i].value!='')
			if (rd < m[1])	rd = m[1];
		else
			break;
	}
	var txt = szablon[rd];
	
	//
	// Zwycięstwa
	//
	var tmp;
	var team1,team2,score1,score2;
	var team_nr=2;
	
	for (; rd; rd--)
	{
		for (var nr=1; nr<=team_nr; nr++)
		{
			tmp=(nr<10) ? '0'+nr : nr;
			team1 = document.getElementById('RD'+rd+'-team'+tmp);
			score1 = document.getElementById('RD'+rd+'-score'+tmp);
			nr++;
			tmp=(nr<10) ? '0'+nr : nr;
			team2 = document.getElementById('RD'+rd+'-team'+tmp);
			score2 = document.getElementById('RD'+rd+'-score'+tmp);
			//txt = score1.value+'>'+ score2.value + '? = '+(parseInt(score1.value)>parseInt(score2.value))+'\n' + txt;
			if (parseInt(score1.value)>parseInt(score2.value) || score1.value.indexOf('wo')==0)
			{
				team1.the_winner = 1;
				score1.the_winner = 1;
			}
			else if (parseInt(score1.value)<parseInt(score2.value) || score2.value.indexOf('wo')==0)
			{
				team2.the_winner = 1;
				score2.the_winner = 1;
			}
		}
		team_nr*=2;
	}
	
	var re,val;
	for (var i=0; i<inps.length; i++)
	{
		re = new RegExp('('+inps[i].id+')[ ]*=[ ]*');
		val=inps[i].value.replace(/[ \t]*$/,'').replace(/^[ \t]*/,'');
		if (val=='')
		{
			continue;
		}
		// flaga
		if (inps[i].id.indexOf('seed')>0 && val.indexOf('{')==-1)
		{
			val = '{{Flaga|'+val+'}}';
		}
		// zawodnik
		else if (inps[i].id.indexOf('team')>0 && val.indexOf('[')==-1)
		{
			val = '[['+val+']]';
		}
		
		if (inps[i].the_winner)
		{
			val = '\'\'\''+val+'\'\'\'';
		}
		
		txt=txt.replace(re,'$1 = '+val);
	}
	
	el_sz.value = txt;
}

function pobierz()
{
	var el_sz = document.getElementById('pole_szablonu');
	var txt = el_sz.value;
	var inps = document.getElementsByTagName('input');

	//
	// czyszczenie nazw rund
	//
	var rdRe = /^RD([0-9]+)$/;
	for (var i=0; i<inps.length; i++)
	{
		var m = rdRe.exec(inps[i].id);
		if (m && inps[i].value!='')
			inps[i].value='';
		else
			break;
	}

	//
	// pobieranie
	//
	var re,val;
	for (var i=0; i<inps.length; i++)
	{
		re = new RegExp(inps[i].id+'[ ]*=[ ]*(.+)');
		val = txt.match(re);
		if (val==null)
		{
			continue;
		}
		// usuwanie spacji i boldów
		val = val[1].replace(/[ \t]*$/,'').replace(/^[ \t]*/,'').replace(/'''/g,'');
		
		if (val=='')
		{
			continue;
		}
		// flaga
		if (inps[i].id.indexOf('seed')>0 && val.indexOf('{')!=-1)
		{
			val = val.replace(/\{\{Flaga\|(.*)\}\}/,'$1');
		}
		// zawodnik
		else if (inps[i].id.indexOf('team')>0 && val.indexOf('[')!=-1)
		{
			val = val.replace(/\[\[([^|\]]*)\]\]/,'$1');
		}
		
		inps[i].value=val;
	}
	
	//
	// Porządki
	//
	var rd=0;
	var rdRe = /^RD([0-9]+)$/;
	for (var i=0; i<inps.length; i++)
	{
		var m = rdRe.exec(inps[i].id);
		if (m)
			if (rd < m[1])	rd = m[1];
		else
			break;
	}

	var tmp, m;
	var flaga,team,score;
	var team_nr=2;
	var flagaRe = /\{\{Flaga\|([^}\n]+)\}\}\s*/i;
	for (; rd; rd--)
	{
		for (var nr=1; nr<=team_nr; nr++)
		{
			tmp=(nr<10) ? '0'+nr : nr;
			flaga = document.getElementById('RD'+rd+'-seed'+tmp);
			team = document.getElementById('RD'+rd+'-team'+tmp);
			score = document.getElementById('RD'+rd+'-score'+tmp);
			// przepisanie flagi na właściwe miejsce
			if (m = flagaRe.exec(team.value))
			{
				flaga.value = m[1];
				team.value = team.value.replace(flagaRe,'');
			}
		}
		team_nr*=2;
	}	
}
var szablon = new Array();

//
// 5 rund (32 zawodników)
szablon[5] ="\
{{32TeamBracket\n\
| RD1 =\n\
| RD2 =\n\
| RD3 =\n\
| RD4 =\n\
| RD5 =\n\
\n\
|  RD1-seed01 =\n\
|  RD1-team01 =\n\
| RD1-score01 =\n\
|  RD1-seed02 =\n\
|  RD1-team02 =\n\
| RD1-score02 =\n\
|  RD1-seed03 =\n\
|  RD1-team03 =\n\
| RD1-score03 =\n\
|  RD1-seed04 =\n\
|  RD1-team04 =\n\
| RD1-score04 =\n\
|  RD1-seed05 =\n\
|  RD1-team05 =\n\
| RD1-score05 =\n\
|  RD1-seed06 =\n\
|  RD1-team06 =\n\
| RD1-score06 =\n\
|  RD1-seed07 =\n\
|  RD1-team07 =\n\
| RD1-score07 =\n\
|  RD1-seed08 =\n\
|  RD1-team08 =\n\
| RD1-score08 =\n\
|  RD1-seed09 =\n\
|  RD1-team09 =\n\
| RD1-score09 =\n\
|  RD1-seed10 =\n\
|  RD1-team10 =\n\
| RD1-score10 =\n\
|  RD1-seed11 =\n\
|  RD1-team11 =\n\
| RD1-score11 =\n\
|  RD1-seed12 =\n\
|  RD1-team12 =\n\
| RD1-score12 =\n\
|  RD1-seed13 =\n\
|  RD1-team13 =\n\
| RD1-score13 =\n\
|  RD1-seed14 =\n\
|  RD1-team14 =\n\
| RD1-score14 =\n\
|  RD1-seed15 =\n\
|  RD1-team15 =\n\
| RD1-score15 =\n\
|  RD1-seed16 =\n\
|  RD1-team16 =\n\
| RD1-score16 =\n\
|  RD1-seed17 =\n\
|  RD1-team17 =\n\
| RD1-score17 =\n\
|  RD1-seed18 =\n\
|  RD1-team18 =\n\
| RD1-score18 =\n\
|  RD1-seed19 =\n\
|  RD1-team19 =\n\
| RD1-score19 =\n\
|  RD1-seed20 =\n\
|  RD1-team20 =\n\
| RD1-score20 =\n\
|  RD1-seed21 =\n\
|  RD1-team21 =\n\
| RD1-score21 =\n\
|  RD1-seed22 =\n\
|  RD1-team22 =\n\
| RD1-score22 =\n\
|  RD1-seed23 =\n\
|  RD1-team23 =\n\
| RD1-score23 =\n\
|  RD1-seed24 =\n\
|  RD1-team24 =\n\
| RD1-score24 =\n\
|  RD1-seed25 =\n\
|  RD1-team25 =\n\
| RD1-score25 =\n\
|  RD1-seed26 =\n\
|  RD1-team26 =\n\
| RD1-score26 =\n\
|  RD1-seed27 =\n\
|  RD1-team27 =\n\
| RD1-score27 =\n\
|  RD1-seed28 =\n\
|  RD1-team28 =\n\
| RD1-score28 =\n\
|  RD1-seed29 =\n\
|  RD1-team29 =\n\
| RD1-score29 =\n\
|  RD1-seed30 =\n\
|  RD1-team30 =\n\
| RD1-score30 =\n\
|  RD1-seed31 =\n\
|  RD1-team31 =\n\
| RD1-score31 =\n\
|  RD1-seed32 =\n\
|  RD1-team32 =\n\
| RD1-score32 =\n\
\n\
|  RD2-seed01 =\n\
|  RD2-team01 =\n\
| RD2-score01 =\n\
|  RD2-seed02 =\n\
|  RD2-team02 =\n\
| RD2-score02 =\n\
|  RD2-seed03 =\n\
|  RD2-team03 =\n\
| RD2-score03 =\n\
|  RD2-seed04 =\n\
|  RD2-team04 =\n\
| RD2-score04 =\n\
|  RD2-seed05 =\n\
|  RD2-team05 =\n\
| RD2-score05 =\n\
|  RD2-seed06 =\n\
|  RD2-team06 =\n\
| RD2-score06 =\n\
|  RD2-seed07 =\n\
|  RD2-team07 =\n\
| RD2-score07 =\n\
|  RD2-seed08 =\n\
|  RD2-team08 =\n\
| RD2-score08 =\n\
|  RD2-seed09 =\n\
|  RD2-team09 =\n\
| RD2-score09 =\n\
|  RD2-seed10 =\n\
|  RD2-team10 =\n\
| RD2-score10 =\n\
|  RD2-seed11 =\n\
|  RD2-team11 =\n\
| RD2-score11 =\n\
|  RD2-seed12 =\n\
|  RD2-team12 =\n\
| RD2-score12 =\n\
|  RD2-seed13 =\n\
|  RD2-team13 =\n\
| RD2-score13 =\n\
|  RD2-seed14 =\n\
|  RD2-team14 =\n\
| RD2-score14 =\n\
|  RD2-seed15 =\n\
|  RD2-team15 =\n\
| RD2-score15 =\n\
|  RD2-seed16 =\n\
|  RD2-team16 =\n\
| RD2-score16 =\n\
\n\
|  RD3-seed01 =\n\
|  RD3-team01 =\n\
| RD3-score01 =\n\
|  RD3-seed02 =\n\
|  RD3-team02 =\n\
| RD3-score02 =\n\
|  RD3-seed03 =\n\
|  RD3-team03 =\n\
| RD3-score03 =\n\
|  RD3-seed04 =\n\
|  RD3-team04 =\n\
| RD3-score04 =\n\
|  RD3-seed05 =\n\
|  RD3-team05 =\n\
| RD3-score05 =\n\
|  RD3-seed06 =\n\
|  RD3-team06 =\n\
| RD3-score06 =\n\
|  RD3-seed07 =\n\
|  RD3-team07 =\n\
| RD3-score07 =\n\
|  RD3-seed08 =\n\
|  RD3-team08 =\n\
| RD3-score08 =\n\
\n\
|  RD4-seed01 =\n\
|  RD4-team01 =\n\
| RD4-score01 =\n\
|  RD4-seed02 =\n\
|  RD4-team02 =\n\
| RD4-score02 =\n\
|  RD4-seed03 =\n\
|  RD4-team03 =\n\
| RD4-score03 =\n\
|  RD4-seed04 =\n\
|  RD4-team04 =\n\
| RD4-score04 =\n\
\n\
|  RD5-seed01 =\n\
|  RD5-team01 =\n\
| RD5-score01 =\n\
|  RD5-seed02 =\n\
|  RD5-team02 =\n\
| RD5-score02 =\n\
}}\
";

//
// 4 rundy (16 zawodników)
szablon[4] ="\
{{16TeamBracket\n\
| RD1 =\n\
| RD2 =\n\
| RD3 =\n\
| RD4 =\n\
\n\
|  RD1-seed01 =\n\
|  RD1-team01 =\n\
| RD1-score01 =\n\
|  RD1-seed02 =\n\
|  RD1-team02 =\n\
| RD1-score02 =\n\
|  RD1-seed03 =\n\
|  RD1-team03 =\n\
| RD1-score03 =\n\
|  RD1-seed04 =\n\
|  RD1-team04 =\n\
| RD1-score04 =\n\
|  RD1-seed05 =\n\
|  RD1-team05 =\n\
| RD1-score05 =\n\
|  RD1-seed06 =\n\
|  RD1-team06 =\n\
| RD1-score06 =\n\
|  RD1-seed07 =\n\
|  RD1-team07 =\n\
| RD1-score07 =\n\
|  RD1-seed08 =\n\
|  RD1-team08 =\n\
| RD1-score08 =\n\
|  RD1-seed09 =\n\
|  RD1-team09 =\n\
| RD1-score09 =\n\
|  RD1-seed10 =\n\
|  RD1-team10 =\n\
| RD1-score10 =\n\
|  RD1-seed11 =\n\
|  RD1-team11 =\n\
| RD1-score11 =\n\
|  RD1-seed12 =\n\
|  RD1-team12 =\n\
| RD1-score12 =\n\
|  RD1-seed13 =\n\
|  RD1-team13 =\n\
| RD1-score13 =\n\
|  RD1-seed14 =\n\
|  RD1-team14 =\n\
| RD1-score14 =\n\
|  RD1-seed15 =\n\
|  RD1-team15 =\n\
| RD1-score15 =\n\
|  RD1-seed16 =\n\
|  RD1-team16 =\n\
| RD1-score16 =\n\
\n\
|  RD2-seed01 =\n\
|  RD2-team01 =\n\
| RD2-score01 =\n\
|  RD2-seed02 =\n\
|  RD2-team02 =\n\
| RD2-score02 =\n\
|  RD2-seed03 =\n\
|  RD2-team03 =\n\
| RD2-score03 =\n\
|  RD2-seed04 =\n\
|  RD2-team04 =\n\
| RD2-score04 =\n\
|  RD2-seed05 =\n\
|  RD2-team05 =\n\
| RD2-score05 =\n\
|  RD2-seed06 =\n\
|  RD2-team06 =\n\
| RD2-score06 =\n\
|  RD2-seed07 =\n\
|  RD2-team07 =\n\
| RD2-score07 =\n\
|  RD2-seed08 =\n\
|  RD2-team08 =\n\
| RD2-score08 =\n\
\n\
|  RD3-seed01 =\n\
|  RD3-team01 =\n\
| RD3-score01 =\n\
|  RD3-seed02 =\n\
|  RD3-team02 =\n\
| RD3-score02 =\n\
|  RD3-seed03 =\n\
|  RD3-team03 =\n\
| RD3-score03 =\n\
|  RD3-seed04 =\n\
|  RD3-team04 =\n\
| RD3-score04 =\n\
\n\
|  RD4-seed01 =\n\
|  RD4-team01 =\n\
| RD4-score01 =\n\
|  RD4-seed02 =\n\
|  RD4-team02 =\n\
| RD4-score02 =\n\
}}\
";
