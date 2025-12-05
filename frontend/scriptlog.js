if(localStorage.getItem("token2"))
{
  window.location.href="/index.html"
}

document.querySelector(".login-btn").addEventListener("click",async ()=>{
  const username=document.querySelector(".user").value
  const password=document.querySelector(".pass").value
  if(username!="" && password!="")
  {
    try{
        const data=await fetch("/login",{
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify({username,password})
        })
        const newdata=await data.json()
        if(newdata.success)
        {
            localStorage.setItem("token2",newdata.token)
            localStorage.setItem("ExpenseUsername",username)
            window.location.href="/index.html"
        }
        else{
            alert(newdata.message)
        }

    }catch(err){
      console.log(err)
    }
  }
  else{
    alert("Please enter username and password")
  }
})
document.querySelector(".register-btn").addEventListener("click",async ()=>{
  const username=document.querySelector(".user").value
  const password=document.querySelector(".pass").value
  if(username!="" && password!="")
  {
    try{
        const data=await fetch("/register",{
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify({username,password})
        })
        const newdata=await data.json()
        if(newdata.success)
        {
            alert(newdata.message)
            window.location.href="/login.html"
        }
        else{
            alert(newdata.message)
        }

    }catch(err){
      console.log(err)
    }
  }
  else{
    alert("Please enter username and password")
  }
})