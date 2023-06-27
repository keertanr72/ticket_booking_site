const loginUser = async (event) => {
    const email = event.target.email.value
    const password = event.target.password.value

    event.preventDefault()

    document.getElementById('loginError').innerHTML = ''

    document.getElementById('loginSpinner').innerHTML = 
    `<strong>Loading...</strong>
    <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>`

    const obj = {
        email: email,
        password: password
    }
    
    try {
        const userData = await axios.post('http://http://3.95.218.68:3000/user/login', obj)
        alert('success')
        document.getElementById('loginSpinner').innerHTML = ''
        localStorage.setItem('token', userData.data.token)
        window.location.href = "/html/bookingSite.html"
    } catch (error) {
        document.getElementById('loginSpinner').innerHTML = ''
        document.getElementById('loginError').innerHTML = `<p style="color: red;">${error}</p>`
        if(error.response.status === 401)
        document.getElementById('loginError').innerHTML += `<p style="color: red;">Wrong password</p>`
        if(error.response.status === 404)
        document.getElementById('loginError').innerHTML += `<p style="color: red;">User doesn't exist!</p>`
        console.log(error.response.status)
    }
}