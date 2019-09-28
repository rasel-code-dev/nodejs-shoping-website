let notifications = document.querySelectorAll('.notification')
for(let n of notifications){
  setTimeout(hideNotification, 4000)
  function hideNotification(){
    n.classList.add('noti-hide')
  }
}