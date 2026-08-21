import { useState } from 'react'

const Login = ({ user, handleLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLoginSubmit = async (event) => {
        event.preventDefault()
        const success = await handleLogin(username, password)

        if (success) {
            setUsername('')
            setPassword('')
        }
    }

    const loginForm = () => {
        return (
            <form onSubmit={handleLoginSubmit}>
                <div>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </label>
                </div>
                <button type="submit">Login</button>
            </form>
        )
    }

    return (
        <div>
            {!user &&
                <>
                    <h2>Login to the Blogs application!</h2>
                    {loginForm()}
                </>
            }
        </div>
    )
}

export default Login