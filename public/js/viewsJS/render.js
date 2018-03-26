const render = (function(){

	function displayTrip(trip){
		if (trip) {  console.log('trip is' , trip) 
			let html =  `<div class="card" style="max-width: 18rem;">
									<h5 class="card-title card-header">
										 <a href="#!"><div class="viewTrip" tripId="${trip._id}">${trip.name}</div></a>
									</h5>
									<div class="card-body">
										<h6 class="card-subtitle mb-2 text-muted">`
			if(trip.timeRange.start < Infinity && trip.timeRange.end > -Infinity ) {
				html += `${moment(trip.timeRange.start).format('MMM Do')} - ${moment(trip.timeRange.end).format('MMM Do')}</h6>`
			}  
										html += `
										<div class="list">`
								trip.tripLegs.forEach((leg, i)=> {
									html +=	`<span class="list-inline-item">${leg.endLoc.city || leg.endLoc.cityLong || leg.endLoc.state }</span>`
									if (i < trip.tripLegs.length - 1) html += `<span class="list-inline-item">	・</span>`
								})
								html +=	`</div>
									</div>
								</div>`
								return html;
							}
		else displayTripForm();
	}
	function displayTripForm(){
		return `<div class="card" style="max-width: 18rem;">
					<div class="card-title card-header"> 
						<input class="form-control" type="text" id="tripName" name="name" placeholder="New Trip Name" >
					</div>
					<div class="card-body">
						<button class="btn btn-success" id="newTripButton" type="submit">Create New Trip</button>
					</div>
				</div> `
	}
	const locToggle = (leg , side)=>{
		// side is either 'start' or 'end'
		// if you pass in a leg, it assumes you want to keep it as is.  if no leg, then you get the google box.
		if (Object.keys(leg).length) {
			return `<p> <strong>${side==='start' ? leg.startLoc.name : leg.endLoc.name }</strong> -
			 ${side === 'start' ? leg.startLoc.address : leg.endLoc.address} 
			 <a href="#!" class='btn btn-sm btn-success changeLoc ${side}'>Change</a></p>`
		}
		else return `<input class="form-control" type="text" id="${side}Loc" name="${side}Loc">`
	}
	const legForm = (legId)=>{
		const leg = store.trips.current.tripLegs.find(tripLeg => tripLeg._id === legId) || {}
		console.log('current leg->', leg)
		let html = `
		<h1>Add Leg</h1>
			<form action="#" method="POST" id="addLegForm">
			    <div class="row">
			        <div class="col-8">
			            <div class="form-group">
			                <label for="type">Type</label>
			                <select class="form-control" id="type" name="type">`
			                store.legTypes.forEach(opt=>{
			                	html += `<option value='${opt}' ${leg.type === opt ? 'selected' : ''}> ${opt} </option>`
			                })
			             html +=   `</select>
			            </div>
			        </div>
			        <div class="col-4">
			            <div class="typeIcon"></div>
			        </div>
			    </div>
			    <div class="row">
			        <div class="col">
			            <div class="form-group">
			                <label for="company">Company</label>
			                <select class="form-control" id="company" name="company">
		`
		// fill this out with airline logos, etc.
		store.airlines.forEach(airline=> {
			html += `<option value="${airline.name}" ${leg.company === airline.name ? 'selected' : ''}>${airline.name}</option>`
		})
		html += `
			                </select>
			            </div>
			        </div>
			        <div class="col">
			            <div class="form-group">
			                <label for="flightNum">Number</label>
			                <input class="form-control" type="text" id="flightNum" name="flightNum" value="${leg.flightNum || ''}">
			            </div>
			        </div>
			    </div>
			    <hr>
			    <div class="row">
			        <div class="col">
			            <div class="form-group">
			                <label for="startDate">Departure Date</label>
			                <input class="form-control" type="date" id="startDate" name="startDate" value=${moment(leg.startTime).format('YYYY-MM-DD') || ''} >
			            </div>
			        </div>
			        <div class="col">
			            <div class="form-group">
			                <label for="startTime">Departure Time</label>
			                <input class="form-control" type="time" id="startTime" name="startTime" value=${moment(leg.startTime).format('HH:MM') || ''} >
			            </div>
			        </div>
			    </div>
			    <div class="form-group">
	                <label for="startLoc">Departure Location</label><div class='startLocSwap'>`
	                html += locToggle(leg, 'start')
		html += `</div></div>
			    <hr>
			    <div class="row">
			        <div class="col">
			            <div class="form-group">
			                <label for="endDate">Arrival Date</label>
			                <input class="form-control" type="date" id="endDate" name="endDate" value=${moment(leg.endTime).format('YYYY-MM-DD') || ''}>
			            </div>
			        </div>
			        <div class="col">
			            <div class="form-group">
			                <label for="endTime">Arrival Time</label>
			                <input class="form-control" type="time" id="endTime" name="endTime" value=${moment(leg.endTime).format('HH:MM') || ''}>
			            </div>
			        </div>
			    </div>
			    <div class="form-group">
	                <label for="endLoc">Arrival Location</label><div class='endLocSwap'>`
	                html += locToggle(leg, 'end')
	       html+= `
	            </div></div>
			    <h3>Travelers</h3>
		`
// add all my travelers here when i get some
	html +=		` <div class="form-check">
			        <input class="form-check-input travCheckBox" type="checkbox" name="travelers" id="5a99ae8393434693a7acbdf2" value="5a99ae8393434693a7acbdf2">
			        <label class="form-check-label" for="5a99ae8393434693a7acbdf2">ChayeBay Eichenberger</label>
			    </div>`
	html +=		` <div class="form-check">
			        <input class="form-check-input travCheckBox" type="checkbox" name="travelers" id="testing1" value="testing1">
			        <label class="form-check-label" for="testing1">test1</label>
			    </div>`
	html +=		` <div class="form-check">
			        <input class="form-check-input travCheckBox" type="checkbox" name="travelers" id="testing2" value="testing2">
			        <label class="form-check-label" for="testing2">test2</label>
			    </div>`

	html +=		`
			            <input type="submit" class="btn btn-success" id="saveLeg" tripId="${store.trips.current._id}" value="SAVE">
			</form>`
		return html;
	}



	const trips = () => {
		store.setTimeRanges()
// start section
		let html = `<section class="d-flex flex-row justify-content-around  " >`
		if (store.trips.maxIndex > 1) html += `<button class="btn btn-outline-success btn-sm my-5" id="prevTrips"> <i class="fas fa-arrow-left"></i> </button>`
// add cards for trips
		// html += displayTrip(store.trips[store.trips.maxIndex - 2])
		store.trips.maxIndex === 1 ? html += displayTripForm() : html += displayTrip(store.trips[store.trips.maxIndex - 2])
		if (store.trips[store.trips.maxIndex - 1]) html += displayTrip(store.trips[store.trips.maxIndex - 1])
		if (store.trips[store.trips.maxIndex]) html += displayTrip(store.trips[store.trips.maxIndex])
// close off section
			if (store.trips.maxIndex < store.trips.length - 1) html += `<button class="btn btn-outline-success btn-sm my-5" id="nextTrips"> <i class="fas fa-arrow-right"></i> </button>`
			html += `</section>`
		
		$('.topRow').html(html)
	}
	const showTrip = trip => {
		let html = `<h1> ${trip.name} </h1>`
		html += `<button href="#!" class="addLegToTrip btn btn-outline-success mx-3" > add Leg </button>`
		html += `<button href="#!" class="addEventToTrip btn btn-outline-success mx-3" > add Event </button>`
		html += '<h3> Trip Legs: </h3>'
		html += '<ul>'
		trip.tripLegs.forEach(leg=>{
			html += `<li><a href="#!" class='updateLeg' legId='${leg._id}'>${leg.startLoc.name} -> ${leg.endLoc.name}</a></li>`
		})
		html += '</ul>'
		return html;
	}
	

	return {
		trips, showTrip, legForm, locToggle
	}
})()