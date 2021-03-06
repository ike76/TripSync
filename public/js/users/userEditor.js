const userEditor = (function() {

	const userForm = () => {
		const user = store.currentUser._id && store.currentUser

		const userImageDisplay = title => {
			return `<div class='carousel-cell' id="${title} "imgName='${title}'>
							<img src='/avatars/${title}' >
						</div>`
		}
		let html = `
			<form class="newUserForm">
				<div class='form-group' style="grid-area: firstName;">
					<label for='firstName'> First Name </label>
					<input type='text' id='firstName' class='form-control' required value="${user?user.firstName:''}">
				</div>
				<div class='form-group' style="grid-area: lastName;">
					<label for='lastName'> Last Name </label>
					<input type='text' id='lastName' class='form-control' value="${user?user.lastName:''}" required>
				</div>
				<div class='form-group' style="grid-area: email;">
					<label for='email'> Email </label>
					<input type='email' id='email' class='form-control' value="${user?user.email:''}" required>
				</div>
				<div class='form-group' style="grid-area: save;">
					<button type="submit" class='btn btn-sm btn-success ${user?'updateUserButton':'submitNewUserButton'}'>${user?'UPDATE':'SAVE'}</button>
				</div>
				<div style="grid-area: avatar; width: 250px;">
					<div id='avatarChooser' >
						${store.avatars.map( title => userImageDisplay(title) ).join('') }
					</div>
				</div>
				<div class="avatarNameDisplay">
					<p><span id="displayFirstName">${user?user.firstName:''}</span> 
					<span id="displayLastName">${user?user.lastName:''}</span></p>
				</div>
			</form>`
		if (user) {
			html += `
			<hr>
			<h2>${user.firstName} ${user.lastName}'s Travel:</h2>
			${formatMyLegs()}
			<button class='btn' id='removeUser' userId='${user._id}'> delete ${user.firstName} ${user.lastName}</button>`
		}
		return html
	}
	const myLegs = () => {
		const myLegsObj = {}
		store.trips.forEach(trip => {
			myLegsObj[trip.name] = trip.tripLegs.filter(leg => leg.travelers.find(trav => trav._id === store.currentUser._id))
		})
		return myLegsObj;
	}
	const formatMyLegs = () => {
		const transport = {
			Flight: `<i class="fas fa-plane"></i>`,
			Ground: `<i class="fas fa-car"></i>`,
			Other: `<i class="fas fa-arrow-right"></i>`
		}

		const keys = Object.keys(myLegs())
		let html = '<div class="userLegsGrid">'
		html += keys.map(key => {
			const tripName = key
			let tripHtml = `<h3 class="tripNameSmall"> ${ tripName.toUpperCase() } </h3>`
			if (myLegs()[key].length) {
				tripHtml += myLegs()[key].map(leg => `
					${transport[leg.type]}
					${moment(leg.startMoment).format('MMM Do h:mm a')}
					<a href="#!" class='linkLegFromUser' legId="${leg._id}">
					 ${leg.company} ${leg.flightNum} </a>
					${leg.startLoc.name} <i class="fas fa-arrow-right"></i> ${leg.endLoc.name} 
					`).join('')
			} else {
				tripHtml += `<li class='legFromUser'> no plans this trip </li>`
			}
			return tripHtml;
		}).join('')
		html += '</div>'
		return html
	}
	const render = () => {
		$('#displayFirstName').text('')
		$('#displayLastName').text('')
		$('.rightSide').html(userForm())
		$('#avatarChooser').flickity({
			cellAlign: 'center',
			pageDots: false,
			wrapAround: true
		});
		const avatarIndex = store.avatars.indexOf(store.currentUser && store.currentUser.avatar)
		$('#avatarChooser').flickity('selectCell', avatarIndex)
		$('#firstName').on('keyup', handlers.autoFillFirstName)
		$('#lastName').on('keyup', handlers.autoFillLastName)


		function putUserInfoIntoStore() {
			store.currentUser.avatar = $('#avatarChooser .is-selected').attr('imgname')
			store.currentUser.firstName = $('#firstName').val()
			store.currentUser.lastName = $('#lastName').val()
			store.currentUser.email = $('#email').val()

		}
		$('.submitNewUserButton').click(function(e) {
			e.preventDefault()
			putUserInfoIntoStore()
			$('#firstName').val('')
			$('#lastName').val('')
			$('#email').val('')
			handlers.addNewUser()
		})
		$('.updateUserButton').click(function(e) {
			e.preventDefault()
			putUserInfoIntoStore()
			handlers.updateUser()
		})
	}
	return {
		render,
		formatMyLegs,
	}
})()