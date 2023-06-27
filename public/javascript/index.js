const createUser = async (event) => {
    const userName = event.target.userName.value
    const email = event.target.email.value
    const phoneNumber = event.target.phoneNumber.value
    const password = event.target.password.value
    
    event.preventDefault()

    document.getElementById('signUpError').innerHTML = ''

    try {
        const check = await axios.post(('http://3.95.218.68:3000/user/sign-up/check-email'), { email })
    }
    catch (error) {
            document.getElementById('signUpError').innerHTML = '<p style="color: red;">This email EXISTS!!</p>'
            return
    }

    if (!/[6-9]/.test(phoneNumber[0]) || phoneNumber.length !== 10) {
        document.getElementById('signUpError').innerHTML = `<p style="color: red;">Enter a valid phone number</p>`;
        return;
    }

    const userDetails = {
        userName: userName,
        email: email,
        phoneNumber: phoneNumber,
        password: password
    }

    try {
        const data = await axios.post('http://3.95.218.68:3000/user/sign-up', userDetails)
        if (data.status === 201) {
            alert('success')
            window.location.href = "/html/login.html"
        }
    }
    catch (err) {
        console.log(err)
    }
}