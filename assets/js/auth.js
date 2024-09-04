// input fields focus effect
const textInputs = document.querySelectorAll("input");
textInputs.forEach(textInput => {
    textInput.addEventListener('focus',()=>
    {
        let parent = textInput.parentNode;
        parent.classList.add("active");
    })

    textInput.addEventListener('blur',()=>
    {
        let parent = textInput.parentNode;
        parent.classList.remove("active");
    })
})

// password show/hide
const passwordInput = document.querySelector('.pass-input');
const eyeBtn = document.querySelector('.eye-btn');

eyeBtn.addEventListener('click',()=>{
    if(passwordInput.type === 'password')
    {
        passwordInput.type = 'text';
        eyeBtn.innerHTML= '<i class="fa-solid fa-eye"></i>';
    }

    else{
        passwordInput.type = 'password';
        eyeBtn.innerHTML= '<i class="fa-solid fa-eye-slash"></i>';
    }
})

// Toggling sign in and sign up

const signUpBtn = document.querySelector('.sign-up-btn');
const signInBtn = document.querySelector('.sign-in-btn');
const signUpForm = document.querySelector('.sign-up-form');
const signInForm = document.querySelector('.sign-in-form');

signUpBtn.addEventListener('click',()=>{
    signInForm.classList.add('hide');
    signUpForm.classList.add('show');

    signInForm.classList.remove('show');
})

signInBtn.addEventListener('click',()=>{
    signInForm.classList.remove('hide');
    signUpForm.classList.remove('show');

    signInForm.classList.add('show');
})

// popup forgot password
function popupToggle()
{
    
    const popup = document.getElementById('popup');
    popup.classList.toggle('live');

    const signBox = document.getElementById('vanish');
    signBox.classList.toggle('live')
    
}
