const dataArray = localStorage.getItem('dataArray');
const data = JSON.parse(dataArray);

document.addEventListener('DOMContentLoaded', function() {
    data.forEach(ele => {
        document.getElementById('seats-container').innerHTML += `
        <div class="seat" id="seat1">
            <span class="seat-id">${ele.seat_identifier}</span>
            <span class="seat-class">${ele.seat_class}</span>
            <span class="seat-price">$${ele.price}</span>
        </div>
        `;
    });

    const seats = document.querySelectorAll('.seat');
    const bookedSeats = document.getElementById('booked-seats');
    const totalPrice = document.getElementById('total-price');
    const orderButton = document.getElementById('order-button');

    let selectedSeats = [];
    let total = 0;

    seats.forEach(seat => {
        const seatId = seat.querySelector('.seat-id').textContent;
        const seatClass = seat.querySelector('.seat-class').textContent;
        const seatPrice = parseFloat(seat.querySelector('.seat-price').textContent.slice(1));

        seat.addEventListener('click', function() {
            if (!selectedSeats.includes(seat)) {
                selectedSeats.push(seat);
                seat.classList.add('selected');
                total += seatPrice;
                bookedSeats.innerHTML += `<li>${seatId} - ${seatClass}</li>`;
            } else {
                selectedSeats = selectedSeats.filter(selectedSeat => selectedSeat !== seat);
                seat.classList.remove('selected');
                total -= seatPrice;
                const seatDetails = `<li>${seatId} - ${seatClass}</li>`;
                bookedSeats.innerHTML = bookedSeats.innerHTML.replace(seatDetails, '');
            }
            totalPrice.textContent = `Total Price: $${total.toFixed(2)}`;
        });
    });

    totalPrice.textContent = `Total Price: $${total.toFixed(2)}`;

    orderButton.addEventListener('click', async () => {
        try {
            const token = localStorage.getItem('token')
            const membershipData = await axios.post('http://http://3.95.218.68:3000/booking', { data }, { headers: { 'Authorization': token } })
            console.log(membershipData)
            const options = {
                'key': membershipData.data.key_id,
                'order_id': membershipData.data.order.id,
                'handler': async (membershipData) => {
                    const orderDetails = await axios.post('http://http://3.95.218.68:3000/booking/payment-success', {
                        order_id: options.order_id,
                        payment_id: membershipData.razorpay_payment_id,
                        data
                    }, { headers: { 'Authorization': token } })
                    alert('Payment Successful')
                    // console.log(orderDetails)
                    window.location.href = "/html/redirectEmail.html"
                }
            }
            const rzp1 = new Razorpay(options)
            rzp1.open()
            rzp1.on('payment.failed', async () => {
                await axios.put('http://http://3.95.218.68:3000/booking/payment-fail', { data }, { headers: { 'Authorization': token } })
                console.log('payment failed')
            })
        } catch (error) {
            console.log(error)
        }
    });
});