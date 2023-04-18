class EdytorDrabinki {
	constructor() {
		/**
		 * Zmiana flag na rozstawienie.
		 */
		this.flagiRozstawienia = false;
	}

	generuj() {
		var el_sz = document.getElementById('pole_szablonu');

		var inps = document.getElementsByTagName('input');

		//
		// Liczba rund
		//
		var rd = 0;
		var rdRe = /^RD([0-9]+)$/;
		for (var i = 0; i < inps.length; i++) {
			var m = rdRe.exec(inps[i].id);
			if (m && inps[i].value != '')
				if (rd < m[1]) rd = m[1];
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
		var team1, team2, score1, score2;
		var team_nr = 2;

		for (; rd; rd--) {
			for (var nr = 1; nr <= team_nr; nr++) {
				let tmp = (nr < 10) ? '0' + nr : nr;
				team1 = document.getElementById('RD' + rd + '-team' + tmp);
				score1 = document.getElementById('RD' + rd + '-score' + tmp);
				nr++;
				tmp = (nr < 10) ? '0' + nr : nr;
				team2 = document.getElementById('RD' + rd + '-team' + tmp);
				score2 = document.getElementById('RD' + rd + '-score' + tmp);
				//txt = score1.value+'>'+ score2.value + '? = '+(parseInt(score1.value)>parseInt(score2.value))+'\n' + txt;
				if (parseInt(score1.value) > parseInt(score2.value) || score1.value.search(/w\/?o/) == 0) {
					team1.the_winner = 1;
					score1.the_winner = 1;
				} else if (parseInt(score1.value) < parseInt(score2.value) || score2.value.search(/w\/?o/) == 0) {
					team2.the_winner = 1;
					score2.the_winner = 1;
				}
			}
			team_nr *= 2;
		}

		var re, val;
		for (let i = 0; i < inps.length; i++) {
			const parameter = inps[i].id;
			const parameterRe = this.idToParameterRe(parameter);
			re = new RegExp('(' + parameterRe + ')[ ]*=[ ]*');
			val = inps[i].value.replace(/[ \t]*$/, '').replace(/^[ \t]*/, '');
			if (val == '') {
				continue;
			}
			if (this.flagiRozstawienia) {
				// flaga
				if (parameter.indexOf('seed') > 0 && val.indexOf('{') == -1) {
					val = '{{Flaga|' + val + '}}';
				}
				// zawodnik
				else if (parameter.indexOf('team') > 0 && val.indexOf('[') == -1) {
					val = '[[' + val + ']]';
				}
			}

			if (inps[i].the_winner) {
				val = '\'\'\'' + val + '\'\'\'';
			}

			txt = txt.replace(re, '$1 = ' + val);
		}

		el_sz.value = txt;
	}

	/**
	 * Input id to paramter RegExp.
	 * @param {String} parameter Input id. Ids are the same as the parmater name e.g. RD4-seed01
	 * @returns Paramter name matcher for wikicode.
	 */
	idToParameterRe(parameter) {
		// allow matching both *-seed01 and *-seed1 etc (for bracket 8 and below)
		const parameterRe = parameter.replace(/(.+[a-z])[0]*([0-9])$/, '$10?$2');

		return parameterRe;
	}

	pobierz() {
		var el_sz = document.getElementById('pole_szablonu');
		var txt = el_sz.value;
		var inps = document.getElementsByTagName('input');

		// spr. szablonu
		if (txt.search(/\{\{64TeamBracket/i) >= 0) {
			alert(
				'Uwaga! Używanie 64TeamBracket jest niezalecane (jest za szeroka i za wysoka).' +
				'\n\nLepiej opisz pierwszą rundę osobno, albo podziel rozgrywki na dwie drabinki.'
			);
		}

		//
		// czyszczenie nazw rund
		//
		var rdRe = /^RD([0-9]+)$/;
		for (var i = 0; i < inps.length; i++) {
			var m = rdRe.exec(inps[i].id);
			if (m && inps[i].value != '')
				inps[i].value = '';
			else
				break;
		}

		//
		// pobieranie
		//
		var re, val;
		for (let i = 0; i < inps.length; i++) {
			const parameter = inps[i].id; // id = parameter name (e.g. RD1-seed01)
			const isHeader = parameter.search(/^RD[0-9]+$/) === 0;

			// match parameter + value
			const parameterRe = this.idToParameterRe(parameter);
			re = new RegExp(parameterRe + '[ ]*=[ ]*(.+)');
			let matches = txt.match(re);
			if (matches == null) {
				continue;
			}
			val = matches[1];

			//console.log({parameter:parameter, val:val});
			// usuwanie spacji (trim)
			val = val.replace(/[ \t]*$/, '').replace(/^[ \t]*/, '');
			// i boldów
			if (!isHeader) {
				val = val.replace(/'''/g, '');
			}

			if (val == '') {
				continue;
			}
			if (this.flagiRozstawienia) {
				// flaga
				if (parameter.indexOf('seed') > 0 && val.indexOf('{') != -1) {
					val = val.replace(/\{\{Flaga\|(.*)\}\}/i, '$1');
				}
				// zawodnik (usuń linki jeśli są)
				else if (parameter.indexOf('team') > 0 && val.indexOf('[') != -1) {
					val = val.replace(/^\[\[([^|\]]*)\]\]$/, '$1');
				}
			}

			inps[i].value = val;
		}

		//
		// Porządki
		//
		if (this.flagiRozstawienia) {
			let rd = this.liczbaRund(inps);
			this.pobierzFlagiDoRozstawienia(rd);
		}
	}
	/**
	 * Liczba rund w drabince.
	 */
	liczbaRund(inps) {
		var rd = 0;
		var rdRe = /^RD([0-9]+)$/;
		for (let i = 0; i < inps.length; i++) {
			let m = rdRe.exec(inps[i].id);
			if (m)
				if (rd < m[1]) rd = m[1];
				else
					break;
		}
		return rd;
	}

	/**
	 * Wyciąganięcie flagi z pola gracza (team) do rozstawienia (seed).
	 */
	pobierzFlagiDoRozstawienia(rd) {
		var m;
		var flaga, team;
		var team_nr = 2;
		var flagaRe = /\{\{Flaga\|([^}\n]+)\}\}\s*/i;
		for (; rd; rd--) {
			for (var nr = 1; nr <= team_nr; nr++) {
				let tmp = (nr < 10) ? '0' + nr : nr;
				flaga = document.getElementById('RD' + rd + '-seed' + tmp);
				team = document.getElementById('RD' + rd + '-team' + tmp);
				// przepisanie flagi na właściwe miejsce
				// eslint-disable-next-line no-cond-assign
				if (m = flagaRe.exec(team.value)) {
					flaga.value = m[1];
					team.value = team.value.replace(flagaRe, '');
				}
			}
			team_nr *= 2;
		}
	}

}