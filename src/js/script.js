const regex = {
    'email': /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    'phone': /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
}

const siteName = 'That Big Ace Production'
const mailURL = 'https://xplusy.co.za/bigace/mail/'
const themeToggle = $('.theme-toggle')
const navbar = $('.navbar')
const whatsappButton = $('.whatsapp')
const scrollToTop = $('.scroll-top')
const socialMedia = $('.social-media')
const contacts = $('.contacts')

$('body').prepend(`<div id="preloader">${ siteName }</div>`).css({'overflow': 'hidden'})

$(window).on( 'load', function() {
    $('#preloader').remove()
    $('body').css({'overflow': 'auto'})
    
    AOS.init({
        duration: 900,
        once: true,
    })
})

const galleryImages = $('.gallery .item .image')
const galleryVideos = $('.gallery .item .video')

if(galleryImages) {
    galleryImages.each(function(index, image){
        image.innerHTML = '<i class="ri-image-fill" id="icon"></i>'
    })
}

if(galleryVideos) {
    galleryVideos.each(function(index, video){
        video.innerHTML = '<i class="ri-video-line" id="icon"></i>'
    })
}

if(localStorage.getItem('siteTheme')) {
    $('body').addClass('dark')
    themeToggle.html('<i class="ri-sun-line"></i>')
}else{
    themeToggle.html('<i class="ri-moon-fill"></i>')
}

window.onscroll = function() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        themeToggle.addClass('dark')
        navbar.addClass('dark')
        whatsappButton.addClass('move')
        fadeIn(scrollToTop, 'slow')
        fadeOut(socialMedia, 'slow')
        fadeOut(contacts, 'slow')
    } else {
        themeToggle.removeClass('dark')
        navbar.removeClass('dark')
        whatsappButton.removeClass('move')
        fadeOut(scrollToTop, 'slow')
        fadeIn(socialMedia, 'slow')
        fadeIn(contacts, 'slow', 'flex')
    }
}

$('section').scrollWatchMapTo('.navbar ul > li', 'active', {})

$('.gallery').magnificPopup({
    delegate: 'a',
    type: 'image',
    gallery: { enabled: true },
    closeOnBgClick: false,
    callbacks: {
        elementParse: function(item) {
            if(item.el[0].className === 'video') {
                item.type = 'iframe'
                item.disableOn = 700
                item.mainClass = 'mfp-fade'
                item.removalDelay = 160
                item.preloader = false
                item.fixedContentPos = false
            } else {
                item.type = 'image'
            }
        }
    }
})

function contactForm(form) {
    const formData = new FormData(form)
    
    const formRes = $('.form-res')
    const nameRes = $('#name-group .res')
    const emailRes = $('#email-group .res')
    const phoneRes = $('#phone-group .res')
    const messageRes = $('#message-group .res')
    
    const contactButton = $('#contact-button')
    const contactButtonHTML = contactButton.html()
    contactButton.html('Loading...')

    const resClose = document.createElement('div')
    resClose.setAttribute('class', 'close')
    resClose.innerHTML = '<i class="ri-close-line"></i>'

    fetch(mailURL, {
        'method': 'POST',
        'body': formData
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === 'validation' && data.message.name != null) {
            nameRes.text(data.message.name)
        }else{
            nameRes.text('')
        }
        
        if(data.status === 'validation' && data.message.email != null) {
            emailRes.text(data.message.email)
        }else{
            emailRes.text('')
        }

        if(data.status === 'validation' && data.message.phone != null) {
            phoneRes.text(data.message.phone)
        }else{
            phoneRes.text('')
        }

        if(data.status === 'validation' && data.message.message != null) {
            messageRes.text(data.message.message)
        }else{
            messageRes.text('')
        }

        if(data.status === 'validation') {
            formRes.css('display', 'none')
            contactButton.html(contactButtonHTML)
        }

        if(formRes.hasClass('error')) {
            formRes.removeClass('error')
        }

        if(data.status === 'success') {
            form.reset()

            formRes.css('display', 'block')
            formRes.text(data.message)
            formRes.append(resClose)
            contactButton.html(contactButtonHTML)

            resClose.addEventListener('click', function() {
                formRes.css('display', 'none')
            })
        }

        if(data.status === 'fail') {
            formRes.addClass('error')
            formRes.css('display', 'block')
            formRes.text(data.message)
            formRes.append(resClose)
            contactButton.html(contactButtonHTML)

            resClose.addEventListener('click', function() {
                formRes.css('display', 'none')
            })
        }
    })
    .catch(() => {
        formRes.addClass('error')
        formRes.css('display', 'block')
        formRes.text('Unable to connect to mail server.')
        formRes.append(resClose)
        contactButton.html(contactButtonHTML)

        resClose.addEventListener('click', function() {
            formRes.css('display', 'none')
        })
    })
}

function changeTheme() {
    $('body').toggleClass('dark')
    
    if ($('body').hasClass('dark')) {
        localStorage.setItem('siteTheme', 'dark')
        themeToggle.html('<i class="ri-sun-line"></i>')
    }else{
        localStorage.setItem('siteTheme', '')
        themeToggle.html('<i class="ri-moon-fill"></i>')
    }
}

function toTop() {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    parent.location.hash = 'home'
}

function closeNavbar(target) {
    $(target).removeClass('show')
}

function openNavbar(target) {
    $(target).addClass('show')
}

function fadeIn(el, speed, property = 'block') {
    el.fadeIn(speed, function() {
        this.style.display = property
    })
}

function fadeOut(el, speed, property = 'none') {
    el.fadeOut(speed, function() {
        this.style.display = property
    })
}