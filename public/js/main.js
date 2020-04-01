$("#launch").click( () => {
  $("#smith-container").toggle("fast");
})

function sendEmail(){
  let form = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  }
  
  const send = validate_form(form)
  if(send){
    fetch('/contact', {
      method: 'POST',
      body: JSON.stringify(form),
      headers:{'Content-Type': 'application/json'}
    }).then(res => res.json())
    .then((resp) => {
      let but = document.getElementById('btnEmail').style
      if(resp.status){
        but.background = '#fff'
        but.color = '#d060df'
        but.borderColor = '#d060df'
      }else{
        but.background = '#ce110a'
        but.color = '#fff'
        but.borderColor = '#420200'
      }

    });
  }

}


function validate_form(data){
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  let val = true

  for(let key in data){
    if(!data[key]){
      val = false
      document.getElementById(key).style.borderBottomColor = '#ce110a'
    }else
      document.getElementById(key).style.borderBottomColor = '#999'
  }

  if(!val)
    return false
  else{
    if(re.test(data.email))
      return true
    else{
      document.getElementById('email').style.borderBottomColor = '#ce110a'
      return false
    }
      
  }

}