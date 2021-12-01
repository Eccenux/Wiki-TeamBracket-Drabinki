function generuj()
{
	var el_sz = document.getElementById('pole_szablonu');

	var inps = document.getElementsByTagName('input');
	
	//
	// Liczba rund
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

	//
	// Tpl z liczby rund.
	//
	var txt = tplsTeamBracket[rd];
	if (typeof txt !== 'string') {
		alert(`
			Błąd! Szablon z tą liczbą rund (${rd}) nie jest obsługiwany.
			
			Napisz do mnie na [[User:Nux]], żeby dodał obsługę szablonu.
		`.replace(/\n\t*/g, '\n'));
		return false;
	}
	
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
			if (parseInt(score1.value)>parseInt(score2.value) || score1.value.search(/w\/?o/)==0)
			{
				team1.the_winner = 1;
				score1.the_winner = 1;
			}
			else if (parseInt(score1.value)<parseInt(score2.value) || score2.value.search(/w\/?o/)==0)
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
	
	// spr. szablonu
	if (txt.search(/\{\{64TeamBracket/i) >= 0) {
		alert(
			'Uwaga! Używanie 64TeamBracket jest niezalecane (jest za szeroka i za wysoka).'
			+'\n\nLepiej opisz pierwszą rundę osobno, albo podziel rozgrywki na dwie drabinki.'
		);
	}

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
		let id = inps[i].id;	// id = parameter name (e.g. RD1-seed01)
		let isHeader = id.search(/^RD[0-9]+$/) === 0;
		
		// match parameter + value
		re = new RegExp(id+'[ ]*=[ ]*(.+)');
		let matches = txt.match(re);
		if (matches==null)
		{
			continue;
		}
		val = matches[1];
		
		//console.log({id:id, val:val});
		// usuwanie spacji (trim)
		val = val.replace(/[ \t]*$/,'').replace(/^[ \t]*/,'');
		// i boldów
		if (!isHeader)
		{
			val = val.replace(/'''/g,'');
		}
		
		if (val=='')
		{
			continue;
		}
		// flaga
		if (id.indexOf('seed')>0 && val.indexOf('{')!=-1)
		{
			val = val.replace(/\{\{Flaga\|(.*)\}\}/i,'$1');
		}
		// zawodnik (usuń linki jeśli są)
		else if (id.indexOf('team')>0 && val.indexOf('[')!=-1)
		{
			val = val.replace(/^\[\[([^|\]]*)\]\]$/,'$1');
		}
		
		inps[i].value=val;
	}
	
	//
	// Porządki
	//
	// rounds count
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
