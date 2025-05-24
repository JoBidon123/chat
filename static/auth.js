const registerForm = document.getElementById('register-form')
const loginForm = document.getElementById('login-form')
registerForm?.addEventListener('submit', (event) =>{
    event.preventDefault()
    const {username, password, confirmPassword} = registerForm
    if(password.value !== confirmPassword.value){
        return alert('Паролі не співпадають')
    }
    const user = JSON.stringify({
        login: username.value,
        password: password.value
    })
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/register')
    xhr.send(user)
    xhr.onload = () => alert(xhr.response)
    registerForm.reset()
})
loginForm?.addEventListener('submit', (event) =>{
    event.preventDefault()
    const {username, password} = loginForm
    const user = JSON.stringify({
        login: username.value,
        password: password.value
    })
    console.log(user)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/login')
    xhr.send(user)
    xhr.onload = () => {
        if (xhr.status === 200){
            const token = xhr.response
            document.cookie = `token=${token}`
            window.location.assign('/')
        }else{
            return alert(xhr.response)
        }
    }
})