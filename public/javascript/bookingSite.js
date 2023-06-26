// Define an array to store the selected seats
var selectedSeats = [];
let data = []
const token = localStorage.getItem('token')
// Function to handle seat selection
function handleSeatSelection() {
    var seatNumber = this.dataset; // Retrieve the seat number from the data attribute

    // Toggle seat selection
    if (this.classList.contains('selected')) {
        this.classList.remove('selected');
        selectedSeats = selectedSeats.filter((seat) => seat !== seatNumber);
    } else {
        this.classList.add('selected');
        selectedSeats.push(seatNumber);
    }
}

// Function to handle submit button click
async function handleFormSubmit() {
    // console.log("Selected Seats:", selectedSeats);
    try {
        await Promise.all(selectedSeats.map(async (ele) => {
            let temp = await axios.get(`http://localhost:3000/seats/${ele.seatNumber}?class=${ele.seat_class}`);
            data.push(temp.data);
        }));
        data.forEach(ele => {
            console.log(ele);
        });
        localStorage.setItem('dataArray', JSON.stringify(data))
        window.location.href = "/html/orderPage.html";
    } catch (error) {
        console.log(error)
        alert('oops... Seat has already been booked by someone')
        location.reload()
    }
}


// Function to dynamically generate seats
const loadingContents = async () => {
    const seatData = await axios.get('http://localhost:3000/seats');

    // Define the number of seats
    var numberOfSeats = seatData.data.seats.count;

    // Get the seat container element
    var seatContainer = document.getElementById('seatContainer');

    // Generate the seats dynamically
    for (var i = 0; i < numberOfSeats; i++) {
        var seat = document.createElement('div');
        seat.classList.add('seat');

        // Get the seat data for the current index
        var currentSeatData = seatData.data.seats.rows[i].seat_class;
        var seatNumber = seatData.data.seats.rows[i].seat_identifier;

        // Set the seat text and color
        seat.textContent = currentSeatData;
        seat.dataset.seatNumber = seatNumber; // Store the seat number in a data attribute
        seat.dataset.seat_class = currentSeatData; // Store the seat number in a data attribute
        if (seatData.data.seats.rows[i].isBooked) {
            seat.classList.add('reserved');
        } else {
            seat.addEventListener('click', handleSeatSelection);
        }

        seatContainer.appendChild(seat);
    }

    // Add event listener to submit button
    var submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', handleFormSubmit);
};

loadingContents();

document.getElementById('previousOrdersBtn').addEventListener('click', async () => {
    let userData = await axios.get('http://localhost:3000/booking', { headers: { 'Authorization': token } })
    console.log(userData)
    let addHere = document.getElementById('oldOrderText')
    if(userData.data.orderDetails.length === 0) {
        alert('No orders Yet!!')
        return
    }
    userData.data.orderDetails.forEach((ele) => {
        addHere.innerHTML += `<li>orderId: ${ele.id}; createdAt: ${ele.createdAt}; totalAmount: ${ele.totalAmount}</li>`
    })
})