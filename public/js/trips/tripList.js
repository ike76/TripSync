
const tripList = {
	icons: {"Flight": 'plane', "Ground": 'car', "Other": 'dot-circle'},
	dateRange: (trip)=>{
		return (trip.timeRange.startTime !== Infinity) ? `${moment(trip.timeRange.startTime).format('MMM D')} - ${moment(trip.timeRange.endTime).format('MMM D')}` : 'no dates yet'
	},
	render: function(){
			store.sortTrips()

		const _legs = trip => trip.tripLegs.map( leg => `
			<article class='legListItem'>
				<i class=" legLogo fas fa-${this.icons[leg.type]}"></i>
				${leg.startLoc.city || leg.startLoc.cityLong || leg.startLoc.state || 'origin' } 
				<i class="fas fa-arrow-right"></i>
				${leg.endLoc.city || leg.endLoc.cityLong || leg.endLoc.state || 'destination'}
				<small><span class='date font-weight-light'>${moment(leg.startTime).format('MMM Do')}</span></small>
				<a href="#!" legId="${leg._id}" class='legIdEdit'><i class="far fa-edit edit"></i></a>
			</article>`
			).join('')
		const _tripSection = store.trips.map( trip => `
			<section data-accordion>
				<button data-control class='expandTripButton' tripId="${trip._id}">
					 <h5 class='tripName'>${trip.name.toUpperCase()}</h5> 
					 <p class='tripDates'>${this.dateRange(trip)}</p>
				</button>
				<div data-content>
					${_legs(trip)}
					<article class='legListItem'>
						<a href='#!' class='addLegToTrip' tripId=${trip._id}><p class="font-weight-bold"><i class="fas fa-plus"></i> Add Leg to <span class='font-weight-light'>(${trip.name})</span> Trip </p></a>
					</article>
				</div>
			</section>  `
		).join('');

		const html = `
			<h2> My Trips </h2>
			<section id="tripFullList" data-accordion-group>
					${_tripSection}
			</section>
		`


		$('.leftSide').html(html)
		$('#tripFullList [data-accordion]').accordion();
		$('.legIdEdit').click(function(){
			let legId = $(this).attr('legId')
			let leg = store.trips.current.tripLegs.find(leg => leg._id === legId)
			store.trips.currentLeg = leg
			render.legForm()
		})
		$('.addLegToTrip').click(function(){
			let tripId = $(this).attr('tripId')
			store.trips.currentLeg = {}
			render.legForm()
			console.log(tripId)
		})
		$('.expandTripButton').click(function(){
			let tripId = $(this).attr('tripId')
			const trip = store.trips.find(trip=> trip._id === tripId)
			store.trips.current = trip
			tripView.render()
		})
	}

}