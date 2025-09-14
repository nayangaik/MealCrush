import React from 'react'

function Register() {

    const [data , setData] = useState({
        name : "",
        email : "",
        password : "",
        confirmPassword : ""
    });

  return (
   <section className=''>

    <div className='bg-white-500 my-4 w-full max-w-lg mx-auto rounded p-4'>

        <p>Welcome to MealCrush</p>

        <form action="grid gap-2 mt-6">
            <div className='grid'>
                <label htmlFor="name">Name :</label>
                <input type="text" autoFocus className='bg-blue-50 p-2' value={data.name} onChange={handleChange}/>
            </div>
        </form>

    </div>

   </section>
  )
}

export default Register