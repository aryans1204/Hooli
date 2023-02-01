import { useLoaderData, Link, Form, Redirect } from 'react-router-dom'
import {classes} from './LoginRoute.module.css'

function LoginRoute() {
    const user = useLoaderData()
    return (
        <>
            <p>Login Route Checking</p>
        </>
    )
}

export default LoginRoute;

export async function loader({request}) {
    const formData = request.formData();
    const userData = Object.fromEntries(formData);
    const response = await fetch(`http://localhost:${process.env.PORT}/api/users`, {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
            'Content-Type': 'application/json',
          },
    });
    const user = await response.json();
    return user
};
